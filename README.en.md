# dsh-plugin-ui

[简体中文](README.md) | **English**

A skin for DeepSeek Harness: frosted glass over a wallpaper ground, four skin palettes, a single-card model and reasoning-effort selector, and account quick actions. Client plugin only; core files are untouched. The palettes reference Qoder's skin colors.

## Showcase

| Light | Dark |
| --- | --- |
| ![Light UI](docs/images/showcase-light.png) | ![Dark UI](docs/images/showcase-dark.png) |

*Account details in the screenshots are redacted.*

## Features

### Frosted glass & wallpaper

The sidebar and workspace columns float on an optional wallpaper "ground", and every text-bearing surface (composer, bubbles, code cards, overlays, status chips, selected rows…) frosts in measured layers so contrast holds. Glass strength is Off / Light / Medium / Strong in the quick menu and a 0–1 slider in full settings; the ground ships gradient and photo presets, accepts a custom image, and can rotate on an interval — "None" leaves the ground clear. Glass and wallpaper are independent of the skin palette and switch off to solid at any time.

![Frosted glass and wallpaper](docs/images/showcase-light.png)

### Skin palette

Four skin palettes (Forest / Mint / Bee / Parchment, each in light and dark) plus "Original colors", which keeps the app's own colors while the plugin layout stays. Pick from preview cards under Appearance; the "Skin palette" group in the quick menu writes the same setting. A palette changes colour only, never layout.

![Skin palette](docs/images/showcase-settings.png)

### Model & effort

One card shows the model list and reasoning effort levels (Off / Low / High / Max) with search, retry, and empty states; the Chinese UI localizes effort names. Hovering a row moves the description card to that row and aligns its top edge with it; a click on either a model or an effort level confirms, so the card collapses at once and the trigger shows the new choice immediately.

![Model and reasoning effort](docs/images/showcase-models.png)

### Sidebar & text size

5px main margin and 16px radius, tightened workspace/session rows; the official brand row and New Session button are kept, and Plugins/Automation pin above the account row. Text size (S / M / L = 12 / 14 / 16px) is one setting everywhere, and the account name scales with it.

![Full interface (text size: Large)](docs/images/text-size.png)

### Account row & quick settings

The account row keeps the official 24px avatar / 44px height, with two configurable quick seats on the right. The gear seat opens quick settings: language, color mode, skin palette, frosted glass, text size, and All settings. The account menu matches the official items (Settings, Contact us, sign in/out).

![Account row and quick settings](docs/images/quick-settings.png)

## Install

`dist/` is committed; no build is required. Install from the repository:

- Desktop: Plugins → Add plugin → `git@github.com:leonty1/dsh-plugin-ui.git` → Install → Enable now → restart.
- Web: `dsh plugin --profile web add git@github.com:leonty1/dsh-plugin-ui.git`.

Uninstall from the Plugins page or with `dsh plugin --profile <profile> remove dsh-plugin-ui`.

## Configuration

- Appearance → **Skin palette**: pick a palette from the preview cards; Forest is the default.
- Appearance → **Frosted glass / ground wallpaper**: the glass strength slider (0–1); wallpaper presets, a custom image, and auto-rotation.
- General → **Quick action slot 1/2**: choose a built-in action, an action registered by another plugin, or leave it empty.
- Storage: `dsh-plugin-ui.palette` (palette), `dsh-plugin-ui.glass` (glass strength), `dsh-plugin-ui.wallpaper` / `.custom` / `.every` (ground wallpaper and rotation), `dsh-plugin-ui.quick-actions.v1` (the two seats).

## Extending quick actions

The account seats are the list slot `pluginUi.quickAction`. A registered action appears automatically in the quick-action dropdown; selecting it mounts the plugin's seat component, and uninstalling the plugin leaves an empty seat while keeping the stored id.

```jsx
// ExportSeat is the plugin's own button component; see docs/quick-actions.md for a full example.
ctx.slots.inject('pluginUi.quickAction', () => ctx.slots.register({
  name: 'pluginUi.quickAction',
  id: 'my-plugin/export',
  label: 'Export',
}, ExportSeat))
```

The seat component fills a 30px × full-height cell with a transparent button and a 14–16px monochrome icon. Ids are globally unique; built-in ids are reserved. Full contract (Chinese): [docs/quick-actions.md](docs/quick-actions.md).

## Development

```sh
pnpm install
pnpm build   # generate palettes and dist/
pnpm check   # build + syntax + skin contract + type check
```

Before touching anything visual, read
[docs/design-invariants.md](docs/design-invariants.md): "Original colors
changes colour only, never layout" and the other rules there are enforced by
`pnpm check`.

## Tested

- Web (Chromium): four palettes, Original colors, dark mode, model list/switching, effort switching, search and empty states.
- Desktop (official 0.2.1-rc.2): install, model/effort card, official account row and quick seats, sidebar text sizes 12/14/16px, New Session hover keycaps, settings preview cards; frosted glass and wallpaper visually verified live in light and dark mode (Strong glass over a bright wallpaper pushes dark-mode text contrast to the limit — a known tradeoff of the upper slider half); third-party action registration verified.
- Not tested: a successful real-account sign-in and sign-out confirmation.

## Repository & license

`git@github.com:leonty1/dsh-plugin-ui.git` · MIT © 2026 Tongyi Liang, see [LICENSE](LICENSE).
