# AGENT.md — dsh-plugin-ui 修改维护手册

写给以后接手修改的 agent / 人：每个模块长什么样、改哪、怎么改、改完怎么验证。
原则（来自实际踩坑，违反过就会返工）：

1. **改曲线必改审计**：skin.css 里每条 alpha 曲线在 `scripts/contrast-check.mjs` 都有对应建模，两边不同步审计就会失真。
2. **不硬编码颜色**：颜色一律走 `--dsw-*` token；插件自己的新变量用 `--dpui-*` 前缀，声明在 `[class*="_frame"]`（或 body）上。
3. **每个 `var()` 带 fallback**：`var(--dpui-xxx, 0.6)`，防止选择器没命中时整个 color-mix 失效。
4. **改完必须真机目测**：`pnpm check` 全绿 ≠ 好看。构建 → 重启 DeepSeek Harness → 截图/CDP 采样确认（见 §9）。
5. **文档写真实事实**：不照抄上游、不写没验证过的行为。

---

## 1. 仓库结构与流水线

```
src/client/
  entry.jsx            入口：注册 locale、palette、ground、模型座、账号座（槽位注入）
  skin.css             布局 + 玻璃材质系统（本文件的核心，见 §2–§4）
  glass.jsx            玻璃/壁纸地面控制器（body 属性 + localStorage 持久化）
  palette.jsx/.css     皮肤配色控制器（四套配色 + 原色，预览卡 + 快捷设置两个入口）
  generated-palettes.js只读 token 源（PALETTE_LAYERS，四层配色 × 明暗，build 生成）
  ModelSelect.tsx/.module.css  单卡模型/推理强度选择器（925 行，见 §5）
  account.jsx/.css     账号行 + 账号菜单 + 快捷设置齿轮（仅桌面版）
  quick-actions*.jsx   快捷操作目录与设置（两个座位）
  quick-settings.jsx   快捷设置菜单内容
  locales.js           zh/en 词典（UI_NS + MODEL_NS 两个命名空间）
  model-contract.ts    模型目录的类型契约
  provider-order.ts    模型排序
scripts/
  build.mjs            打包 dist/client.js + index.js
  verify-skin.mjs      skin 结构校验
  typecheck.mjs        TS 检查
  check-scope.mjs      作用域检查（禁止自由变量）
  rotate-smoke.mjs     壁纸轮换冒烟
  contrast-check.mjs   对比度审计（建模 skin.css 的全部曲线，见 §6）
docs/design-invariants.md  设计不变量（为什么这么设计）；本文件讲“怎么改”
```

- `pnpm build` = 打包；`pnpm check` = build + node --check + verify-skin + typecheck + check-scope + rotate-smoke + contrast-check，**提交前必跑全量 check**。
- `dist/` 是提交进仓库的（安装走 git 地址），所以 build 产物变了就要一起提交。
- 安装/更新插件后需**完全退出并重启 DeepSeek Harness**（HMR 对 link: 安装的插件不驱逐 src/ 模块缓存；重启协议见 §9）。

---

## 2. 玻璃系统（地面 + 材质曲线）— 最常改的部分

### 2.1 数据流

`glass.jsx` 把设置发布到 `<body>` 上：

- `data-dsh-glass`（存在即开启；`glass=0` 且壁纸 `none` 时移除，所有玻璃规则随之失效）
- `--dpui-glass-opacity`：滑杆值 0–1，**越大越透**。全部曲线的输入。
- `--dpui-ground-image`：壁纸 URL 或 `none`（`none` 时清除壁纸层，不涂色）

skin.css 里所有玻璃规则都挂在 `html:has(body[data-dsh-glass])` 下 —— 选择器不命中就整体回到官方样式，这是“原色”模式的实现方式。

### 2.2 曲线总表（声明在 skin.css 的 `[class*="_frame"]` 块，~370 行起）

| 曲线 | 公式 | 用途 | 调参变量 |
| --- | --- | --- | --- |
| 卡片 `--dpui-frost-alpha` | `min(ceiling, max(floor, (1-glass) + 0.10))` | 文件卡、特殊字段体（composer、气泡、代码卡 v0.1.40 起改走面板曲线） | `frost-floor: 0.46` `frost-elevation: 0.10` `frost-ceiling: 0.96` |
| 侧栏 `--dpui-sidebar-alpha` | `min(1, (1-glass) + 0.03)` | 左栏比工作区**高一线** | `sidebar-elevation: 0.03` |
| New Session 芯片 `--dpui-chip-alpha` | `max(0.20, (1-glass) × 0.55)` | 侧栏上的 New Session 按钮 + **workspace 里三种选中的行**（会话/搜索结果/面板行，v0.1.41 起、v0.1.43 扩齐，同填充同 blur） | `chip-floor: 0.20` `chip-scale: 0.55` |
| 面板 `--dpui-panel-alpha` | `max(0.30, (1-glass) × 0.62)` | **composer 输入框（只淡色，blur 仍全窗最重）、用户消息气泡、代码卡**（眼睛平视最多的表面，卡片曲线下是白板） | `panel-floor: 0.30` `panel-scale: 0.62` |
| 行内代码芯片 `--dpui-inline-alpha` | `max(0.22, (1-glass) × 0.40)` | 正文里的 `code` 小芯片 | `inline-floor: 0.22` `inline-scale: 0.40` |

改任何一行公式的步骤：

1. 改 skin.css 的变量声明（变量名带语义：floor 是保底、elevation 是加法抬升、scale 是乘法系数）。
2. 同步 `scripts/contrast-check.mjs`：regex key 列表（`frost-floor|...`）、必查 key 数组、对应的 `xxxAlpha(opacity)` 函数、`SURFACES` 里该表面的分支。
3. `pnpm check:contrast` 必须全绿（强制区间见 §6）。
4. 真机目测（§9）。

### 2.3 乘法曲线的适用场景（重要的判断）

- **加法曲线**（`(1-glass) + e`）适合“表面直接坐在地面/柱子上的大面”：卡片、侧栏。
- **乘法曲线**（`(1-glass) × s`）适合“**叠在另一个已涂层表面上的小件**”：New Session 芯片坐在侧栏上，有效覆盖率 = `s + c·(1-s)`，乘法让这个有效差值在每个档位都保持小；行内代码芯片同理（坐在工作区柱子上）。
- 教训记录：New Session 芯片曾用“raw token + 加法 +0.05”，在滑杆 0.35 时仍是一块黑贴纸 —— 因为 raw `--dsw-specific-sidebar-fill` 本身就比侧栏的涂层深两档（侧栏涂层 = sidebar-fill 混 12% brand）。**芯片的填充必须复刻它所坐表面的合成色**，见 §3。

### 2.4 blur 排序（v0.1.37，从重到轻）

```
composer        glass×40px + 18px
New Session     glass×34px + 12px
md-code-block   glass×30px + 10px
气泡/文件卡/特殊字段体  glass×30px + 8px
行内代码芯片     glass×12px + 4px   ← 装饰级，最小
两根柱子         glass×30 / ×22，无 floor
```

注意：气泡/composer/代码卡的**底色**走 panel 曲线但 blur 各留各档（composer 仍是最重的 40px+18）；代码卡在 panel 曲线时直接从快照基色（`--dpui-code-frost-base`）刷，**不走 token** —— token 和特殊字段体共享，改 token 会把没被点名的表面一起带走（强调范围要窄）。平滑渐变壁纸上 blur 不可见，"玻璃感"实际由 tint/alpha 决定 —— 觉得玻璃感不够先降 alpha，别加 blur。

改 blur 时保持这个相对秩序；某一级要变重，先想它和上下级的关系。

---

## 3. 对话内容表面（skin.css 后半，~336 行起）

材质系统是三层：**柱子（columns）< 岛屿（islands）< composer**。对话内容里的表面全是岛屿，全部走 token 重定义 + backdrop-filter 两件套。

### 3.1 代码块（md-code-block）

- 大代码卡通过在 `_centerCol` 上**重定义 token** 实现霜化：`--dsw-alias-markdown-code-block` 被重定义为 `color-mix(base, frost-alpha)`。这样所有消费该 token 的表面一次性霜化，而 portal 到 body 的菜单/对话框不受影响。
- **卡内分层坑（v0.1.39）**：代码卡的外卡、`_header`、`pre._plain` 会**各自**刷一遍同一 token —— 只把外卡调轻、不动内层，`pre` 会以卡片曲线叠回来（有效 0.85，白板照旧）。正确改法：外卡一层承担全部涂色，`pre` 和 `_header` 置 `transparent !important`，`_bannerWrap` 保留 bg-base 薄条做色带。
- token 的原始色在父级（`_frame:has(> _centerCol)`）快照成 `--dpui-code-frost-base` —— var() 在声明处解析，同元素自引用会成环。
- banner 条（语言头）单独刷 `--dsw-alias-bg-base`。
- `.md-code-block` 是壳的全局字面类，跨构建稳定，优先用它做钩子。

### 3.2 行内代码芯片（2026-10 改，最近一次反馈的修复）

规则：`html:has(body[data-dsh-glass]) [class*="_markdown"] code:not([data-code-block-content] code)`

- **踩过的坑**：最初让它骑卡片曲线（滑杆 0.35 → alpha 0.75），浅色模式下近白 token（`#f6f6f6`）合成出刺眼白瓷砖（比洗底亮 ~20L）。**修法**：给它独立的乘法装饰曲线（§2.2 最后一行），同高度采样降到 +9~11L，文字清晰。
- `:not([data-code-block-content] code)` 排除块代码 —— 块代码已通过 3.1 的 token 霜化，这里再刷会双重混合。
- 芯片文字色不改：token `--dsw-alias-markdown-inline-code` 的文字配对由配色层负责，玻璃层只动背景。
- **排障经验**：截图里芯片像“空白瓷砖”时，先用 CDP 查 computed `color`（§9.2），确认是文字色问题还是底色问题；像素采样必须选**芯片内无文字的 padding 区**，采到文字上会得假读数（L 109 vs 实际 26 那次）。

### 3.2b 微型状态件（v0.1.45）

- 状态标签组件 `_tag` 本身就有透明设计：success/info/warning/danger 四个 tone 都是 10–12% 透色 tint，**只有 neutral tone**（如 `exit code 1`）刷不透明 `bg-module-platform`。玻璃门下把 neutral 也降到同款 12% tint（`[class*="_tag"][data-tone='neutral']`），顺着组件自己的家族逻辑，不新开曲线。
- `solid` tone（label-primary 反白）**不动**——它是芯片世界的主按钮。
- `Stopped` 药丸（`_stopped`，局部名稳定）刷 `interactive-bg-hover`（与 hover 实底同 token），玻璃门下取行 hover 同款 40% neutral-00 薄纱。
- verify-skin：`[class*="_tag"]` 已登记进 GLASS_SURFACES 例外名单。

### 3.3 特殊字段体（工具 IO 卡 / 终端 / web / search）

钩子是壳自带的 data-* 属性（`[data-tool] _ioCard`、`[data-terminal]`、`[data-web]`、`[data-search]`），跨构建稳定。它们只加 blur，底色走 3.1 的 token 重定义（工具行的填充在内层 IO 卡上）。

### 3.4 浮层（菜单 / 对话框 / toast）

- 壳的浮层 primitive 是两层：`_material`（自带 0.58 涂层 + 40px blur 的毛玻璃，随主题）+ `_backing`（刷**不透明纸白**的垫底）。垫底把玻璃完全垫死，这就是"对话框固定白色"的病根。
- **修法（v0.1.39）**：玻璃模式下 `_backing` 置透明（`[class*="_backing"] { background-color: transparent !important }`），让 `_material` 自己的涂层干活；非玻璃模式垫底保留，"原色"模式仍是实心浮层。规则已登记进 verify-skin 的 GLASS_SURFACES 例外名单。
- **`_material` 的 blur 玻璃门下降到 24px（v0.1.47）**：40px 是全窗最重的一层 backdrop，也是合成器内存压力下**最先整批丢弃**的那类层（2026-10-26 事故：所有 blur 层同时消失、tint 还在，浮层后面内容清晰透出；重启即愈）。玻璃门下 24px 在已糊的地面上读不出差别，纯省成本；"原色"模式保留壳的 40px。规则同为 glass-gated，已登记 GLASS_SURFACES。
- **合成器静默丢 blur 是不治之症（2026-10-26 三起定论）**：中央列两个 fixed 元素（顶栏、composer）的 backdrop-filter 会单独死亡——采样的是滚动中的对话内容，滚动流内元素和侧栏都无恙。**页面内一切手段救不回**（真机逐一试过并全部失败）：inline blur 切换、transform/display 层重建、`data-dsh-glass` 总闸重开、根 zoom 重排、真实输入、微滚动。GPU 正常无崩溃，唯一疗法是重启。曾试过 inline 轻推自愈守护（v0.1.47 一度上线）——对重症无效，且窗口被遮挡时 rAF 停摆会让 inline `none` 卡住不还原、全窗无霜，已撤。
- **预防只有一条实验性规则（v0.1.48）**：`[data-composer-card] { will-change: transform }`（玻璃门内）——把受害者自己提升成合成层，让它随自己的层重栅格而不是共享缓存过期。**注意方向性**：给滚动容器加合成层提示（`[data-conversation-scroll]` 上 `will-change: scroll-position`）实锤有害——隔离了 backdrop root，整窗玻璃变白板，A/B 撤掉即恢复，别再试。composer 这条真机 A/B 验证无害（壁纸与全部霜不动），但能否防住丢层**未证实**：若复发，删规则、认命重启。`[data-composer-card]` 本就是 GLASS_SURFACES 钩子。
- **toast 仍然不动**：透底的 toast 读不清。
- 浮层不进曲线表 — 它们的霜是壳自带的，插件只拆垫底。
- **整页视图的白色页板**（v0.1.44）：自动化任务页（及同组件族的设置页）的 section 根刷纯白（990×810 大板），玻璃门下置透明露出柱子的霜——Plugins 页的 page 根本来就没刷白，所以原本只有自动化页是一块板。页面上的控件（主按钮、开关、激活筛选 tab）保留各自填充。钩子 `[class*="_centerCol"] [class*="_page"]`。
- **dock 空面板宿主**（v0.1.46）：`[data-dockkit-empty]`（分屏/右栏没有 tab 时的 "Empty pane" 宿主）刷纯白 576×810，玻璃门下置透明（data-* 钩子稳定）。当前窗口宽度刚好把它卡在屏幕外（x=innerWidth），属潜伏项——已登记 GLASS_SURFACES。

---

## 4. 侧栏与 New Session 芯片（skin.css ~24–160 行）

- 左栏是一张浮动卡（5px gutter / 16px 圆角），涂层 = `--dsw-specific-sidebar-fill` 混 `--dsw-alias-brand-primary` 12%。
- **New Session 芯片的填充必须用同一合成**：`color-mix(in srgb, color-mix(in srgb, sidebar-fill 88%, brand-primary) chip-alpha, transparent)`。直接用 raw sidebar-fill 会比侧栏深两档（CDP 实测暗色薄荷 (10,15,13) vs (21,38,33)）。
- 用户对强调的口径（多次修正后的最终版）：**芯片只需比侧栏高一线，侧栏只需比工作区高一线，甚至持平也行**。别再加码。
- hover 态用 `max(0.72, chip-alpha)` 保住可发现性。
- **选中的行全部同芯片材质**（v0.1.41 会话行，v0.1.43 扩到搜索结果行与面板行）：`_sessionRow_selected`、`_searchResultRow_selected`、`_panelRow_panelActive` 三者原本共用同一条 structural 规则（同吃 active fill），语义同为"你在哪"，玻璃门下统一复用芯片曲线（同合成填充 + `34px+12px` blur），替代不透明的 `interactive-bg-active` 灰板。非玻璃模式三行仍走 active fill。
- **hover 也进材质**（v0.1.42）：壳在 mac 上给行刷不透明 hover 填充（实测 rgb(239,239,239)），玻璃下"扫过哪行哪行最重"。玻璃门下行 hover 改为 40% neutral-00 半透明薄纱（与 Windows 行 hover 同配方、同数值），不需要 blur —— 行下面的侧栏柱子已经模糊过。
- 侧栏字号跟随 General → Text size（12/14/16），同一设置所有界面同值（含账号行用户名）。
- **官方往 `_panelList` 里加行不用跟改**（rc.3 实测）：新增的 More 行（`_panelRow` + `_moreAnchor`）自动吃齐行样式、字号与"钉在账号行上方"（`_panelList` 整组 order:1）；它的弹层也走壳的 `_surface`/`_material`/`_backing` 原语，玻璃门下实测 `_backing` 已被拆透明、`_material` 0.58 涂层独立干活——**零 CSS 改动跟上**。属性包含选择器（`[class*="_panelRow"]`）+ 壳浮层原语这两条设计在此兑现。

---

## 5. 模型列表（ModelSelect.tsx / .module.css）

- 单卡组件：模型列表 + 强度（关闭/低/高/最高）同卡，搜索、重试、空状态内置；强度名走 locale。
- 交互契约（改前先读组件头注释）：悬停行时左侧介绍卡跟随该行、顶边对齐；点模型或点强度都算确认，卡片立即收起，触发按钮当场显示新选择，网络往返只体现在转圈。**开卡定位**：选中行滚动到列表**垂直中点**（rect 数学改 viewport.scrollTop，不用 scrollIntoView —— 会拖动外层容器）；只在开卡瞬间生效，键盘/指针一旦接管高亮就停止重定位，导航仍走 focus 的最小滚动。
- 注入路径：`entry.jsx` 里 `conversation.input.model` 槽，`priority: -1`，按 sessionId 取 directory；子代理会话（`sessions.subagentAddress` 非空）不可用。
- 浮层材质（实测修正）：账号菜单、快捷设置、模型卡、rc.3 侧栏 More 菜单都渲染进壳的 Menu/MenuSurface primitive，绘画层是 `_material`（0.58 涂层；blur 壳自带 40px，玻璃门下降到 24px，见 §3.4）——玻璃门下 `_backing` 拆掉后**它们已经全部跟上玻璃**（真机截图 /tmp/model-card-glass.png 为证）。`.module.css` 只画控件（行 hover、警示、危险底），不画容器；§3.4 的"浮层不进曲线表"同样适用。
- 改排序 → `provider-order.ts`；改类型 → `model-contract.ts`。

---

## 6. 对比度审计（scripts/contrast-check.mjs）

模型逐层复刻 CSS：`column = bg-base at (1-opacity) over ground` → `surface = token at curve over column` → 对 `label-primary` 求 WCAG 对比度。560 例（4 配色 × 2 模式 × 7 表面 × 5 档 × 2 地面）。

**强制政策（增量原则，别改回去）**：

- 只对 `glass ≤ 0.5` 且该例的 `columnRatio`（文字 vs 柱子洗底）本身 ≥ 4.5:1 的用例强制 AA。
- 柱子自己都不达标的角落（暗色×白壁纸、浅色×黑壁纸）只报告不失败 —— 那是滑杆的选择，表面不替地面背锅。
- 中位之外（glass > 0.5）全部只报告。
- 教训：曾把 chip-scale 扫到 0.90 去凑单个审计红点，结果芯片重新变实（L 45）—— 正确做法是把审计改成增量模型，而不是把曲线调坏去讨好审计。
- **深色模式真机目测（2026-10-23 补上欠账）**：滑杆 0.35 下曲线全部按公式落位（实测 sidebar 0.68、chip 0.3575、panel 0.403、blur 同斜率），文字白 rgb(242,241,232) 可读，展示图 showcase-dark.png 为玻璃后真机图；0.85（“强”）+ 亮色壁纸是极限组合，亮壁纸透上来冲淡浅色文字 —— 正落在“中位之外只报告”的政策带内，属滑杆的取舍，不当 bug 修。

---

## 7. 皮肤配色与外观设置

- token 源 `generated-palettes.js` 是**只读生成物**（4 层：forest/mint/bee/parchment × 明暗），要加色先改生成脚本再 build。
- 设置入口纪律（用户明确要求过）：官方入口（General 设置等）保持官方行为；插件自己的外观设置放 **Appearance 分区**并给**真实预览卡**（palette.module.css 里的预览卡直接消费 PALETTE_LAYERS token，不是贴图）。
- “原色”选项 = 卸掉配色层只留布局，由 palette 控制器摘 body 属性实现。
- 壁纸轮换：`glass.jsx` 的 `advance/tick`，按**存储时间戳**比较（关窗的时间也计入），选 `none` 是轮换开启时的明确退出（不循环跳过它）。

## 8. 账号与快捷设置（仅桌面版）

- `entry.jsx` 用 `'dshDesktop' in globalThis` 分流：Web 壳走自己的登录流，不注入账号座。
- 账号行/菜单对齐官方规格（24px 头像 / 44px 行高），未登录显示 ⋯ + “更多”。
- 快捷设置由齿轮座位打开（语言、颜色模式、皮肤配色、文字大小、完整设置入口）；快捷操作两个座位（General → 快捷操作位置 1/2）可选内置/其他插件动作或留空。
- 非必要不弹模态（用户原则）：只读/可逆动作直接执行并留日志，只有清空/删除类才提示。

---

## 9. 真机验证（check 全绿之后必做）

### 9.1 重启协议（项目记忆 harness-app-restart.md 同源）

```bash
for p in $(pgrep -f "DeepSeek Harness"); do kill $p; done   # 循环 SIGTERM 直到全树退出
# 若卡在 supervisor 崩溃对话框：osascript AXPress 'click button "Exit" of
#   (first window whose subrole is "AXDialog") of process "DeepSeek"'
# 只有 PPID=1 且无视 SIGTERM 的僵尸才 kill -9，且只杀那一个
open -a "DeepSeek Harness" --args --remote-debugging-port=9222   # 带调试端口拉起
```

### 9.2 CDP 取证（Node ≥22 自带 WebSocket，无需依赖）

```js
const list = await (await fetch('http://127.0.0.1:9222/json/list')).json()
const ws = new WebSocket(list.find(p => p.type === 'page').webSocketDebuggerUrl)
// Runtime.evaluate + getComputedStyle：查 token 是否命中、alpha/blur 实际值、文字色
```

典型用途：确认新规则生效（computed backgroundColor 应含目标 alpha）、排查“空白瓷砖”（查 `color` vs `backgroundColor`）、查某表面实际吃的 token。

### 9.3 截图像素采样

- 先定位窗口（AppleScript `{position, size}`，Retina ×2），`screencapture -x` 全屏再裁 —— `screencapture -R` 可能拍到别的 Space（拍到过微信）。
- 采样选**无文字区域**；对比表面和洗底必须在**同一高度**（地面有纵向渐变，跨高度采样会得假差值），且尽量在**同一张截图内**取对照点。
- **壁纸会自动轮换**（glass.jsx 的 rotate，默认关但用户可能开着）：跨截图的绝对亮度不可比，甚至同一位置前后两张能差 40L；判定"是否协调"只看同一张截图内表面与相邻洗底的关系，绝对数值只做参考。
- 用户频繁换主题/壁纸/滑杆档位，采样前先 CDP 读 `data-dsh-palette`、`--dpui-glass-opacity` 确认当前环境。

### 9.4 提交

实质改动默认 commit；私有仓库直接 push main（这台机 GitHub 只能走 SSH，https 推不动）。

---

## 10. 已知教训索引（改同类东西前先看）

| 教训 | 一句话 | 详见 |
| --- | --- | --- |
| frost-floor 0.78 | 滑杆低段全死，“几乎不模糊，太突兀” → 0.46 | §2.2 |
| 芯片黑贴纸 | 叠层小件的填充必须复刻所坐表面的合成色 + 乘法曲线 | §2.3 §4 |
| 行内芯片白瓷砖 | 装饰级小件不骑卡片曲线 | §3.2 |
| 审计凑数 | 为过审计把曲线调坏是本末倒置，改审计模型 | §6 |
| 侧栏强调过头 | 强调口径是“高一线”，不是“高一档” | §4 |
| 假像素读数 | 采到文字/跨高度采样都会骗人 | §9.3 |
