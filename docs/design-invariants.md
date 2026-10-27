# 设计不变式

本文件记录几条**不可违反**的设计约定。改动 `src/client/skin.css`、`palette.jsx`
或任何与外观相关的代码前先读一遍；`pnpm check` 中的 `scripts/verify-skin.mjs`
会把第 1、2 条当作硬性断言。

---

## 1. 「原色」只换颜色，不换布局

**这是最重要的一条。**

「原色」（`palette: none`，`localStorage['dsh-plugin-ui.palette'] === 'none'`）
的含义是：**保留插件的全部布局与结构，只把配色层换成客户端自身的颜色。**

它**不是**「还原成官方界面」。选择原色时：

| 项目 | 原色下 |
|---|---|
| 侧栏浮动卡片（5px 外边距 + 四角 16px 圆角） | ✅ 保留 |
| 侧栏内边距（16px） | ✅ 保留 |
| New Session 浮卡按钮（白底 + 阴影 + 圆角） | ✅ 保留，图标取客户端自身的蓝 |
| 模型选择器单卡布局、行高、字号 | ✅ 保留 |
| 时间线与卡片几何 | ✅ 保留 |
| **`PALETTE_LAYERS` 配色层** | ❌ 不注入（这是原色唯一改变的） |

因此：**任何属于布局/结构的 CSS 都不得用 `html[data-dsh-palette]` 守卫。**
`data-dsh-palette` 只用于「配色层相关的表面重着色」，例如：

- 侧栏 rail 的半透明 tint（配色相关，原色下用官方 tint）
- Windows 上把 `--dsw-specific-sidebar-fill` 重定义为 rail 色（配色相关）

判断标准：**把 `PALETTE_LAYERS` 抽走之后，这条规则还应不应该生效？**
应该 → 不要加守卫；不应该 → 加守卫。

### 曾经犯过的错

- v0.1.12–0.1.14：把浮动卡片、16px 内边距、New Session 浮卡都套了
  `html[data-dsh-palette]` 守卫，导致选原色时整个设计塌回官方贴边布局。
  v0.1.15 修正。

---

## 2. 只碰插件自己拥有的表面

插件的样式只能作用于壳的 CSS-module 表面（用后缀匹配，前缀每次构建都变）：
`_frame`、`_sidebarCol`、`_centerCol`、`_rightbarCol`、`_bottomRow`、
`_composerStack`、`_panelRow`、`_panelList`、`_footArea`、`_sectionHeader`、
`_projectRow`、`_sessionRow`、`_newSession`、`_header`、`_root`、`_card` 等
（完整清单见 `scripts/verify-skin.mjs` 的 `PLUGIN_SURFACES`）。

不在清单里的表面视为壳自有渲染，**写规则会被 `verify-skin` 拒绝**。
确有必要新增表面时，先在 `PLUGIN_SURFACES` 里显式登记并说明理由。

承载文字的工作区表面（输入框卡片、用户气泡、文件卡片）不在 `PLUGIN_SURFACES`
里，而是登记在 `GLASS_SURFACES`——它们必须同时带 `data-dsh-glass` 门槛才放行，
因为底板关掉时这些规则一经生效就等于重绘了壳自己的界面。

另外：

- 不得命中 `html` / `body` / `*` 作为被样式化的目标（作为祖先作用域可以）
- 皮肤规则里不得出现写死的颜色字面量（`#rrggbb`），一律走 `--dsw-*` / `--dpui-*` 令牌

---

## 3. macOS 与 Windows 的分工

- **共享规则**（无平台守卫）：两个平台都生效的布局与结构
- **`html:not([data-platform='darwin'])`**：Windows 专属的层次补偿
  （没有 vibrancy，需要不透明实色承担对比）
- **`html[data-platform='darwin']`**：mac 专属的透光处理

mac 的深度来自 vibrancy 透光，Windows 没有这层材质，只能靠实色近似——
因此两侧的侧栏色公式刻意对齐（mac 用 88/12 半透明叠 vibrancy，Windows 用
90/10 实色），中段差异控制在 1–2 个色阶。

---

## 4. 验证方式

```sh
pnpm check          # 构建 + 语法 + 皮肤契约 + 类型检查
```

`scripts/verify-skin.mjs` 校验：

1. Windows 专属的 `--dpui-rail` 规则必须带平台守卫
2. 带守卫的规则中不得出现写死颜色
3. 每条 mac 可达规则必须命中 `PLUGIN_SURFACES` 或带皮肤守卫
4. 不得有规则把 document 根当作样式化目标

`scripts/rotate-smoke.mjs` 用假时钟驱动壁纸轮换控制器（间隔、补跑、回绕、
关闭态、空底板不动、手动重置）。它按 `group` 断言：轮换只走照片与渐变，
纯色地（White / Off White / Light Gray / Graphite）不在轮换序列里——每几小时
把底板换成一片纯白是坏结果，它们只供手动选。

`scripts/contrast-check.mjs` 把所有配色 × 明暗 × 每档毛玻璃 × 纯白/纯黑底
逐层合成，检查承载文字的表面在**最差情况下**仍达 AA。地板的数值从
`skin.css` 的 `--dpui-frost-floor` 读回，改地板会被立刻验证，不需要同步两份。

改动外观后，除了跑 `pnpm check`，还应在应用里**逐个配色（含原色）× 明暗**
看一眼，确认布局一致、只有颜色不同。

---

## 5. 组件作用域：新增或改动组件 props 时

`tsconfig.json` 只覆盖 `*.ts` / `*.tsx`，而本插件的全部渲染路径都在 `.jsx`
里。因此 `esbuild`、`tsc`、皮肤契约三者**都看不见** `.jsx` 中的自由变量，
而自由变量在 render 期抛 `ReferenceError` 会让 React 卸载整个组件树。

已经发生过两次，症状都是「账号行整行消失、齿轮按钮不见、字号也不对」——
因为用户看到的是宿主自己的账号行：

| 版本 | 错误 | 位置 |
| --- | --- | --- |
| v0.1.26 | `groundState` 在 `QuickActionSeat` 中被引用，却定义在四层之上的 `AccountMenu` | 少传一层 props |
| v0.1.28 | `quickSettingsView` 函数体用了 `ground`，参数表里却没有 `ground` | 改了函数体忘了改签名 |

这两次都不是逻辑错，是**签名与函数体不同步**。因此：

1. 新增一个 prop 或函数参数时，必须同时改三处：**函数签名、父组件传参、订阅/副作用**。
   只改函数体是这套代码库里最容易漏的一步。
2. 不要用 `...rest` 转发组件 props。`QuickActionsRow` 原本用 `{...seatProps}`，
   把「座位到底依赖哪些值」隐藏掉了；现已改为显式逐项传递。
3. 跑 `node scripts/check-scope.mjs`（已接入 `pnpm check`）。它用 TypeScript 的
   `checkJs` 覆盖全部 `.jsx`，只对 `TS2304` / `TS2552`（找不到名字）报错并退出 1。
   其他诊断（第三方模块缺声明、JSDoc 格式）只计数不阻断。

改动账号行、快捷菜单、设置行这类**被多处注入的组件**后，务必确认浏览器里
该行仍在渲染，而不是只看构建通过。

---

## 6. 底板透明度的分层

毛玻璃不是「全部透明」，而是按**表面是否承载文字**分层：

| 层 | 处理 | 位置 |
|---|---|---|
| 底板 / 会话根 | 完全透出（滑条控制） | `_frame`、`_centerCol`、`_root` |
| 侧栏 | 同配方，**高一线**（`--dpui-sidebar-elevation` 0.03，blur 30px；v0.1.38 从 0.12 降下——用户要求侧栏只比工作区稍重甚至持平，强调只留给 New Session 芯片） | `_sidebarCol` |
| 承载文字的表面 | 卡片海拔：底板 + 0.10，夹在 [0.46, 0.96] | `_fileCard`；`_bubble` 与 `.md-code-block` v0.1.39/40 起改走面板曲线（见下），v0.1.52 起 tint-only、无 blur；composer v0.1.49 起退出曲线体系（见下） |
| 模糊的轻重排序（v0.1.37 定序；v0.1.49 composer、v0.1.51 行内 chip、v0.1.52 气泡与代码卡相继摘除；侧栏芯片/选中行 A/B 后保留——摘掉只省 3.7% 层像素却让两块小面整体变色，见 AGENT.md §4） | `_newSession` 最重（`滑条 × 34px + 12px`）＞ 特殊字段体（`[data-tool]` 的 ioCard、`[data-terminal]`、`[data-web]`、`[data-search]`，30px + 8px）与 `_fileCard`（30px + 8px）——列内最后两个仍有 blur 的岛屿（工具体按需挂载，尚未真机 A/B）＞ 两列（30px / 22px × 滑条，无地板）；`.md-code-block`、`_bubble`、行内 chip **均无 blur**（层内存免疫，见下）；`[data-composer-card]` **无 blur**（v0.1.49）；alpha 曲线按表面各归各：芯片曲线见下，其余在卡片/侧栏曲线上 | 各表面的 `backdrop-filter` |
| New Session 芯片 alpha | 专属**乘法涂层**曲线 `max(0.20, (1-滑条) × 0.55)`：芯片叠在侧栏涂层之上，实覆盖率 = s + c·(1-s)，天然贴着侧栏走（滑条 0.35 时芯片实测 L≈50 vs 侧栏 70–93，此前是黑贴纸 L≈26）。**填色必须用侧栏同款混料**：`sidebar-fill` 混 12% 品牌色（与侧栏涂层同配方）——直接填生 token 会在暗色调色板下比轨道暗两档。v0.1.38 第三修：斜率本由强制 AA 档反推到 0.90，但那把芯片重新填实（L≈45）；v0.1.38 末把审计改成增量模型后斜率回落 0.55。v0.1.41：workspace 里**选中的会话行**（`_sessionRow_selected`）同材质——原本不透明 `interactive-bg-active` 灰板（rgb 223）换成芯片同款合成填充 + `34px+12px` blur。v0.1.43 扩到同栏其余两个选中态（`_searchResultRow_selected`、`_panelRow_panelActive`）：三者原本共用同一条 active-fill structural 规则、语义同为"你在哪"，会话行单独结霜后同栏出现两种选中材质才是更大的不一致；审计复用 newSession 用例。v0.1.42：行 hover 进材质——壳的不透明 hover 填充（rgb 239）在玻璃门下换成 40% neutral-00 薄纱（与 Windows 行 hover 同配方），hover 不再比选中行实 | `_newSession` 的玻璃规则、三个选中行的玻璃规则、行 hover 玻璃规则 |
| 面板（用户气泡 + 代码卡）| 专属乘法曲线 `max(0.30, (1-滑条) × 0.62)`（v0.1.39）：卡片曲线下这些眼睛平视最多的表面读成板（代码卡比洗色亮 +27L）。代码卡直接从快照基色刷、不走共享 token——token 与特殊字段体共享，动 token 会带走没被点名的表面（强调范围要窄）。**v0.1.49 composer 起、v0.1.52 气泡与代码卡起退出 blur**：面板曲线只管 tint；列内 descendant backdrop-filter 会为每个表面复制一张整列离屏面（见下行），v0.1.52 摘除后同屏 91→52 层、141.4M→95.6M、整列面 18→5，视觉差异集中在卡头部条带与气泡自身 | `_bubble`、`.md-code-block`（含 `_header`、`_bannerWrap`） |
| composer 丢层免疫：固定 0.85 纯 tint、无 blur（v0.1.49） | 合成器会静默丢弃采样滚动内容的 fixed 元素 blur，composer 是其中之一（2026-10-26 六起，后两起重启后约 1 分钟即丢——健康态住不进去，按丢层态决策）。真机六格对比：0.85 纯 tint 残影是常驻淡影几乎无感；0.92 无痕但读成实心板；0.40 无 blur 是正文清晰穿透的事故。故 composer 摘除 backdrop-filter、不走任何曲线，`background` 固定 `color-mix(input-major 85%, transparent)`——blur 死活与它无关，观感恒定；唯一放弃霜感的表面，其余玻璃从未丢层。仪器坑：composer 规则带 `!important`，CDP 验证 tint 必须 `setProperty(..., "important")`，普通 inline 会被压住 | `[data-composer-card]`（verify-skin GLASS_SURFACES 例外名单） |
| 行内代码 chip | 装饰级乘法曲线 `max(0.22, (1-滑条) × 0.40)`（v0.1.39）：卡片曲线下近白 token 合成 +20L 白瓷砖，降到 +9~11L；v0.1.51 起**无 blur**：后代的 backdrop-filter 被裁到最近的 backdrop root（中央列），每个 chip 因此申请一张整列大小（1984×1624 设备像素）的离屏 backdrop surface——一屏 73–92 张、芯片共 142 层 / 242M 层像素 = 全树 67%（CDP 层树实测）；摘除后同屏 221→79 层、362.9M→120.8M 像素（−68%），全页像素 A/B 仅芯片边缘变化（0.61%）。12px blur 糊在平铺正文上本就不可见，tint 独立承担芯片。v0.1.52 把同一原则推广到气泡与代码卡：列内常驻 backdrop-filter 清零（累计 −74%），只剩按需工具体与附件卡 | `_markdown` 内联 `code`（排除块代码） |
| 微型状态件 | 顺组件自己的家族逻辑，不新开曲线（v0.1.45）：状态标签 `_tag` 的 success/info/warning/danger tone 本就是 10–12% 透色 tint，只有 neutral tone（exit code 徽标）刷不透明 `bg-module-platform`——玻璃门下降到同款 12%；solid tone 反白不动（芯片世界的主按钮）；`Stopped` 药丸刷 `interactive-bg-hover`（与行 hover 同 token），玻璃门下取 40% neutral-00 薄纱 | `[class*="_tag"][data-tone='neutral']`、`[class*="_centerCol"] [class*="_stopped"]`（`_tag` 在 GLASS_SURFACES 例外） |
| 强调孤岛（代码段、特殊字段体、上下文行、命令卡） | 同一卡片海拔，经 `_centerCol` 上的 `--dsw-alias-markdown-code-block`（及 banner token）重定义结霜；基色在 `_frame` 上快照，避免同元素自引用环 | 「很白的实块」按用户要求全部进毛玻璃（v0.1.36） |
| 玻璃丢层两个变种分治（2026-10-27 更新）：**丢 blur 变种**无预防、无自愈（2026-10-26 六起定论），composer 已设计免疫（v0.1.49 固定 0.85 tint）；**丢文字变种可自愈**——rc.3 首绘丢正文栅格（chips/KaTeX 在、正文没了，DOM 与 computed style 完整），静置不自愈，对滚动容器 ±1px 同步往返滚动即愈且治愈稳定（2026-10-27 CDP 实锤），勿查文字色 | 合成器会静默丢弃采样滚动内容的 fixed 元素 blur（顶栏、composer），也会把滚动容器本身的文字层整批丢掉。页面内一切自救实测无效，CSS 预防两条也失败：滚动容器 `will-change: scroll-position` 实锤有害（隔离 backdrop root、整窗白板）；composer 卡 `will-change: transform` 无害但防不住，已删。**丢 blur 复发只能重启**；丢文字由 v0.1.50 的重绘清扫自愈（`repaint-sweep.js`：boot 重试 + 对话列变更防抖，单任务 ±1px 往返，无 inline 残留；v0.1.55 起观察器只挂对话列与侧栏区域，不再挂 body）；composer 靠摘除 blur + 固定高 tint 免疫（上行），`_material` 24px 仅作降载保留。**发病的结构性放大器（v0.1.51/52 已逐层摘除）：后代 backdrop-filter 复制一张祖先尺寸的 backdrop surface**——芯片曾占全树 67% 层像素；v0.1.52 再摘气泡与代码卡，列内常驻 backdrop-filter 清零，同屏 91→52 层、141.4M→95.6M、整列面 18→5（相对剥离前 362.9M 累计 −74%）；rc.3 与 rc.2 渲染代码逐文件比对无差异，变量是重启 + 长会话把层内存推过 macOS Metal/vibrancy 阈值（Windows D3D/acrylic 不受影响） | 勿再加 will-change；勿用 rAF/inline 样式做守护（v0.1.47 教训）；勿给对话列内小件加 blur |
| 菜单 / 弹窗 / toast / 输入框下渐变条 | toast 与渐变条保持原样；菜单/弹窗 v0.1.39 起拆掉 `_backing` 垫底（壳的浮层 primitive 本是毛玻璃 `_material` + 不透明纸白 `_backing` 两层，垫底把玻璃垫死成固定白盒）——玻璃模式下垫底透明，`_material` 自带涂层干活；非玻璃/原色模式垫底保留。v0.1.47：`_material` 的 blur 在玻璃门下 40px 降到 24px（全窗最重的 backdrop 层，也是合成器内存压力下最先整批丢弃的那类层——2026-10-26 事故所有 blur 层同时消失、tint 仍在；已糊地面上 24px 读不出差别，"原色"模式保留 40px）。v0.1.44：整页视图（自动化任务页、同族设置页）的纯白 page 板同样在玻璃门下置透明，露出柱子霜；页面控件保留填充。v0.1.46：dock 空面板宿主（`data-dockkit-empty`，"Empty pane"）同待遇——潜伏白板，当前窗口恰在屏幕外。**插件自有浮层无需另做**（实测修正）：账号菜单、快捷设置、模型卡、rc.3 侧栏 More 菜单都渲染进壳的 Menu/MenuSurface（`_surface`）primitive，绘画层就是 `_material`，垫底一拆它们自动跟上玻璃——插件 `.module.css` 只画控件不画容器；官方往 `_panelList` 加新行（如 rc.3 的 More）也自动吃齐行样式与钉位，零跟改 | `[class*="_backing"]`、`[class*="_centerCol"] [class*="_page"]`、`[data-dockkit-empty]`（均玻璃门控内，`_backing`/`_page`/`_material`/dockkit-empty 在 verify-skin GLASS_SURFACES 例外） |

卡片曲线 `--dpui-frost-alpha = min(0.96, max(0.46, (1-滑条) + 0.10))`：
卡片永远比身后的底板「高一层」，但高得有限——最高不到纯不透明（留 4% 透出，
让它归属同一片水洗），最低不低于地板。海拔 0.10 是 v0.1.37 从 0.28 降下来
的：0.28 时「轻/中」两档算出 0.88–0.93，强调孤岛读起来仍是白实块，滑条要到
「强」才见玻璃。地板 0.46 是 v0.1.38 从 0.78 降下来的：0.78 在整个常用区间
（滑条 0.32 以上）都把曲线托成常数，滑条搬不动 alpha，用户读成「几乎不模糊、
就是一块块突兀的白板」；0.46 让中段回到曲线上（默认档 0.60）、「强」以后落在
地板上。侧栏只比工作区高一线（海拔 0.03，v0.1.38 从 0.12 降下；强调只留给
New Session 芯片）；两列在滑条顶端仍都会清空。
另外：composer 座位的渐变淡出条在玻璃下一并清空（它是输入框背后的「第三位
画手」，不清空则结霜叠在纯白上），规则挂在 `_composerSeat` 上。

三条边界，改动前先读：

1. **AA 保证到中段为止，且只管「增量」**。`contrast-check.mjs` 对滑条 ≤ 0.5
   的每一档强制 4.5:1——但仅当表面身后的洗色（底板/轨道）对同一文字本身已
   达标：表面只对自己相对底板的增量负责。病态角落（暗色×纯白壁纸、浅色×纯黑
   壁纸）里轨道自己就不达标，落在轨道上的表面一律报告不拦截——那是拨杆的
   代价。超过中段同样只报告。地板 0.46 / 芯片 0.20·0.55 是「保证档」允许的
   最低值；想再降，先跑审计，审计的曲线是从 skin.css 读回来的，改了变量它
   自动跟着验。
2. **代码块的结霜是产品决策，不是默认**：历史上「代码块不能透」是因为
   shiki 按不透明底色挑语法配色。v0.1.36 起用户明确要求代码段与特殊字段体
   一起结霜，透的幅度由卡片曲线（中段 0.60、地板 0.46）夹住，`contrast-check` 对
   `codeBlock`/`codeBanner` 以 label-primary 在保证档（滑条 ≤ 0.5）验到 AA——但
   **shiki 语法色本身不在审计内**（如浅色注释色本来就低于 AA），透底只会
   再降一点。若日后觉得代码掉对比度，先收紧代码的 alpha 曲线，而不是整个
   撤掉结霜。内联代码片的规则仍排除块级代码（`code:not([data-code-block-content] code)`），
   否则会和 token 结霜叠加双重混合。
3. **浮层不能透**：菜单、弹窗、toast 一旦让底板透过来，就等于读不清。

选择器里没有「无壁纸」这一格（v0.1.54 起），新装的底板总是一张预设。
老库存的「无」仍然是**空底板**：这个值解析成 `none`，`_frame` 自己的
填充被清空，于是底板完全透明，露出窗口自己的材质（mac 是 menu vibrancy，
Windows 是 acrylic）。

**它不改变左右两侧**。`_sidebarCol` / `_centerCol` 的着色始终只由滑条决定，
底板空不空不得强制它们变透明——曾经这么写过一版，等于让壁纸的选择去篡改滑条
的语义。滑条拉到 1 时两列本来就完全透出，那才是控制它的地方。
