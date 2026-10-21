# Qoder → DSH 角色映射（R1 基线）

- 来源：`index-DohubooF.css`（Qoder 0.4.8，4173 条规则）；语义名由 Tailwind 工具类（`.bg-bg-base`、`.text-text-secondary` …）反推。
- 主题 id：light, dark, forest-light, forest-dark, mint-light, mint-dark, bee-light, bee-dark, light-parchment, parchment-dark（`dark` 只声明 5 个变量，深色实体是 `forest-dark`）
- 语义色变量 140 个（随主题变化）+ 36 个恒定；30 个角色中 29 个落到 DSH 的 48 个 `--dsw-alias-*` 基线，构建期再按控件表面改绑、补齐未覆盖的表面（见文末构建期覆盖）。

| Qoder 角色 | 值（light → dark） | 覆盖的 DSH alias |
|---|---|---|
| `bg-layout` | `#fff` → `#191b1a` | `--dsw-alias-bg-base` `--dsw-alias-bg-document-preview` |
| `bg-base` | `#fff` → `#222523` | `--dsw-alias-bg-layer-1` `--dsw-alias-button-elevated-fill` `--dsw-alias-button-floating-fill` |
| `bg-container` | `#fff` → `#191b1a` | `--dsw-alias-bg-layer-1` |
| `bg-elevated` | `#f9f9f9` → `#252825` | `--dsw-alias-bg-layer-2` `--dsw-alias-bg-overlay` `--dsw-alias-menu-group-header-fill` |
| `bg-highlight` | `#080807` → `#fff` | 无（Qoder 的次级按钮/反色 tooltip 底；DSH 的 skeleton、multi-select 是 alpha 表面，构建期继承官方值） |
| `text` | `#141414` → `#d9dcd9` | `--dsw-alias-label-primary`（`--dsw-alias-markdown-code-block` 是底色，构建期改绑） |
| `text-secondary` | `#636261` → `#b3bab4` | `--dsw-alias-label-secondary` `--dsw-alias-label-primary-dimmed` |
| `text-tertiary` | `#838280` → `#949d96` | `--dsw-alias-label-tertiary` `--dsw-alias-menu-icon` |
| `text-quaternary` | `#aaa9a8` → `#8a948c` | `--dsw-alias-label-dimmed` `--dsw-alias-label-caption` |
| `text-on-primary` | `#fdfdfd` → `#080807` | `--dsw-alias-label-primary-foreground`（Toast 文字恒白，构建期继承） |
| `primary` | `#4b6f5a` → `#4d9c61` | `--dsw-alias-brand-primary` `--dsw-alias-state-business-primary` `--dsw-alias-brand-text` |
| `primary-hover` | `#436651` → `#62ad78` | `--dsw-alias-button-primary-hover` |
| `primary-active` | `#3a5747` → `#428955` | `--dsw-alias-interactive-bg-hover-accent` `--dsw-alias-button-ghost-active-hover` |
| `primary-border` | `#d5dbd8` → `#335942` | `--dsw-alias-border-l3` `--dsw-alias-button-ghost-active-border` |
| `primary-bg` | `#f2f4f2` → `#14261c` | `--dsw-alias-state-business-tertiary` `--dsw-alias-turn-trigger-bg` |
| `primary-bg-hover` | `#e8ecea` → `#1a2e21` | `--dsw-alias-interactive-bg-hover` |
| `border` | `#bcbbba` → `#4b554d` | `--dsw-alias-border-l4` |
| `border-secondary` | `#ddd` → `#404842` | `--dsw-alias-border-l3` |
| `border-tertiary` | `#e6e6e6` → `#363c37` | `--dsw-alias-border-l2` `--dsw-alias-border-l2-darkmode-thin` |
| `border-quaternary` | `#eee` → `#2b302c` | `--dsw-alias-border-l1` `--dsw-alias-interactive-bg-hover` |
| `fill` | `#dfdfdf` → `#363d37` | `--dsw-alias-interactive-bg-active` |
| `fill-secondary` | `#efefef` → `#2d332e` | `--dsw-alias-interactive-bg-hover` |
| `fill-tertiary` | `#f6f6f6` → `#252b26` | `--dsw-alias-bg-layer-2` |
| `fill-quaternary` | `#fcfcfc` → `#212622` | `--dsw-alias-bg-layer-3` |
| `error` | `#ec5b56` → `#ff4d4f` | `--dsw-alias-state-error-primary` `--dsw-alias-state-error-secondary` `--dsw-alias-file-diff-deleted-marker` |
| `error-bg` | `#fdf2f0` → `#4a1a1b` | `--dsw-alias-file-diff-deleted-bg` |
| `success` | `#579b6e` → `#73cd94` | `--dsw-alias-state-success-primary` `--dsw-alias-file-diff-added-marker` |
| `success-bg` | `#ebf7f0` → `#14261c` | `--dsw-alias-file-diff-added-bg` |
| `info` | `#3b81e9` → `#0b83f1` | `--dsw-alias-button-info-fill` `--dsw-alias-link` |
| `link` | `#4d9868` → `#8ee5a1` | `--dsw-alias-link` |

## 构建期覆盖（`scripts/build.mjs` 的 `ROLE_BINDINGS`）

Qoder 浅色/深色的填充台阶并不总是同一步，DSH 的 alias 名称也常与它实际承载的表面对不上。`design/dsh-theme-definitions.json` 先按上表落成单一取值，构建时再按「这个控件在 Qoder 里是什么表面」改绑；值写成 `{ light, dark }` 表示两种模式取不同角色：

| DSH alias | 绑定角色 | 原因 |
|---|---|---|
| `--dsw-alias-button-info-fill` | `primary` | DSH 的 info 按钮在 Qoder 里是主色按钮 |
| `--dsw-alias-button-info-hover` | `primary-hover` | 同上 |
| `--dsw-alias-bg-layer-1` | `bg-base` | 侧栏/主面板的抬升面，不是画布 |
| `--dsw-alias-bg-layer-2` | `bg-elevated` | Qoder 的抬升卡片 |
| `--dsw-alias-bg-layer-3` | `bg-elevated` | DSH 四级、Qoder 三级，最深一级与抬升层同值 |
| `--dsw-alias-markdown-code-block` | `bg-elevated` | DSH 用它当代码块、终端、Shiki 的底色；`text` 在浅色下是近黑 |
| `--dsw-alias-markdown-code-block-banner` | `fill-tertiary` / `fill-secondary` | 代码块、搜索、技能卡的分层头部；官方值中性偏蓝，暖色皮肤下会脱节 |
| `--dsw-alias-markdown-inline-code` | `fill-tertiary` | 行内代码底色；官方是固定中性灰 |
| `--dsw-alias-markdown-tag` | `fill-tertiary` | markdown 标签底色 |
| `--dsw-alias-bg-module-platform` | `fill-tertiary` / `fill` | 设置行、键帽、分段轨道、选中主题块的芯片底；官方值固定在蓝灰档 |
| `--dsw-alias-interactive-bg-hover-solid` | `fill-tertiary` / `fill-secondary` | 行/卡片的实色悬停；官方值固定在蓝灰档 |
| `--dsw-alias-button-floating-hover` | `fill-tertiary` / `fill-secondary` | 浮动/新会话按钮悬停；`primary-hover` 会让 `label-primary` 压在饱和主色上，对比度不足 |
| `--dsw-alias-button-ghost-active-fill` | `fill-secondary` / `fill` | 选中日期/时段、Pill、轨迹表头的选中底；官方值固定在蓝灰档 |
| `--dsw-alias-markdown-citation` | `border-tertiary` / `border` | 轨迹引用表左侧的标线；官方是蓝灰 |
| `--dsw-alias-label-document-preview` | `text-secondary` | 文档预览的说明文字；官方是蓝灰 |
| `--dsw-alias-brand-primary-new-colorprimary-new-color` | `primary` | 平台强调色（dockkit 拖放、轨迹时间线、更新角标）；官方是 DeepSeek 蓝 |
| `--dsw-specific-sidebar-fill` | `bg-base` | darwin 振动材质下的侧栏底色，不在 alias 表里 |
| `--dsw-specific-bubble` | `primary-bg` | Qoder 用户气泡是主色浅底（浅色实测 `#f3f4f2`） |
| `--dsw-specific-input-major` | `bg-base` / `bg-elevated` | 输入框、附件卡、审批/提问面板、灯箱的底；官方深色是固定蓝灰 |
| `--dsw-specific-selector` | `fill-tertiary` / `fill` | 输入框左下「+」的圆形底；官方值固定在蓝灰档 |
| `--dsw-specific-sidebar-nav-item-active` | `fill-secondary` / `fill` | 设置左侧当前页的选中底；官方是蓝灰 |
| `--dsw-specific-sidebar-nav-item-hover` | `fill-tertiary` / `fill-secondary` | 设置左侧导航的悬停底；官方是蓝灰 |

派生表面（构建时直接生成取值）：`--dsw-specific-menu` = 调色板 `bg-elevated` 的 94% alpha（无模糊的悬浮卡、Todo/队列浮层，保留官方 macOS 的近不透明档）；`--dsw-menu-surface-fill` = `bg-elevated` 的 58%/45% alpha（共享 `MenuSurface` 的菜单材质，保留官方的半透明与背景模糊）；`--dsw-alias-bg-document-selection` = `primary` 的 40% alpha（PDF 选区，官方是 40% 蓝）；`--dsw-specific-sidebar-nav-item-active-accent` = `primary` 的 14% alpha（提问选项序号徽标底，官方是 DeepSeek 蓝）。

macOS 侧栏的蓝紫氛围光（官方 `AppFrame.module.css`）在 `skin.css` 里改由 `primary` 着色，渐变 alpha 与振动材质不变；选「原色」时保留官方蓝紫。

其余竞争 alias 的落地值：`--dsw-alias-border-l3` = `border-secondary`，`--dsw-alias-interactive-bg-hover` = `fill-secondary`；`fill-quaternary` 因此不再覆盖任何 alias（它唯一的 alias `bg-layer-3` 已改绑）。

## 官方继承

以下 token 在生成层里删除，由官方主题提供：`--dsw-alias-bg-skeleton`（4–8% 的 alpha 洗涤，任何不透明度都会变成色块）、`--dsw-alias-bg-multi-select`（中性选中底）、`--dsw-alias-toast-label`（Toast 底恒深，文字在两种主题下都恒白；Qoder 的 `text-on-primary` 在深色皮肤会翻成近黑）、`--dsw-alias-markdown-placeholder`（官方是表面色，不是文字色）。

## 刻意保持官方值

`state-warn-*`（Qoder 的 warning 同为琥珀色）、滚动条、tooltip/toast 的深色底与反色文字、开关滑块、`label-primary-inverted`：这些在 Qoder 里也是中性或语义色，跟随调色板反而会破坏对比。

## 未映射的 Qoder 角色（DSH 无对应 alias，需要座位级 CSS 或放弃）

`bg-highlight`, `bg-mask`, `bg-spotlight`, `blue`, `blue-bg`, `button-raised`, `button-raised-bg`, `diff-insert`, `error-border`, `fill-tertiary-glass`, `info-bg`, `info-border`, `info-border-hover`, `info-hover`, `lavender`, `lavender-bg`, `mauve`, `mauve-bg`, `natural-sm`, `orange`, `orange-bg`, `pink`, `pink-bg`, `primary-border-hover`, `primary-text`, `primary-text-active`, `purple`, `purple-bg`, `sage`, `sage-bg`, `slate`, `slate-bg`, `success-border`, `success-border-hover`, `success-hover`, `surface-subtle`, `t-primary`, `t-text-secondary`, `teal`, `teal-bg`, `warning`, `warning-bg`, `warning-bg-hover`, `warning-border`, `yellow`, `yellow-bg`
