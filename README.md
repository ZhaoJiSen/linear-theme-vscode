# Linear Theme for VS Code

A near-black (and near-white) color theme built around [Linear's](https://linear.app) design system — the deep `#010102` canvas, a four-step surface ladder, and the signature lavender-blue accent `#5e6ad2`.

The theme keeps chrome quiet and lets code do the heavy lifting, mirroring how Linear's own product surfaces read: dense, technical, and quietly luxurious.

## Variants

Four themes ship in this extension — pick via **Preferences: Color Theme**:

Six themes ship in this extension — pick via **Preferences: Color Theme**:

| Theme | Mode | Canvas | Keywords |
|---|---|---|---|
| **Linear Dark** | dark | near-black `#010102` | italic |
| **Linear Dark No Italics** | dark | near-black `#010102` | upright |
| **Linear Dark Soft** | dark | charcoal `#16171a` | italic |
| **Linear Dark Soft No Italics** | dark | charcoal `#16171a` | upright |
| **Linear Light** | light | white `#ffffff` | italic |
| **Linear Light No Italics** | light | white `#ffffff` | upright |

The **Soft** variants lift the background off Linear's near-black canvas to a comfortable charcoal — same ink, accent, and syntax colors, easier on the eyes in bright rooms. The italic variants italicize keywords, comments, `this`/`self`, parameters, and HTML/Vue attributes; the "No Italics" variants keep everything upright.

## Language coverage

Tuned syntax highlighting for: Go, Rust, JavaScript, TypeScript, JSX/React, Vue, HTML, CSS, SCSS, LESS, C, C++, C#, plus JSON, YAML, and Markdown. Highlighting uses both TextMate scopes and semantic tokens, so language servers that emit semantic highlighting (Rust lifetimes, default-library symbols, etc.) are colored too.

## Palette

| Role | Color |
|---|---|
| Canvas (editor bg) | `#010102` |
| Surface 1 (panels, line highlight) | `#0f1011` |
| Surface 2 | `#141516` |
| Surface 3 / 4 | `#18191a` / `#191a1b` |
| Hairline border | `#23252a` |
| Ink (headings) | `#f7f8f8` |
| Ink muted (body) | `#d0d6e0` |
| Ink subtle | `#8a8f98` |
| Accent (lavender-blue) | `#5e6ad2` |
| Accent hover | `#828fff` |
| Success | `#27a644` |

Syntax highlighting draws from Linear's in-product tag palette (blue, lavender, green, cyan, amber, terracotta, orchid) so the colors stay true to the brand while remaining readable. Type names and enum names sit in blue; constants and enum members get their own cyan so they never blend into the type they belong to.

## Install

### From source (local)

```bash
npm install            # installs vsce + ovsx locally
npm run build          # regenerate the four theme JSONs from build.js
npm run package        # build + produce the .vsix
code --install-extension linear-theme-vscode-0.1.0.vsix
```

Then open the Command Palette (`Cmd/Ctrl + Shift + P`) → **Preferences: Color Theme** → pick a Linear variant.

## Publishing & auto-updates

Publishing is automated via GitHub Actions (`.github/workflows/publish.yml`). Once published, the Marketplace handles auto-updates for users — VS Code pulls new versions automatically.

One-time setup — add these repository secrets (Settings → Secrets and variables → Actions):

- `VSCE_PAT` — an Azure DevOps Personal Access Token with **Marketplace › Manage** scope (required).
- `OVSX_PAT` — an Open VSX token (optional; the Open VSX step is skipped if unset).

To cut a release, bump the version and push a matching tag:

```bash
npm version patch       # or minor / major — updates package.json + commits + tags
git push && git push --tags
```

The workflow verifies the tag matches `package.json`, builds, packages, publishes to the Marketplace (and Open VSX if configured), and attaches the `.vsix` to a GitHub Release. The tag version **must** equal the `package.json` version or the run fails fast.

## Customizing

All four themes are generated from `build.js` — edit the `dark` / `light` palette objects or the `tokenColors` rules there and run `npm run build`. The palette keys map directly to Linear's design tokens (canvas, surface1–4, hairline, ink, accent).

### Quick try without packaging

Copy this folder into your VS Code extensions directory and reload:

- macOS / Linux: `~/.vscode/extensions/`
- Windows: `%USERPROFILE%\.vscode\extensions\`

## Pairing

For the closest match to Linear's typography, set your editor font to **Geist Mono** or **JetBrains Mono** at weight 400 — the documented open-source substitutes for Linear Mono.

## License

MIT
