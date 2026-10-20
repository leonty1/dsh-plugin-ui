# dsh-plugin-ui

为 DeepSeek Harness 注入 Qoder 风格的界面：配色皮肤、单卡模型选择器、账号快捷设置。全部以客户端插件方式实现，不修改 core。

A Qoder-style UI layer for DeepSeek Harness: palette skin, single-card model and reasoning-effort selector, and account quick settings. Everything ships as a client plugin; core files are untouched.

## 展示 / Showcase

| 浅色 Light | 深色 Dark |
| --- | --- |
| ![Qoder UI light](docs/images/showcase-light.png) | ![Qoder UI dark](docs/images/showcase-dark.png) |

![Palette previews under Appearance](docs/images/showcase-settings.png)

## 包含的内容

| 区域 | 行为 |
| --- | --- |
| 配色皮肤 | 四套 Qoder 配色（Forest 默认 / Mint / Bee / Parchment），每套都有明暗两版；同时覆盖圆角、正文/代码字体（Inter 子集内置）。设置里位于 Appearance 下方，以预览卡切换，也可选 “No skin” 回到官方外观。 |
| 外框与侧栏 | 中栏 5px 外边距、16px 圆角；侧栏行高 30px 起、8px 圆角；选中行使用 `interactive-bg-active`；顶部品牌行与 New Session 按钮保留官方设计；工作区/会话行按 Qoder 的几何收紧。 |
| 侧栏字号 | 侧栏文字（New Session、工作区标题、会话、Plugins/Automation）跟随 `--dsh-content-font-size`，与快捷菜单 Text size、设置里的正文大小同一个值；快捷菜单的小/中/大三档为 12/14/16px；行高与行距按同一变量推导，整组一起缩放（New Session 只缩放文字，保持官方按钮尺寸；账号行沿用官方 14px）。 |
| 侧栏底部分区 | Plugins 与 Automation tasks 固定在滚动区域之后、账号行正上方，上缘一条 `border-l2` 浅色虚线（跟随皮肤配色）与工作区隔离。 |
| 发送按钮 | 编辑器的发送键改为 Qoder 的圆角方形（跟随 `--dsw-radius-sm`），不再使用圆形。 |
| 首屏角标 | 隐藏 hero 上的预览/版本角标（`.previewBadge`）。 |
| 模型与强度 | 用单张卡片替换官方模型菜单：左侧强度卡（Off / Low / High / Max 与说明），右侧模型卡（按供应商分组）；选中模型后菜单保持打开，可继续调整强度；支持搜索、加载失败重试与空状态。触发键显示“模型 + 当前强度”。 |
| 账号行（仅 Desktop） | 左下角账号行保持官方显示：登录后 24px 头像 + 名称（44px 行高、14px 字），未登录为官方 ⋯ + “更多”（32px 行高）；右侧仅追加快捷座位（可执行内置动作或其他插件提供的动作）。 |
| 账号菜单（仅 Desktop） | 与官方一致：设置（带设置快捷键）、联系我们、退出登录；未登录时为设置、联系我们、登录。 |
| 快捷设置菜单 | 由账号行右侧齿轮座位打开，语言 / 明暗 / 字号各成一组。菜单刻意保持单层，当前值以 “✓” 标出，不依赖多级子菜单。 |
| 快捷座位配置 | General 设置里的 “Quick action slot 1/2”，可选内置动作（快捷设置 / 新建会话 / 插件 / 自动化任务 / 明暗切换 / 侧栏开关 / 全部设置）、已安装插件注册的动作，或留空；修改立即反映到侧栏账号行。 |

桌面端账号区只在渲染器检测到 `dshDesktop` 时接管官方 `settings.launcher` 座位；Web 端保留官方账号入口和浏览器登录流程，避免破坏 Web 登录。

## 明确不包含

按约定剔除、且本插件没有实现的内容：

- 桌宠（法斗）及首屏法斗美术。
- 固定 236px 侧栏宽度、更新圆点、多级全局 Menu、首屏点击轮换。
- 独立的 Workspace Search 行、hero 标题文案与点击语义、`sidebar` slot 重构、宽度常量、`sidebar.brand.name` 退役、更新契约字段、LTY 桌面身份与图标。
- 原 fork 中并不存在的“底部添加按钮”“会话行悬停菜单/操作按钮”“插件市场等新页面”——这些没有被发明或补做。

不修改 `/Users/tongyi/dsh-lty` 或任何 core 文件；插件只通过公开的 slot、theme、locale、store 和 `remote.account` 接口工作。

## 安装

`dist/` 已提交，安装时不需要构建。

Desktop：

1. 打开 Plugins → Add plugin。
2. 在输入框填入本目录的绝对路径（例如 `/Users/tongyi/dsh-plugin-ui`）。
3. Install → Enable now，然后重启应用。

Web profile（CLI）：

```sh
dsh plugin --profile web add /absolute/path/to/dsh-plugin-ui
pnpm dsh web   # 或启动你的 Web 实例
```

卸载：在 Plugins 页卸载，或 `dsh plugin --profile <profile> remove dsh-plugin-ui`。账号相关界面只在 Desktop 出现；Web 端只加载皮肤与模型选择器。

## 配置与存储

- Appearance → **Qoder palette**：预览卡选择 Forest / Mint / Bee / Parchment / No skin。默认 Forest。
- General → **Quick action slot 1/2**：配置账号行右侧两个座位（仅 Desktop），可选内置动作或已安装插件注册的动作。
- 点头像打开官方项菜单；快捷设置由账号行齿轮座位提供。
- 其他客户端插件可按 [快捷动作扩展](docs/quick-actions.md) 向 list 座位 `pluginUi.quickAction` 注册动作，安装启用后自动出现在下拉列表。
- 浏览器存储键：
  - `dsh-plugin-ui.palette`：当前配色，缺省为 `forest`；`none` 表示关闭皮肤。
  - `dsh-plugin-ui.quick-actions.v1`：账号行两个座位，默认 `[null, "settings"]`。

## 其他插件接入快捷动作

账号行两个座位是对外开放的 list 座位 `pluginUi.quickAction`。其他客户端插件注册一个座位组件后，动作会自动出现在 Settings → General 的 “Quick action slot 1/2” → “插件提供的动作” 分组；用户选中后账号行直接渲染该组件，插件卸载后座位变空、保存的 id 保留。

```jsx
export const inject = ['slots']

function ExportSeat({ size = 14 }) {
  return <button type="button" aria-label="Export session"
    style={{ width: '100%', height: '100%', border: 0, background: 'transparent', color: 'inherit', cursor: 'pointer' }}
    onClick={() => { /* 执行插件自己的动作 */ }}>
    <YourIcon size={size} />
  </button>
}

export function apply(ctx) {
  ctx.slots.inject('pluginUi.quickAction', () => ctx.slots.register({
    name: 'pluginUi.quickAction',
    id: 'my-plugin/export-session',
    order: 50,
    label: 'Export session',
  }, ExportSeat))
}
```

- `id` 全局唯一，建议 `插件名/动作名`；内置 id（`settings`、`new-session`、`plugins`、`schedules`、`theme`、`sidebar`、`all-settings`）保留。
- `label` 可以是字符串或返回字符串的函数；`order` 控制外部动作之间的顺序。
- 座位组件收到 `{ size: 14 }`，由本插件提供 30px 宽、整行高的单元格；组件应渲染充满单元格的透明按钮和 14–16px 单色图标。
- 扩展点只在 Desktop 渲染器、本插件接管账号行时存在；Web 不挂载。
- 完整约定（生命周期、样式、验证清单）见 [docs/quick-actions.md](docs/quick-actions.md)。

English: other client plugins register a seat into the `pluginUi.quickAction` list slot declared under `settings.launcher`; the settings dropdown picks it up automatically. See [docs/quick-actions.md](docs/quick-actions.md) for the contract.

## 本地构建

```sh
pnpm install
pnpm build        # 生成 src/client/generated-palettes.js 与 dist/
pnpm check        # 构建 + node --check
```

构建从 `design/*.json` 生成四套配色（236 个 token 绑定，含明暗两版），把 `assets/fonts` 的 Inter 子集内联为 data URL，并将 CSS Module 类名限定为 `dpui-<file>-<class>` 后注入样式。

## 实测范围

- Web（基于 rc.2 的私有 fork，Chromium）：四套配色与 No skin 切换、暗色 Mint、模型菜单空状态、配置密钥后真实模型列表、模型切换、强度切换、单卡布局。
- Desktop（官方 0.2.1-rc.2 安装版）：从 Plugins 页本地路径安装、单卡模型/强度菜单与三组模型来源、账号行与右侧齿轮快捷座位、顶部品牌行与 New Session 保持官方设计（悬停 ⌘N 键帽淡入）、Plugins/Automation tasks 紧邻账号行上方并带浅色虚线分隔、侧栏文字随 Text size 小/中/大（12/14/16px）统一缩放且与 Plugins 行一致（实测 12/14/16px 时工作区标题、会话标题、New Session、Plugins 同值，行高 30/30/32px；New Session 悬停 ⌘N 键帽同步缩放）、账号行保持官方 24px 头像 / 44px 行高（未登录为官方 ⋯ + “更多” 32px 行）。
- Desktop 设置页：Qoder palette 位于 Appearance 之后、Font size 之前，5 张预览卡实测可切换并即时应用（Forest/Mint 各测一次后恢复 Forest）；Quick action slot 下拉实测 7 个内置动作；第三方动作通过 list 座位 `pluginUi.quickAction` 用一次性探针实测——注册后出现在“插件提供的动作”，选中后账号行渲染该组件，探针已移除。
- Desktop（开发版 Electron，隔离 `DSH_HOME`）：账号菜单的官方项、齿轮快捷设置的子菜单与 ✓ 标记、明暗切换、快捷座位改写与持久化、登录弹窗进入 “Waiting for sign in”。
- 未实测：需要真实账号的成功登录、退出登录确认（登录弹窗已打开并取消；未使用账号凭据）。
- 测试环境本身是自带部分同款改动的 fork，因此 General 设置里会同时出现 fork 自带的快捷座位行与本插件的行；在未改动的官方版本上只会出现本插件的行。

## 仓库

`git@github.com:leonty1/dsh-plugin-ui.git`（私有）。

License: UNLICENSED — 内部使用。
