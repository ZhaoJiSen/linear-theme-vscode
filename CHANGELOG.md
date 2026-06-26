# Change Log

## [0.3.0] - 2026-06-26

- Added two **Soft** dark variants (Linear Dark Soft / Linear Dark Soft No Italics) that lift the canvas from near-black `#010102` to a charcoal `#16171a` for low-contrast / bright-room comfort. Ink, accent, and all syntax colors are unchanged — only the surface ladder and hairlines move.

## [0.2.0] - 2026-06-26

- Enum members and named constants now use a dedicated cyan, so they no longer share the blue of the enum/type name they belong to.
- Reworked HTML/Vue/JSX tag coloring: tag name (lavender), angle-bracket punctuation (dimmed), attribute name (amber), attribute value (green), and Vue directives `v-*` / `@` / `:` / `#` (orchid italic) are now visually distinct.
- String escapes and regex special chars (`\n`, `\d`, anchors, quantifiers) move to terracotta so they stand out from the green string body.
- Function parameters move to a soft foreground, freeing orchid to read clearly as decorators (no more `@decorator` / parameter color clash).
- Namespace / path prefixes (`std::`, `React.`) dim to a subtle gray so the type name keeps the blue emphasis.
- Added coloring for CSS custom properties (`--var` and `var()` references) and Vue/template interpolation delimiters (`{{ }}`, `${}`).
- Added GitHub Actions release workflow: pushing a `v*` tag builds, packages, and publishes to the VS Code Marketplace (and Open VSX if configured), then creates a GitHub Release.

## [0.1.0] - 2026-06-26

- Initial release with four variants: Linear Dark, Linear Dark No Italics, Linear Light, Linear Light No Italics.
- Dark mode on the `#010102` canvas with the four-step surface ladder; light mode as a faithful near-white inverse, both keyed to the lavender-blue accent (`#5e6ad2`).
- Italic / upright keyword variants (keywords, comments, `this`/`self`, parameters, attributes).
- Language-tuned syntax highlighting: Go, Rust, JS, TS, JSX/React, Vue, HTML, CSS, SCSS, LESS, C, C++, C#, plus JSON, YAML, Markdown.
- TextMate scopes + semantic token coloring (Rust lifetimes, default-library symbols, decorators, macros).
- Terminal ANSI palette, git/diff decorations, and bracket-pair colorization.
- Themes generated from `build.js` for single-source-of-truth palette maintenance.
