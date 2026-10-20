# dsh-plugin-ui

[简体中文](README.md) | **English**

A Qoder-style UI layer for DeepSeek Harness: palette skin, a single-card model and reasoning-effort selector, and account quick actions. Client plugin only; core files are untouched.

## Showcase

| Light | Dark |
| --- | --- |
| ![Light UI](docs/images/showcase-light.png) | ![Dark UI](docs/images/showcase-dark.png) |

![Model and reasoning effort](docs/images/showcase-models.png)

![Palette previews under Appearance](docs/images/showcase-settings.png)

*Account details in the screenshots are redacted.*

## Features

- **Appearance**: four Qoder palettes (Forest / Mint / Bee / Parchment, each in light and dark), picked from preview cards under Appearance; “No skin” restores the official look.
- **Sidebar**: 5px main margin and 16px radius; workspace/session rows tightened to 30px and up; official brand row and New Session button kept; Plugins/Automation pinned above the account row with a solid divider.
- **Text size**: sidebar text, including the account name, follows Text size (S/M/L = 12/14/16px) and New Session scales with it; the account row keeps the official 44px / 32px rows and 24px avatar.
- **Model & effort**: one card shows the model list and effort levels (Off / Low / High / Max) with search, retry, and empty states; the Chinese UI localizes effort names.
- **Account row (desktop)**: official 24px avatar / 44px row; signed out it is ⋯ + “More”; two configurable quick seats sit on the right.
- **Account menu**: matches the official items (Settings, Contact us, sign in/out); quick settings open from the gear seat.

## Install

`dist/` is committed; no build is required. Install from the repository:

- Desktop: Plugins → Add plugin → `git@github.com:leonty1/dsh-plugin-ui.git` → Install → Enable now → restart.
- Web: `dsh plugin --profile web add git@github.com:leonty1/dsh-plugin-ui.git`.

Uninstall from the Plugins page or with `dsh plugin --profile <profile> remove dsh-plugin-ui`.

## Configuration

- Appearance → **Qoder palette**: pick a palette from the preview cards; Forest is the default.
- General → **Quick action slot 1/2**: choose a built-in action, an action registered by another plugin, or leave it empty.
- Storage: `dsh-plugin-ui.palette` (palette) and `dsh-plugin-ui.quick-actions.v1` (the two seats).

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
pnpm check   # build + syntax check
```

## Tested

- Web (Chromium): four palettes, No skin, dark mode, model list/switching, effort switching, search and empty states.
- Desktop (official 0.2.1-rc.2): install, model/effort card, official account row and quick seats, sidebar text sizes 12/14/16px, New Session hover keycaps, settings preview cards; third-party action registration verified.
- Not tested: a successful real-account sign-in and sign-out confirmation.

## Repository & license

`git@github.com:leonty1/dsh-plugin-ui.git` · MIT © 2026 Tongyi Liang, see [LICENSE](LICENSE).
