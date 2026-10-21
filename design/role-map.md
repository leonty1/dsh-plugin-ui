# Qoder → DSH 角色映射（R1 基线）

- 来源：`index-DohubooF.css`（Qoder 0.4.8，4173 条规则）；语义名由 Tailwind 工具类（`.bg-bg-base`、`.text-text-secondary` …）反推。
- 主题 id：light, dark, forest-light, forest-dark, mint-light, mint-dark, bee-light, bee-dark, light-parchment, parchment-dark（`dark` 只声明 5 个变量，深色实体是 `forest-dark`）
- 语义色变量 140 个（随主题变化）+ 36 个恒定；30 个角色落到 DSH 的 48 个 `--dsw-alias-*`，另加 2 个 `--dsw-specific-*` 座位级表面（见文末构建期覆盖）。

| Qoder 角色 | 值（light → dark） | 覆盖的 DSH alias |
|---|---|---|
| `bg-layout` | `#fff` → `#191b1a` | `--dsw-alias-bg-base` `--dsw-alias-bg-document-preview` |
| `bg-base` | `#fff` → `#222523` | `--dsw-alias-bg-layer-1` `--dsw-alias-button-elevated-fill` `--dsw-alias-button-floating-fill` |
| `bg-container` | `#fff` → `#191b1a` | `--dsw-alias-bg-layer-1` |
| `bg-elevated` | `#f9f9f9` → `#252825` | `--dsw-alias-bg-layer-2` `--dsw-alias-bg-overlay` `--dsw-alias-menu-group-header-fill` |
| `bg-highlight` | `#080807` → `#fff` | `--dsw-alias-bg-multi-select` `--dsw-alias-bg-skeleton` |
| `text` | `#141414` → `#d9dcd9` | `--dsw-alias-label-primary`（`--dsw-alias-markdown-code-block` 是底色，构建期改绑） |
| `text-secondary` | `#636261` → `#b3bab4` | `--dsw-alias-label-secondary` `--dsw-alias-label-primary-dimmed` |
| `text-tertiary` | `#838280` → `#949d96` | `--dsw-alias-label-tertiary` `--dsw-alias-menu-icon` |
| `text-quaternary` | `#aaa9a8` → `#8a948c` | `--dsw-alias-label-dimmed` `--dsw-alias-label-caption` `--dsw-alias-markdown-placeholder` |
| `text-on-primary` | `#fdfdfd` → `#080807` | `--dsw-alias-label-primary-foreground` `--dsw-alias-toast-label` |
| `primary` | `#4b6f5a` → `#4d9c61` | `--dsw-alias-brand-primary` `--dsw-alias-state-business-primary` `--dsw-alias-brand-text` |
| `primary-hover` | `#436651` → `#62ad78` | `--dsw-alias-button-primary-hover` `--dsw-alias-button-floating-hover` |
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

多个角色曾竞争同一个 alias；`design/dsh-theme-definitions.json` 先按上表落成单一取值，构建时再把 8 处按「这个控件在 Qoder 里是什么表面」改绑：

| DSH alias | 绑定角色 | 原因 |
|---|---|---|
| `--dsw-alias-button-info-fill` | `primary` | DSH 的 info 按钮在 Qoder 里是主色按钮 |
| `--dsw-alias-button-info-hover` | `primary-hover` | 同上 |
| `--dsw-alias-bg-layer-1` | `bg-base` | 侧栏/主面板的抬升面，不是画布 |
| `--dsw-alias-bg-layer-2` | `bg-elevated` | Qoder 的抬升卡片 |
| `--dsw-alias-bg-layer-3` | `bg-elevated` | DSH 四级、Qoder 三级，最深一级与抬升层同值 |
| `--dsw-alias-markdown-code-block` | `bg-elevated` | DSH 用它当代码块、终端、Shiki 的底色；`text` 在浅色下是近黑 |
| `--dsw-specific-sidebar-fill` | `bg-base` | darwin 振动材质下的侧栏底色，不在 alias 表里 |
| `--dsw-specific-bubble` | `primary-bg` | Qoder 用户气泡是主色浅底（浅色实测 `#f3f4f2`） |

其余竞争 alias 的落地值：`--dsw-alias-border-l3` = `border-secondary`，`--dsw-alias-interactive-bg-hover` = `fill-secondary`；`fill-quaternary` 因此不再覆盖任何 alias（它唯一的 alias `bg-layer-3` 已改绑）。

## 未映射的 Qoder 角色（DSH 无对应 alias，需要座位级 CSS 或放弃）

`bg-mask`, `bg-spotlight`, `blue`, `blue-bg`, `button-raised`, `button-raised-bg`, `diff-insert`, `error-border`, `fill-tertiary-glass`, `info-bg`, `info-border`, `info-border-hover`, `info-hover`, `lavender`, `lavender-bg`, `mauve`, `mauve-bg`, `natural-sm`, `orange`, `orange-bg`, `pink`, `pink-bg`, `primary-border-hover`, `primary-text`, `primary-text-active`, `purple`, `purple-bg`, `sage`, `sage-bg`, `slate`, `slate-bg`, `success-border`, `success-border-hover`, `success-hover`, `surface-subtle`, `t-primary`, `t-text-secondary`, `teal`, `teal-bg`, `warning`, `warning-bg`, `warning-bg-hover`, `warning-border`, `yellow`, `yellow-bg`
