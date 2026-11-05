import type { ComponentEntry, Example } from "./types"

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

// Sections in page order. The component page renders exactly these ids
// (examples are the slice starting at exampleStart); the TOC consumes the
// same list. Example ids are made unique against fixed ids and each other.
export const exampleStart = (entry: ComponentEntry) => (entry.visual ? 3 : 2)

export function sectionsFor(
  entry: ComponentEntry,
  examples: Example[]
): { id: string; title: string }[] {
  const s: { id: string; title: string }[] = []
  if (entry.visual) s.push({ id: "preview", title: "Preview" })
  s.push({ id: "installation", title: "Installation" })
  s.push({ id: "usage", title: "Usage" })
  if (entry.visual) {
    const seen = new Set(["preview", "installation", "usage", "api-reference"])
    for (const e of examples) {
      const base = slugify(e.title) || "example"
      let id = base
      for (let n = 2; seen.has(id); n++) id = `${base}-${n}`
      seen.add(id)
      s.push({ id, title: e.title })
    }
  }
  s.push({ id: "api-reference", title: "API Reference" })
  return s
}
