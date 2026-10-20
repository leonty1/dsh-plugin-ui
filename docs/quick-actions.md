# 快捷动作扩展

`dsh-plugin-ui` 在侧栏账号行右侧提供两个可配置的快捷动作座位。座位可执行内置动作，也可以承载其他客户端插件提供的动作；插件安装并启用后，动作会自动出现在设置里的下拉列表中。

## 使用位置

- 配置：Settings → General → `Quick action slot 1 / Quick action slot 2`（在 Appearance 与字号设置下方）。
- 生效：左侧账号行右侧的两个座位，修改后立即生效。
- 存储：`localStorage` 键 `dsh-plugin-ui.quick-actions.v1`，保存两个动作 id 的数组；默认 `[null, "settings"]`。
- 作用域：只在 Desktop 渲染器中存在；Web 使用官方账号入口，座位与扩展座位都不挂载。

## 内置动作

| id | 行为 |
| --- | --- |
| `settings` | 打开快捷设置菜单（语言、明暗、字号、全部设置） |
| `new-session` | 在当前或最近的工作区新建会话 |
| `plugins` | 主区域切换到 Plugins |
| `schedules` | 主区域切换到 Automation tasks |
| `theme` | 在当前明暗之间切换 |
| `sidebar` | 收起 / 展开侧栏 |
| `all-settings` | 打开完整设置对话框 |

这些 id 是保留的；外部插件使用相同 id 时不会出现在列表中，座位也始终解析为内置动作。

## 第三方插件接入

扩展点是 `settings.launcher` 下声明的 list 座位：

```
pluginUi.quickAction
```

它遵循 DSH 的「UI 跨包走座位」约定：不需要新增服务、不需要修改 core，也不需要往 manifest 里登记动作。插件注册即出现，注销即消失。

最小示例（客户端入口）：

```jsx
import { IconRightUpOutlineMedium } from '@deepseek-ai/dsh-client-ui-primitives'

export const inject = ['slots']

/** 座位组件：30px 宽、整行高，自行渲染按钮和图标。 */
function ExportSeat({ size = 14 }) {
  return <button type="button" aria-label="Export session"
    style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      width: '100%', height: '100%', padding: 0, border: 0, borderRadius: 4,
      background: 'transparent', color: 'inherit', cursor: 'pointer',
    }}
    onClick={() => { /* 执行插件自己的动作 */ }}>
    <IconRightUpOutlineMedium size={size} />
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

注册选项：

| 字段 | 说明 |
| --- | --- |
| `id` | 必填，全局唯一；建议用 `插件名/动作名`。持久化到座位配置的就是这个值。 |
| `label` | 列表中显示的文字；可以是字符串，也可以是返回字符串的函数。函数在列表渲染时调用，适合按当前语言返回文案。 |
| `order` | 可选，外部动作之间的排序；升序，缺省 0。内置动作始终排在外部动作之前。 |
| `name` | 固定为 `pluginUi.quickAction`。 |

座位组件收到的 owner props 为 `{ size: 14 }`，同时会收到插件的标准 props（如 `t`）。组件只在用户把该动作选进座位时挂载；未选中或插件已卸载时不会渲染。

### 生命周期

- **安装 / 启用**：`ctx.slots.register` 生效后，动作自动出现在 Settings 的「插件提供的动作 / From installed plugins」分组里，无需重启或额外配置。
- **用户选择**：设置把 `id` 写入座位存储，账号行立即渲染该组件。
- **禁用 / 卸载**：注册随插件上下文销毁；设置列表移除该项，座位变成空列。已保存的 id 不会被抹掉，重新安装后座位自动恢复，无需重新选择。
- **竞态**：用 `ctx.slots.inject('pluginUi.quickAction', …)` 注册，Cordis 会等待座位声明完成，插件加载顺序不影响结果。

### 样式约束

座位单元格固定 30px 宽、与账号行同高（32px 或 44px），由 `dsh-plugin-ui` 负责布局。接入组件应：

- 渲染一个充满单元格的按钮（`width/height: 100%`），透明背景、无边框、`color: inherit`；
- 使用 14–16px 的单色图标，沿用 `currentColor`，以便跟随明暗与配色；
- 不设置 `position: fixed/absolute`，不修改账号行以外的布局；
- 点击逻辑自行负责，包括需要的确认、错误提示和本地化。

### 为什么是座位而不是服务

账号行的两个座位是 UI 扩展，不是新的跨包能力；DSH 的客户端约定是 UI 跨包通过座位完成。座位由 `dsh-plugin-ui` 声明，设置页通过 `ctx.slots.entriesOfSlot('pluginUi.quickAction')` 读取当前注册项，因此：

- 不需要维护第二份动作清单；
- 插件的注册与注销直接反映到设置和账号行；
- 不引入新的 Host、wire 或持久化格式。

## 验证清单

接入插件可按下述路径自测：

1. 安装并启用插件，打开 Settings → General，确认下拉列表出现自己的动作。
2. 把它选到任一快捷座位，关闭设置，确认账号行出现对应按钮。
3. 点击按钮，确认动作执行。
4. 禁用插件，确认座位变空；重新启用，确认座位恢复。
