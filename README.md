# dsh-plugin-ui

为 DeepSeek Harness 注入 Qoder 风格的界面：配色皮肤、单卡模型选择器、账号快捷设置。全部以客户端插件方式实现，不修改 core。

A Qoder-style UI layer for DeepSeek Harness: palette skin, single-card model and reasoning-effort selector, and account quick settings. Everything ships as a client plugin; core files are untouched.

## 包含的内容

| 区域 | 行为 |
| --- | --- |
| 配色皮肤 | 四套 Qoder 配色（Forest 默认 / Mint / Bee / Parchment），每套都有明暗两版；同时覆盖圆角、正文/代码字体（Inter 子集内置）。General 设置里可切换，也可选 “No skin” 回到官方外观。 |
| 外框与侧栏 | 中栏 5px 外边距、16px 圆角；侧栏行高 30px 起、8px 圆角；选中行使用 `interactive-bg-active`；顶部品牌行与 New Session 按钮保留官方设计；工作区/会话行按 Qoder 的几何收紧。 |
| 侧栏字号 | 侧栏文字（工作区、会话、Plugins/Automation、账号行）跟随 `--dsh-content-font-size`，与快捷菜单 Text size、设置里的正文大小同一个值；行高与行距按同一变量推导，整组一起缩放。 |
| 侧栏底部分区 | Plugins 与 Automation tasks 固定在滚动区域之后、账号行正上方，上缘一条 `border-l2` 浅色虚线（跟随皮肤配色）与工作区隔离。 |
| 发送按钮 | 编辑器的发送键改为 Qoder 的圆角方形（跟随 `--dsw-radius-sm`），不再使用圆形。 |
| 首屏角标 | 隐藏 hero 上的预览/版本角标（`.previewBadge`）。 |
| 模型与强度 | 用单张卡片替换官方模型菜单：左侧强度卡（Off / Low / High / Max 与说明），右侧模型卡（按供应商分组）；选中模型后菜单保持打开，可继续调整强度；支持搜索、加载失败重试与空状态。触发键显示“模型 + 当前强度”。 |
| 账号行（仅 Desktop） | 左下角账号行：头像、登录名、右侧两个可配置快捷座位（设置 / 留空），座位随账号区收窄。 |
| 账号菜单（仅 Desktop） | 快捷设置（语言、明暗模式、正文字号）、全部设置、反馈、更新日志、移动端、关于、登录。 |
| 快捷设置菜单 | 语言 / 明暗 / 字号各成一组。菜单刻意保持单层，当前值以 “✓” 标出，不依赖多级子菜单。 |
| 快捷座位配置 | General 设置里的 “Quick action slot 1/2”，可把两个座位设为 Settings 或留空，修改立即反映到侧栏账号行。 |

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

- General → **Qoder palette**：Forest / Mint / Bee / Parchment / No skin。默认 Forest。
- General → **Quick action slot 1/2**：配置账号行右侧两个座位（仅 Desktop）。
- 账号菜单与齿轮座位共用同一套快捷设置。
- 浏览器存储键：
  - `dsh-plugin-ui.palette`：当前配色，缺省为 `forest`；`none` 表示关闭皮肤。
  - `dsh-plugin-ui.quick-actions.v1`：账号行两个座位，默认 `[null, "settings"]`。

## 本地构建

```sh
pnpm install
pnpm build        # 生成 src/client/generated-palettes.js 与 dist/
pnpm check        # 构建 + node --check
```

构建从 `design/*.json` 生成四套配色（236 个 token 绑定，含明暗两版），把 `assets/fonts` 的 Inter 子集内联为 data URL，并将 CSS Module 类名限定为 `dpui-<file>-<class>` 后注入样式。

## 实测范围

- Web（基于 rc.2 的私有 fork，Chromium）：四套配色与 No skin 切换、暗色 Mint、模型菜单空状态、配置密钥后真实模型列表、模型切换、强度切换、单卡布局。
- Desktop（官方 0.2.1-rc.2 安装版）：从 Plugins 页本地路径安装、单卡模型/强度菜单与三组模型来源、账号行与右侧齿轮快捷座位、顶部品牌行与 New Session 保持官方设计（悬停 ⌘N 键帽淡入）、Plugins/Automation tasks 紧邻账号行上方并带浅色虚线分隔、侧栏字号随 Text size 设置整体缩放（13/16/22px 实测行高 30/32/38px 同步变化）。
- Desktop（开发版 Electron，隔离 `DSH_HOME`）：账号菜单、快捷设置子菜单与 ✓ 标记、明暗切换、快捷座位改写与持久化、登录弹窗进入 “Waiting for sign in”。
- 未实测：需要真实账号的成功登录、退出登录确认（登录弹窗已打开并取消；未使用账号凭据）。
- 测试环境本身是自带部分同款改动的 fork，因此 General 设置里会同时出现 fork 自带的快捷座位行与本插件的行；在未改动的官方版本上只会出现本插件的行。

## 仓库

`git@github.com:leonty1/dsh-plugin-ui.git`（私有）。

License: UNLICENSED — 内部使用。
