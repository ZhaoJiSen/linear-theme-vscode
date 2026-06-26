# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A VS Code color theme extension presenting Linear's design system. It ships **six theme variants**: Linear Dark / Dark Soft / Light, each in italic and No-Italics cuts. The "Soft" dark palette is `dark` with a lifted (charcoal) canvas for low-contrast comfort — defined via `{ ...dark, ...surface overrides }` so it shares all ink/accent/syntax colors.

## Critical: themes are generated, never hand-edited

`themes/*.json` are **build artifacts**. Editing them directly will be silently overwritten on the next build, and `vsce publish` runs the build via `vscode:prepublish`. All theme changes go through `build.js` — edit it, then run `npm run build`.

The four theme JSONs **are committed** to git (so the extension installs without a build step), but they must always be regenerated from `build.js` rather than patched, or they'll drift from source.

## Commands

```bash
npm install        # installs vsce + ovsx locally
npm run build      # regenerate the four themes/*.json from build.js
npm run package    # build + produce the .vsix (runs vsce package)
```

There is no test suite or linter. After changing `build.js`, the verification loop is: `npm run build`, then validate each output is well-formed JSON (e.g. `for f in themes/*.json; do python3 -c "import json; json.load(open('$f'))"; done`). To eyeball a generated value, parse the JSON and inspect the key (e.g. `semanticTokenColors.enumMember`) rather than diffing the whole file.

## How build.js is structured

Everything flows from one script. The pipeline is: **two palette objects → three generator functions → four theme files**.

- **`dark` / `light` palette objects** — the single source of truth for color. Keys are semantic role names (`canvas`, `surface1`–`surface4`, `hairline*`, `ink`/`inkMuted`/`inkSubtle`/`inkTertiary`, `accent*`) plus a syntax sub-palette (`blue`, `lavender`, `green`, `cyan`, `amber`, `terracotta`, `orchid`, `operator`, `tagPunct`). The dark values come straight from `DESIGN.md` (Linear's marketing canvas tokens); the light palette is a derived inverse. **To recolor anything globally, change a palette value here — never a literal in a token rule.**
- **`tokenColors(p, italic)`** — TextMate scope rules. Each rule references a palette key (`p.blue`, etc.), never a raw hex. The `style(fg, on, extra)` helper builds the settings object; the `on` boolean marks a rule as *italic-eligible* — italic is applied only when the variant's `italic` flag is true, so the No-Italics variants are produced by the same rules with `italic=false`.
- **`semanticTokenColors(p, italic)`** — LSP semantic token colors. **These must be kept in sync with the TextMate rules by hand** (e.g. `parameter` and `namespace` appear in both). When you change a token's color, check whether it also has a semantic entry.
- **`workbenchColors(p)`** — all editor/UI chrome colors.
- **`variants` array** — the four (name, file, type, palette, italic) tuples. `tokenColors` and `semanticTokenColors` take the `italic` flag so the italic/non-italic split is a build-time parameter, not duplicated rule sets.

## Color philosophy (why collisions matter)

Linear's system is intentionally near-monochrome — a near-black/near-white canvas with the lavender-blue accent (`#5e6ad2`) used scarcely. The constraint is ~8 syntax hues covering ~25 token roles, so **each hue is reused across roles**. The design goal is that two distinct roles never share a color *when they appear adjacent in code* (e.g. enum name vs. enum member, type vs. namespace, string body vs. escape char). When adding language support or adjusting colors, reason about same-line/same-screen adjacency, not just whether a color "looks nice."

When adding a new language, prefer reusing existing palette keys for analogous roles over introducing a new hue; add a hue to the palette only when a genuinely new role collides with everything else on screen.

## Releasing

Publishing is automated by `.github/workflows/publish.yml`, triggered by pushing a `v*` tag. The workflow **fails fast if the tag version doesn't match `package.json`'s `version`** — bump `package.json` (and `package-lock.json`) and the tag together. It publishes to the VS Code Marketplace (requires `VSCE_PAT` repo secret) and Open VSX (optional `OVSX_PAT`), then creates a GitHub Release. Pushing to `master` without a tag does not publish.

## Reference

`DESIGN.md` is the authoritative Linear design spec (color tokens, typography, the four-step surface ladder, do's/don'ts). It's the source for the dark palette and the rationale for keeping the accent scarce. It's excluded from the packaged extension via `.vscodeignore`.
