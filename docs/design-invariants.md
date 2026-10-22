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

改动外观后，除了跑 `pnpm check`，还应在应用里**逐个配色（含原色）× 明暗**
看一眼，确认布局一致、只有颜色不同。
