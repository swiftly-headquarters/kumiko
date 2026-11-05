export type Group =
  "overlays" | "menus" | "controls" | "disclosure" | "display" | "chat"

export type ComponentEntry = {
  slug: string // file name without .tsx, e.g. "button"
  title: string // display name, e.g. "Button"
  group: Group
  visual: boolean // false = lighter page (no preview, replay, examples)
  description: string // one line
}

// demo = file name in docs/demos/<slug>/ without .tsx. Title and note come
// from optional leading "// title:" / "// note:" comments in the demo file.
export type Example = { title: string; demo: string; note?: string }

export type PropRow = {
  prop: string
  type: string
  default: string
  description: string
}
