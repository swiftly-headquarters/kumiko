export const STORAGE_KEY = "kumiko-docs-theme-overrides"
const STYLE_ID = "kumiko-docs-theme-overrides"
const HEX = /^#[0-9a-f]{6}$/i

export type Overrides = Record<"light" | "dark", Record<string, string>>

const TOKEN = /^--[a-z-]+$/

function clean(v: unknown): Record<string, string> {
  const out: Record<string, string> = {}
  if (!v || typeof v !== "object" || Array.isArray(v)) return out
  for (const [k, val] of Object.entries(v)) {
    if (TOKEN.test(k) && typeof val === "string" && HEX.test(val)) out[k] = val
  }
  return out
}

// Current computed value of a CSS variable as #rrggbb, for the color inputs.
// fillStyle keeps lab()/oklch() strings as-is, so paint one pixel and read it back.
export function computedHex(token: string): string {
  const css = getComputedStyle(document.documentElement)
    .getPropertyValue(token)
    .trim()
  const canvas = document.createElement("canvas")
  canvas.width = canvas.height = 1
  const ctx = canvas.getContext("2d", { willReadFrequently: true })
  if (!ctx || !css) return "#808080"
  ctx.fillStyle = css
  ctx.fillRect(0, 0, 1, 1)
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
  return "#" + [r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("")
}

export function readOverrides(): Overrides {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null")
    return { light: clean(raw?.light), dark: clean(raw?.dark) }
  } catch {
    return { light: {}, dark: {} }
  }
}

export function writeOverrides(o: Overrides) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(o))
  } catch {}
}

export function clearOverrides() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {}
}

export function applyOverrides(o: Overrides) {
  document.getElementById(STYLE_ID)?.remove()
  const rule = (sel: string, vars: Record<string, string>) => {
    const body = Object.entries(clean(vars))
      .map(([k, v]) => `${k}:${v}`)
      .join(";")
    return body ? `${sel}{${body}}` : ""
  }
  const css = rule("html:root", o.light) + rule("html.dark", o.dark)
  if (!css) return
  const el = document.createElement("style")
  el.id = STYLE_ID
  el.textContent = css
  document.head.appendChild(el)
}
