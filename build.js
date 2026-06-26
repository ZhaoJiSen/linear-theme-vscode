// Build script: generates the four Linear theme variants from one shared palette.
//
//   Linear Dark            (italic keywords/comments)
//   Linear Dark No Italics
//   Linear Light           (italic keywords/comments)
//   Linear Light No Italics
//
// Run with: node build.js
// Output:   themes/*.json

const fs = require("fs");
const path = require("path");

// ---------------------------------------------------------------------------
// Palettes
// ---------------------------------------------------------------------------
// Dark palette is taken straight from DESIGN.md (Linear marketing canvas).
// Light palette is a derived inverse: near-white canvas, dark ink, same
// lavender accent — Linear does not ship a light marketing site, so this is a
// faithful extrapolation that keeps the brand hue scarce.

const dark = {
  // surfaces
  canvas: "#010102",
  surface1: "#0f1011",
  surface2: "#141516",
  surface3: "#18191a",
  surface4: "#191a1b",
  hairline: "#23252a",
  hairlineStrong: "#34343a",
  hairlineTertiary: "#3e3e44",
  // ink
  ink: "#f7f8f8",
  inkMuted: "#d0d6e0",
  inkSubtle: "#8a8f98",
  inkTertiary: "#62666d",
  // accent
  accent: "#5e6ad2",
  accentHover: "#828fff",
  accentFocus: "#5e69d1",
  onAccent: "#ffffff",
  // syntax (drawn from Linear's in-product tag palette)
  blue: "#7bb0ff",
  lavender: "#828fff",
  green: "#68cc9a",
  amber: "#e3b341",
  terracotta: "#e08c5a",
  orchid: "#d98ad9",
  operator: "#9aa0b3",
  // semantic
  success: "#27a644",
  warning: "#e3b341",
  error: "#eb5757",
  info: "#5e6ad2",
  // alpha helpers
  selection: "#5e6ad240",
  selectionStrong: "#5e6ad266",
  matchHighlight: "#5e6ad233",
  lineHighlight: "#0f1011",
  insertedBg: "#27a64422",
  removedBg: "#eb575722",
  scrollSlider: "#23252a80",
};

const light = {
  // surfaces — near-white canvas, lifted panels go slightly cooler
  canvas: "#ffffff",
  surface1: "#f7f8f8",
  surface2: "#f0f1f3",
  surface3: "#e9ebee",
  surface4: "#e3e6ea",
  hairline: "#e1e4e8",
  hairlineStrong: "#d0d4da",
  hairlineTertiary: "#c2c7cf",
  // ink — dark, never pure black
  ink: "#1c1d21",
  inkMuted: "#3c4149",
  inkSubtle: "#62666d",
  inkTertiary: "#8a8f98",
  // accent — same Linear lavender, darkened slightly for AA contrast on white
  accent: "#5e6ad2",
  accentHover: "#4854c0",
  accentFocus: "#5e69d1",
  onAccent: "#ffffff",
  // syntax — darker cuts of the same hues so they read on white
  blue: "#2f6fd0",
  lavender: "#5b51d8",
  green: "#1a8a55",
  amber: "#9a6a00",
  terracotta: "#c25a2b",
  orchid: "#a838a8",
  operator: "#6a6f7a",
  // semantic
  success: "#1a8a3f",
  warning: "#9a6a00",
  error: "#d12f2f",
  info: "#5e6ad2",
  // alpha helpers
  selection: "#5e6ad233",
  selectionStrong: "#5e6ad24d",
  matchHighlight: "#5e6ad226",
  lineHighlight: "#f4f5f7",
  insertedBg: "#1a8a3f1f",
  removedBg: "#d12f2f1f",
  scrollSlider: "#c2c7cf99",
};

// ---------------------------------------------------------------------------
// Syntax token rules
// ---------------------------------------------------------------------------
// Each rule names a palette key for its color. `italic: true` marks rules that
// turn italic in the italic variants (keywords, comments, this/self,
// parameters, attributes). The no-italics variants drop fontStyle entirely.

function tokenColors(p, italic) {
  const it = (on) => (italic && on ? "italic" : undefined);
  const style = (fg, on, extra) => {
    const s = {};
    if (fg) s.foreground = fg;
    const fontStyle = [it(on), extra].filter(Boolean).join(" ");
    if (fontStyle) s.fontStyle = fontStyle;
    return s;
  };

  return [
    // ---- Common ----
    {
      name: "Comment",
      scope: ["comment", "punctuation.definition.comment", "string.comment"],
      settings: style(p.inkTertiary, true),
    },
    {
      name: "Variables",
      scope: ["variable", "string constant.other.placeholder"],
      settings: style(p.inkMuted, false),
    },
    {
      name: "Parameters",
      scope: ["variable.parameter", "meta.function.parameters", "variable.parameter.function-call"],
      settings: style(p.orchid, true),
    },
    {
      name: "Properties / object keys",
      scope: ["variable.other.property", "support.variable.property", "meta.object-literal.key", "variable.other.object.property"],
      settings: style(p.blue, false),
    },
    {
      name: "this / self / super",
      scope: ["variable.language", "variable.language.this", "keyword.other.this"],
      settings: style(p.lavender, true),
    },
    {
      name: "Constants & enums",
      scope: ["variable.other.constant", "constant.other", "constant.other.caps", "variable.other.enummember"],
      settings: style(p.blue, false),
    },
    {
      name: "Numbers & boolean / null literals",
      scope: [
        "constant.numeric",
        "constant.language.boolean",
        "constant.language.null",
        "constant.language.undefined",
        "constant.language.nan",
        "constant.language.infinity",
        "constant.language.nil",
      ],
      settings: style(p.terracotta, false),
    },
    {
      name: "Escapes & regex",
      scope: ["constant.character.escape", "constant.other.character-class.regexp", "string.regexp", "punctuation.definition.group.regexp"],
      settings: style(p.green, false),
    },
    {
      name: "Strings",
      scope: ["string", "string.quoted", "punctuation.definition.string", "string.template"],
      settings: style(p.green, false),
    },
    {
      name: "Template expression punctuation",
      scope: ["punctuation.definition.template-expression", "punctuation.section.embedded", "meta.template.expression"],
      settings: style(p.lavender, false),
    },
    {
      name: "Keywords",
      scope: ["keyword", "keyword.control", "keyword.other", "keyword.control.flow"],
      settings: style(p.lavender, true),
    },
    {
      name: "Storage (var/let/const/func/class/struct)",
      scope: ["storage", "storage.type", "storage.modifier", "keyword.declaration"],
      settings: style(p.lavender, true),
    },
    {
      name: "Operators",
      scope: ["keyword.operator", "keyword.operator.logical", "keyword.operator.arithmetic", "keyword.operator.assignment", "punctuation.accessor"],
      settings: style(p.operator, false),
    },
    {
      name: "Functions & methods",
      scope: ["entity.name.function", "support.function", "meta.function-call.generic", "variable.function", "meta.function-call"],
      settings: style(p.amber, false),
    },
    {
      name: "Function declaration name",
      scope: ["entity.name.function.member", "meta.definition.method entity.name.function"],
      settings: style(p.amber, false),
    },
    {
      name: "Classes, types, structs, interfaces",
      scope: [
        "entity.name.type",
        "entity.name.class",
        "entity.other.inherited-class",
        "support.class",
        "support.type",
        "entity.name.type.interface",
        "entity.name.type.alias",
        "entity.name.type.struct",
        "entity.name.type.enum",
        "meta.type.annotation entity.name.type",
      ],
      settings: style(p.blue, false),
    },
    {
      name: "Namespaces / modules / packages",
      scope: ["entity.name.namespace", "entity.name.module", "support.module", "entity.name.scope-resolution", "entity.name.type.namespace"],
      settings: style(p.blue, false),
    },
    {
      name: "Tags (HTML/JSX/XML/Vue)",
      scope: ["entity.name.tag", "punctuation.definition.tag", "entity.name.tag.html", "entity.name.tag.template"],
      settings: style(p.lavender, false),
    },
    {
      name: "Component tags (JSX/Vue PascalCase)",
      scope: ["support.class.component", "entity.name.tag.namespace"],
      settings: style(p.blue, false),
    },
    {
      name: "Tag attributes",
      scope: ["entity.other.attribute-name", "entity.other.attribute-name.html", "entity.other.attribute-name.vue"],
      settings: style(p.amber, true),
    },
    {
      name: "Vue directives",
      scope: ["entity.other.attribute-name.vue.directive", "meta.directive.vue"],
      settings: style(p.lavender, true),
    },
    {
      name: "Decorators / annotations",
      scope: ["meta.decorator", "punctuation.decorator", "entity.name.function.decorator", "storage.type.annotation", "meta.attribute"],
      settings: style(p.orchid, true),
    },
    {
      name: "Punctuation",
      scope: ["punctuation", "punctuation.separator", "punctuation.terminator", "meta.brace", "punctuation.section"],
      settings: style(p.inkSubtle, false),
    },
    {
      name: "Support constants / built-in vars",
      scope: ["support.constant", "support.variable", "support.type.builtin"],
      settings: style(p.blue, false),
    },

    // ---- Go ----
    {
      name: "Go package & imports",
      scope: ["entity.name.package.go", "keyword.package.go", "keyword.import.go"],
      settings: style(p.lavender, true),
    },
    {
      name: "Go field tags / runtime",
      scope: ["entity.name.tag.go", "support.type.builtin.go"],
      settings: style(p.blue, false),
    },

    // ---- Rust ----
    {
      name: "Rust lifetimes",
      scope: ["storage.modifier.lifetime.rust", "entity.name.lifetime.rust", "punctuation.definition.lifetime.rust"],
      settings: style(p.terracotta, true),
    },
    {
      name: "Rust macros",
      scope: ["entity.name.function.macro.rust", "support.function.macro.rust", "meta.macro.rust"],
      settings: style(p.orchid, false),
    },
    {
      name: "Rust attributes",
      scope: ["meta.attribute.rust", "punctuation.definition.attribute.rust"],
      settings: style(p.orchid, true),
    },

    // ---- C / C++ / C# ----
    {
      name: "C/C++ preprocessor",
      scope: ["keyword.control.directive", "punctuation.definition.directive", "meta.preprocessor"],
      settings: style(p.orchid, true),
    },
    {
      name: "C/C++/C# storage types",
      scope: ["storage.type.built-in.c", "storage.type.built-in.cpp", "storage.type.cs", "keyword.type.cs"],
      settings: style(p.lavender, true),
    },
    {
      name: "C# interpolation & attributes",
      scope: ["meta.interpolation.cs", "entity.name.type.class.cs", "support.type.cs"],
      settings: style(p.blue, false),
    },

    // ---- CSS / SCSS / LESS ----
    {
      name: "CSS property names",
      scope: ["support.type.property-name.css", "support.type.property-name.scss", "support.type.property-name.less", "meta.property-name"],
      settings: style(p.blue, false),
    },
    {
      name: "CSS property values & units",
      scope: ["support.constant.property-value.css", "keyword.other.unit", "constant.numeric.css", "support.constant.property-value.scss"],
      settings: style(p.terracotta, false),
    },
    {
      name: "CSS class & id selectors",
      scope: ["entity.other.attribute-name.class.css", "entity.other.attribute-name.id.css", "entity.other.attribute-name.class.scss"],
      settings: style(p.amber, false),
    },
    {
      name: "CSS element / pseudo selectors",
      scope: ["entity.name.tag.css", "entity.other.attribute-name.pseudo-class.css", "entity.other.attribute-name.pseudo-element.css"],
      settings: style(p.lavender, true),
    },
    {
      name: "SCSS/LESS variables & mixins",
      scope: ["variable.scss", "variable.less", "variable.other.less", "entity.name.function.scss", "keyword.control.at-rule.css"],
      settings: style(p.orchid, false),
    },
    {
      name: "CSS at-rules (@media, @import...)",
      scope: ["keyword.control.at-rule", "punctuation.definition.keyword.css"],
      settings: style(p.lavender, true),
    },

    // ---- JSON / YAML ----
    {
      name: "JSON / YAML keys",
      scope: ["support.type.property-name.json", "support.type.property-name.toml", "entity.name.tag.yaml"],
      settings: style(p.blue, false),
    },

    // ---- Markdown ----
    {
      name: "Markdown headings",
      scope: ["markup.heading", "entity.name.section.markdown", "punctuation.definition.heading.markdown"],
      settings: style(p.lavender, false, "bold"),
    },
    { name: "Markdown bold", scope: ["markup.bold"], settings: style(p.ink, false, "bold") },
    { name: "Markdown italic", scope: ["markup.italic"], settings: { foreground: p.inkMuted, fontStyle: "italic" } },
    {
      name: "Markdown links",
      scope: ["markup.underline.link", "string.other.link", "constant.other.reference.link.markdown"],
      settings: style(p.blue, false, "underline"),
    },
    { name: "Markdown inline code", scope: ["markup.inline.raw", "markup.raw.block"], settings: style(p.green, false) },
    { name: "Markdown quote", scope: ["markup.quote"], settings: { foreground: p.inkSubtle, fontStyle: "italic" } },
    { name: "Markdown list bullet", scope: ["markup.list punctuation.definition.list.begin", "beginning.punctuation.definition.list"], settings: style(p.accent, false) },

    // ---- Diff ----
    { name: "Diff inserted", scope: ["markup.inserted"], settings: style(p.success, false) },
    { name: "Diff deleted", scope: ["markup.deleted"], settings: style(p.error, false) },
    { name: "Diff changed", scope: ["markup.changed"], settings: style(p.warning, false) },

    // ---- States ----
    { name: "Invalid", scope: ["invalid", "invalid.illegal"], settings: style(p.error, false) },
    { name: "Deprecated", scope: ["invalid.deprecated"], settings: { foreground: p.warning, fontStyle: "strikethrough" } },
  ];
}

// ---------------------------------------------------------------------------
// Semantic token colors
// ---------------------------------------------------------------------------
function semanticTokenColors(p, italic) {
  return {
    parameter: p.orchid,
    property: p.blue,
    "variable.readonly": p.blue,
    "variable.defaultLibrary": p.lavender,
    "function.defaultLibrary": p.amber,
    "class.defaultLibrary": p.blue,
    enumMember: p.blue,
    type: p.blue,
    struct: p.blue,
    interface: p.blue,
    namespace: p.blue,
    decorator: p.orchid,
    macro: p.orchid,
    lifetime: { foreground: p.terracotta, fontStyle: italic ? "italic" : "" },
    selfParameter: { foreground: p.lavender, fontStyle: italic ? "italic" : "" },
    keyword: { fontStyle: italic ? "italic" : "" },
    comment: { fontStyle: italic ? "italic" : "" },
    "*.deprecated": { fontStyle: "strikethrough" },
  };
}

// ---------------------------------------------------------------------------
// Workbench colors
// ---------------------------------------------------------------------------
function workbenchColors(p) {
  return {
    foreground: p.inkMuted,
    focusBorder: p.accentFocus,
    "selection.background": p.selection,
    descriptionForeground: p.inkSubtle,
    errorForeground: p.error,
    "icon.foreground": p.inkSubtle,
    "widget.border": p.hairline,
    "sash.hoverBorder": p.accent,

    "editor.background": p.canvas,
    "editor.foreground": p.inkMuted,
    "editorLineNumber.foreground": p.hairlineTertiary,
    "editorLineNumber.activeForeground": p.inkSubtle,
    "editorCursor.foreground": p.accent,
    "editor.selectionBackground": p.selection,
    "editor.selectionHighlightBackground": p.matchHighlight,
    "editor.inactiveSelectionBackground": p.matchHighlight,
    "editor.wordHighlightBackground": p.matchHighlight,
    "editor.wordHighlightStrongBackground": p.selection,
    "editor.findMatchBackground": p.selectionStrong,
    "editor.findMatchHighlightBackground": p.matchHighlight,
    "editor.lineHighlightBackground": p.lineHighlight,
    "editorWhitespace.foreground": p.hairline,
    "editorIndentGuide.background1": p.surface3,
    "editorIndentGuide.activeBackground1": p.hairlineStrong,
    "editorRuler.foreground": p.surface3,
    "editorBracketMatch.background": p.matchHighlight,
    "editorBracketMatch.border": p.accent,
    "editorLink.activeForeground": p.accentHover,

    "editorBracketHighlight.foreground1": p.lavender,
    "editorBracketHighlight.foreground2": p.blue,
    "editorBracketHighlight.foreground3": p.green,
    "editorBracketHighlight.foreground4": p.amber,
    "editorBracketHighlight.foreground5": p.orchid,
    "editorBracketHighlight.foreground6": p.terracotta,
    "editorBracketHighlight.unexpectedBracket.foreground": p.error,

    "editorGutter.background": p.canvas,
    "editorGutter.modifiedBackground": p.accent,
    "editorGutter.addedBackground": p.success,
    "editorGutter.deletedBackground": p.error,
    "editorOverviewRuler.border": "#00000000",
    "editorOverviewRuler.findMatchForeground": p.selectionStrong,
    "editorOverviewRuler.errorForeground": p.error,
    "editorOverviewRuler.warningForeground": p.warning,
    "editorOverviewRuler.modifiedForeground": p.accent,
    "editorOverviewRuler.addedForeground": p.success,
    "editorOverviewRuler.deletedForeground": p.error,

    "editorError.foreground": p.error,
    "editorWarning.foreground": p.warning,
    "editorInfo.foreground": p.info,
    "editorHint.foreground": p.success,

    "editorWidget.background": p.surface1,
    "editorWidget.foreground": p.inkMuted,
    "editorWidget.border": p.hairline,
    "editorSuggestWidget.background": p.surface1,
    "editorSuggestWidget.border": p.hairline,
    "editorSuggestWidget.foreground": p.inkMuted,
    "editorSuggestWidget.highlightForeground": p.accentHover,
    "editorSuggestWidget.selectedBackground": p.surface3,
    "editorHoverWidget.background": p.surface1,
    "editorHoverWidget.border": p.hairline,
    "editorGhostText.foreground": p.inkTertiary,

    "peekView.border": p.accent,
    "peekViewEditor.background": p.surface1,
    "peekViewEditor.matchHighlightBackground": p.selectionStrong,
    "peekViewResult.background": p.surface1,
    "peekViewResult.selectionBackground": p.matchHighlight,
    "peekViewResult.matchHighlightBackground": p.selectionStrong,
    "peekViewTitle.background": p.surface2,
    "peekViewTitleLabel.foreground": p.ink,
    "peekViewTitleDescription.foreground": p.inkSubtle,

    "activityBar.background": p.canvas,
    "activityBar.foreground": p.ink,
    "activityBar.inactiveForeground": p.inkTertiary,
    "activityBar.border": p.surface3,
    "activityBarBadge.background": p.accent,
    "activityBarBadge.foreground": p.onAccent,
    "activityBar.activeBorder": p.accent,
    "activityBar.activeBackground": p.surface1,

    "sideBar.background": p.canvas,
    "sideBar.foreground": p.inkSubtle,
    "sideBar.border": p.surface3,
    "sideBarTitle.foreground": p.inkSubtle,
    "sideBarSectionHeader.background": p.canvas,
    "sideBarSectionHeader.foreground": p.inkSubtle,
    "sideBarSectionHeader.border": p.surface3,

    "list.activeSelectionBackground": p.surface3,
    "list.activeSelectionForeground": p.ink,
    "list.inactiveSelectionBackground": p.surface2,
    "list.inactiveSelectionForeground": p.inkMuted,
    "list.hoverBackground": p.surface1,
    "list.hoverForeground": p.ink,
    "list.focusBackground": p.surface3,
    "list.focusForeground": p.ink,
    "list.highlightForeground": p.accentHover,
    "list.errorForeground": p.error,
    "list.warningForeground": p.warning,
    "tree.indentGuidesStroke": p.hairline,
    "list.dropBackground": p.matchHighlight,

    "editorGroup.border": p.surface3,
    "editorGroupHeader.tabsBackground": p.canvas,
    "editorGroupHeader.tabsBorder": p.surface3,
    "editorGroupHeader.noTabsBackground": p.canvas,
    "tab.activeBackground": p.surface1,
    "tab.activeForeground": p.ink,
    "tab.activeBorderTop": p.accent,
    "tab.activeBorder": "#00000000",
    "tab.inactiveBackground": p.canvas,
    "tab.inactiveForeground": p.inkTertiary,
    "tab.border": p.surface3,
    "tab.hoverBackground": p.surface1,
    "tab.hoverForeground": p.ink,
    "tab.unfocusedActiveForeground": p.inkSubtle,
    "tab.unfocusedInactiveForeground": p.hairlineTertiary,
    "tab.lastPinnedBorder": p.hairline,

    "titleBar.activeBackground": p.canvas,
    "titleBar.activeForeground": p.inkMuted,
    "titleBar.inactiveBackground": p.canvas,
    "titleBar.inactiveForeground": p.inkTertiary,
    "titleBar.border": p.surface3,

    "statusBar.background": p.canvas,
    "statusBar.foreground": p.inkSubtle,
    "statusBar.border": p.surface3,
    "statusBar.debuggingBackground": p.accent,
    "statusBar.debuggingForeground": p.onAccent,
    "statusBar.noFolderBackground": p.canvas,
    "statusBarItem.hoverBackground": p.surface3,
    "statusBarItem.remoteBackground": p.accent,
    "statusBarItem.remoteForeground": p.onAccent,
    "statusBarItem.prominentBackground": p.surface3,
    "statusBarItem.errorBackground": p.canvas,
    "statusBarItem.errorForeground": p.error,
    "statusBarItem.warningBackground": p.canvas,
    "statusBarItem.warningForeground": p.warning,

    "commandCenter.background": p.surface1,
    "commandCenter.foreground": p.inkMuted,
    "commandCenter.border": p.hairline,
    "commandCenter.activeBackground": p.surface3,
    "commandCenter.activeForeground": p.ink,

    "button.background": p.accent,
    "button.foreground": p.onAccent,
    "button.hoverBackground": p.accentHover,
    "button.secondaryBackground": p.surface3,
    "button.secondaryForeground": p.ink,
    "button.secondaryHoverBackground": p.hairline,
    "button.border": "#00000000",

    "input.background": p.surface1,
    "input.foreground": p.ink,
    "input.border": p.hairline,
    "input.placeholderForeground": p.inkTertiary,
    "inputOption.activeBackground": p.matchHighlight,
    "inputOption.activeForeground": p.ink,
    "inputOption.activeBorder": p.accent,
    "inputValidation.errorBorder": p.error,
    "inputValidation.warningBorder": p.warning,
    "inputValidation.infoBorder": p.info,
    "dropdown.background": p.surface1,
    "dropdown.foreground": p.inkMuted,
    "dropdown.border": p.hairline,
    "dropdown.listBackground": p.surface1,

    "badge.background": p.accent,
    "badge.foreground": p.onAccent,

    "scrollbar.shadow": "#00000000",
    "scrollbarSlider.background": p.scrollSlider,
    "scrollbarSlider.hoverBackground": p.hairlineStrong,
    "scrollbarSlider.activeBackground": p.hairlineTertiary,

    "progressBar.background": p.accent,

    "panel.background": p.canvas,
    "panel.border": p.surface3,
    "panelTitle.activeForeground": p.ink,
    "panelTitle.activeBorder": p.accent,
    "panelTitle.inactiveForeground": p.inkTertiary,
    "panelSectionHeader.background": p.surface1,

    "terminal.background": p.canvas,
    "terminal.foreground": p.inkMuted,
    "terminal.ansiBlack": p.canvas,
    "terminal.ansiRed": p.error,
    "terminal.ansiGreen": p.success,
    "terminal.ansiYellow": p.amber,
    "terminal.ansiBlue": p.accent,
    "terminal.ansiMagenta": p.orchid,
    "terminal.ansiCyan": p.green,
    "terminal.ansiWhite": p.inkMuted,
    "terminal.ansiBrightBlack": p.inkTertiary,
    "terminal.ansiBrightRed": p.error,
    "terminal.ansiBrightGreen": p.success,
    "terminal.ansiBrightYellow": p.amber,
    "terminal.ansiBrightBlue": p.accentHover,
    "terminal.ansiBrightMagenta": p.orchid,
    "terminal.ansiBrightCyan": p.green,
    "terminal.ansiBrightWhite": p.ink,
    "terminal.selectionBackground": p.selection,
    "terminalCursor.foreground": p.accent,
    "terminal.border": p.surface3,

    "gitDecoration.modifiedResourceForeground": p.blue,
    "gitDecoration.deletedResourceForeground": p.error,
    "gitDecoration.untrackedResourceForeground": p.success,
    "gitDecoration.ignoredResourceForeground": p.hairlineTertiary,
    "gitDecoration.conflictingResourceForeground": p.warning,
    "gitDecoration.addedResourceForeground": p.success,
    "gitDecoration.stageModifiedResourceForeground": p.accentHover,

    "diffEditor.insertedTextBackground": p.insertedBg,
    "diffEditor.removedTextBackground": p.removedBg,
    "diffEditor.insertedLineBackground": p.insertedBg,
    "diffEditor.removedLineBackground": p.removedBg,
    "diffEditor.border": p.surface3,

    "merge.currentHeaderBackground": p.selection,
    "merge.currentContentBackground": p.matchHighlight,
    "merge.incomingHeaderBackground": p.insertedBg,
    "merge.incomingContentBackground": p.insertedBg,

    "notificationCenter.border": p.hairline,
    "notificationCenterHeader.background": p.surface2,
    "notifications.background": p.surface1,
    "notifications.foreground": p.inkMuted,
    "notifications.border": p.hairline,
    "notificationLink.foreground": p.accentHover,

    "quickInput.background": p.surface1,
    "quickInput.foreground": p.inkMuted,
    "quickInputList.focusBackground": p.surface3,
    "quickInputList.focusForeground": p.ink,
    "pickerGroup.foreground": p.accent,
    "pickerGroup.border": p.hairline,

    "breadcrumb.foreground": p.inkTertiary,
    "breadcrumb.focusForeground": p.ink,
    "breadcrumb.activeSelectionForeground": p.ink,
    "breadcrumbPicker.background": p.surface1,

    "menu.background": p.surface1,
    "menu.foreground": p.inkMuted,
    "menu.border": p.hairline,
    "menu.selectionBackground": p.surface3,
    "menu.selectionForeground": p.ink,
    "menu.separatorBackground": p.hairline,
    "menubar.selectionBackground": p.surface3,
    "menubar.selectionForeground": p.ink,

    "settings.headerForeground": p.ink,
    "settings.modifiedItemIndicator": p.accent,
    "settings.focusedRowBackground": p.surface1,

    "textLink.foreground": p.accentHover,
    "textLink.activeForeground": p.accent,
    "textPreformat.foreground": p.green,
    "textBlockQuote.background": p.surface1,
    "textBlockQuote.border": p.accent,
    "textCodeBlock.background": p.surface1,
    "textSeparator.foreground": p.hairline,

    "charts.foreground": p.inkMuted,
    "charts.lines": p.hairline,
    "charts.red": p.error,
    "charts.blue": p.accent,
    "charts.yellow": p.amber,
    "charts.orange": p.terracotta,
    "charts.green": p.success,
    "charts.purple": p.orchid,

    "minimap.selectionHighlight": p.selectionStrong,
    "minimap.findMatchHighlight": p.accent,
    "minimap.errorHighlight": p.error,
    "minimap.warningHighlight": p.warning,

    "extensionButton.prominentBackground": p.accent,
    "extensionButton.prominentForeground": p.onAccent,
    "extensionButton.prominentHoverBackground": p.accentHover,
    "extensionBadge.remoteBackground": p.accent,
    "welcomePage.tileBackground": p.surface1,
    "welcomePage.tileHoverBackground": p.surface2,
    "welcomePage.background": p.canvas,
  };
}

// ---------------------------------------------------------------------------
// Assemble & write
// ---------------------------------------------------------------------------
const variants = [
  { name: "Linear Dark", file: "linear-dark", type: "dark", palette: dark, italic: true },
  { name: "Linear Dark No Italics", file: "linear-dark-no-italics", type: "dark", palette: dark, italic: false },
  { name: "Linear Light", file: "linear-light", type: "light", palette: light, italic: true },
  { name: "Linear Light No Italics", file: "linear-light-no-italics", type: "light", palette: light, italic: false },
];

const outDir = path.join(__dirname, "themes");
fs.mkdirSync(outDir, { recursive: true });

for (const v of variants) {
  const theme = {
    name: v.name,
    type: v.type,
    semanticHighlighting: true,
    colors: workbenchColors(v.palette),
    tokenColors: tokenColors(v.palette, v.italic),
    semanticTokenColors: semanticTokenColors(v.palette, v.italic),
  };
  const dest = path.join(outDir, `${v.file}-color-theme.json`);
  fs.writeFileSync(dest, JSON.stringify(theme, null, 2) + "\n");
  console.log(`wrote ${path.relative(__dirname, dest)}`);
}

console.log("done");
