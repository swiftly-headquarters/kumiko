import fs from "node:fs"
import path from "node:path"
import { Suspense } from "react"
import type { Metadata } from "next"

import { type Palette, ThemeBuilder } from "@/components/docs/theme-builder"
import { components, groups } from "@/lib/docs/components"
import { fonts } from "./fonts"

export const metadata: Metadata = { title: "Create a theme" }

function readPalette(): Palette {
  const css = fs.readFileSync(
    path.join(process.cwd(), "node_modules/tailwindcss/theme.css"),
    "utf8"
  )
  const out: Palette = {}
  for (const [, name, step, value] of css.matchAll(
    /--color-([a-z]+)-(\d+):\s*(oklch\([^)]*\))/g
  ))
    (out[name] ??= {})[step] = value
      .replace(/([\d.]+)%/, (_, n) => String(+(Number(n) / 100).toFixed(4)))
      .replace(/none/g, "0")
  return out
}

const tiles = components
  .filter((c) =>
    fs.existsSync(path.join(process.cwd(), "docs/demos", c.slug, "default.tsx"))
  )
  .map(({ slug, title, group }) => ({ slug, title, group }))

export default function CreatePage() {
  return (
    <Suspense>
      <ThemeBuilder
        palette={readPalette()}
        fonts={fonts}
        tiles={tiles}
        sections={groups}
      />
    </Suspense>
  )
}
