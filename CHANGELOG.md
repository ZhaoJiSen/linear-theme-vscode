# Change Log

## [Unreleased]

- Enum members and named constants now use a dedicated cyan, so they no longer share the blue of the enum/type name they belong to.
- Reworked HTML/Vue/JSX tag coloring: tag name (lavender), angle-bracket punctuation (dimmed), attribute name (amber), attribute value (green), and Vue directives `v-*` / `@` / `:` / `#` (orchid italic) are now visually distinct.
- Added GitHub Actions release workflow: pushing a `v*` tag builds, packages, and publishes to the VS Code Marketplace (and Open VSX if configured), then creates a GitHub Release.

## [0.1.0] - 2026-06-26

- Initial release with four variants: Linear Dark, Linear Dark No Italics, Linear Light, Linear Light No Italics.
- Dark mode on the `#010102` canvas with the four-step surface ladder; light mode as a faithful near-white inverse, both keyed to the lavender-blue accent (`#5e6ad2`).
- Italic / upright keyword variants (keywords, comments, `this`/`self`, parameters, attributes).
- Language-tuned syntax highlighting: Go, Rust, JS, TS, JSX/React, Vue, HTML, CSS, SCSS, LESS, C, C++, C#, plus JSON, YAML, Markdown.
- TextMate scopes + semantic token coloring (Rust lifetimes, default-library symbols, decorators, macros).
- Terminal ANSI palette, git/diff decorations, and bracket-pair colorization.
- Themes generated from `build.js` for single-source-of-truth palette maintenance.
