import { existsSync, readdirSync, readFileSync } from "node:fs"
import path from "node:path"

import type { Example, PropRow } from "./types"

// Server-only by convention (uses fs; the `server-only` package is not installed).
const normalize = (s: string) => s.replace(/\r\n/g, "\n").replace(/\n$/, "")

// Leading "// title: ..." / "// note: ..." lines, then a blank line.
const HEADER = /^((?:\/\/ (?:title|note): .*\n)+)\n/

const demoPath = (slug: string, demo: string) =>
  path.join(process.cwd(), "docs/demos", slug, `${demo}.tsx`)

// `export const controls = {...}` block (closing brace at column 0) is
// playground wiring, not usage: hidden from the displayed source.
const CONTROLS = /^export const controls\b[\s\S]*?^}\n\n?/m

export function hasControls(slug: string, demo: string): boolean {
  return CONTROLS.test(readFileSync(demoPath(slug, demo), "utf8").replace(/\r\n/g, "\n"))
}

// Demo source without its metadata header and controls block.
export function readDemoSource(slug: string, demo: string): string {
  return normalize(readFileSync(demoPath(slug, demo), "utf8"))
    .replace(HEADER, "")
    .replace(CONTROLS, "")
}

const defaultTitle = (demo: string) => {
  const t = demo.replace(/-/g, " ")
  return t[0].toUpperCase() + t.slice(1)
}

// Examples = every demo file: "default" first, then by file name.
export function listExamples(slug: string): Example[] {
  const dir = path.dirname(demoPath(slug, "x"))
  if (!existsSync(dir)) return []
  return readdirSync(dir)
    .filter((f) => f.endsWith(".tsx"))
    .map((f) => f.slice(0, -4))
    .sort((a, b) =>
      a === "default" ? -1 : b === "default" ? 1 : a.localeCompare(b)
    )
    .map((demo) => {
      const head =
        HEADER.exec(normalize(readFileSync(demoPath(slug, demo), "utf8")))?.[1] ??
        ""
      const field = (k: string) =>
        new RegExp(`^// ${k}: (.*)$`, "m").exec(head)?.[1]
      return {
        demo,
        title: field("title") ?? defaultTitle(demo),
        note: field("note"),
      }
    })
}

// Hand-written per slug in docs/props/<slug>.json
export function readProps(slug: string): PropRow[] {
  return JSON.parse(
    readFileSync(path.join(process.cwd(), "docs/props", `${slug}.json`), "utf8")
  )
}

export type RegistryItem = {
  dependencies: string[]
  registryDependencies: string[]
  files: { path: string; content: string }[]
}

export function readRegistryItem(slug: string): RegistryItem {
  const raw = JSON.parse(
    readFileSync(path.join(process.cwd(), "public/r", `${slug}.json`), "utf8")
  )
  return {
    dependencies: raw.dependencies ?? [],
    registryDependencies: raw.registryDependencies ?? [],
    files: (raw.files ?? []).map((f: { path: string; content: string }) => ({
      path: f.path,
      content: normalize(f.content),
    })),
  }
}
