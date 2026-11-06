"use client"

import {
  memo,
  startTransition,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useTheme } from "next-themes"
import { MoonIcon, RotateCcwIcon, ShuffleIcon, SunIcon } from "lucide-react"

import { DemoRender, preloadDemo } from "@/components/docs/demo-render"
import { Logo } from "@/components/docs/logo"
import { Button } from "@/components/ui/button"
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockCopyButton,
  CodeBlockContent,
} from "@/components/ui/code-block"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"

export type Tile = { slug: string; title: string; group: string }
export type Section = { id: string; title: string }

// Tailwind color name -> step ("50".."950") -> "oklch(...)".
export type Palette = Record<string, Record<string, string>>
export type FontOption = { name: string; family: string }

const BASES = [
  "neutral",
  "stone",
  "zinc",
  "gray",
  "slate",
  "mauve",
  "olive",
  "mist",
  "taupe",
]
const ACCENTS = [
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",
]
const RADII = [
  { value: "0rem", label: "None" },
  { value: "0.375rem", label: "Small" },
  { value: "0.625rem", label: "Default" },
  { value: "0.875rem", label: "Medium" },
  { value: "1.125rem", label: "Large" },
]

const DEFAULTS = {
  base: "neutral",
  theme: "base",
  chart: "base",
  radius: "0.625rem",
  font: "Outfit",
  heading: "font",
}
type Config = typeof DEFAULTS
type Key = keyof Config
type Option = { value: string; label: string; swatch?: string; family?: string }

const cap = (s: string) => s[0].toUpperCase() + s.slice(1)
function luminance(c: string) {
  const [L, C, H] = c
    .slice(6)
    .split(/[\s)]+/)
    .map(Number)
  const a = C * Math.cos((H * Math.PI) / 180)
  const b = C * Math.sin((H * Math.PI) / 180)
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3
  const clamp = (x: number) => Math.min(1, Math.max(0, x))
  const r = clamp(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s)
  const g = clamp(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s)
  const bl = clamp(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s)
  return 0.2126 * r + 0.7152 * g + 0.0722 * bl
}
const contrast = (x: string, y: string) => {
  const [hi, lo] = [luminance(x), luminance(y)].sort((p, q) => q - p)
  return (hi + 0.05) / (lo + 0.05)
}
const kebab = (s: string) => s.toLowerCase().replace(/\s+/g, "-")

function build(p: Palette, c: Config) {
  const b = p[c.base]
  const t = c.theme === "base" ? undefined : p[c.theme]
  const ch = p[c.chart === "base" ? c.base : c.chart]
  // Text on a colored primary: whichever of 950/50 has the higher contrast.
  const on = (bg: string, s: Record<string, string>) =>
    contrast(bg, s["950"]) >= contrast(bg, s["50"]) ? s["950"] : s["50"]
  const charts = Object.fromEntries(
    ["300", "500", "600", "700", "800"].map((s, i) => [`chart-${i + 1}`, ch[s]])
  )
  const white = "oklch(1 0 0)"
  const lp = t ? t["600"] : b["900"]
  const lpf = t ? on(t["600"], t) : b["50"]
  const dp = t ? t["500"] : b["200"]
  const dpf = t ? on(t["500"], t) : b["900"]
  const light = {
    background: white,
    foreground: b["950"],
    card: white,
    "card-foreground": b["950"],
    popover: white,
    "popover-foreground": b["950"],
    primary: lp,
    "primary-foreground": lpf,
    secondary: b["100"],
    "secondary-foreground": b["900"],
    muted: b["100"],
    "muted-foreground": b["500"],
    accent: b["100"],
    "accent-foreground": b["900"],
    destructive: "oklch(0.577 0.245 27.325)",
    border: b["200"],
    input: b["200"],
    ring: b["400"],
    ...charts,
    radius: c.radius,
    sidebar: b["50"],
    "sidebar-foreground": b["950"],
    "sidebar-primary": lp,
    "sidebar-primary-foreground": lpf,
    "sidebar-accent": b["100"],
    "sidebar-accent-foreground": b["900"],
    "sidebar-border": b["200"],
    "sidebar-ring": b["400"],
  }
  const dark = {
    background: b["950"],
    foreground: b["50"],
    card: b["900"],
    "card-foreground": b["50"],
    popover: b["900"],
    "popover-foreground": b["50"],
    primary: dp,
    "primary-foreground": dpf,
    secondary: b["800"],
    "secondary-foreground": b["50"],
    muted: b["800"],
    "muted-foreground": b["400"],
    accent: b["800"],
    "accent-foreground": b["50"],
    destructive: "oklch(0.704 0.191 22.216)",
    border: "oklch(1 0 0 / 10%)",
    input: "oklch(1 0 0 / 15%)",
    ring: b["500"],
    ...charts,
    sidebar: b["900"],
    "sidebar-foreground": b["50"],
    "sidebar-primary": t ? dp : "oklch(0.488 0.243 264.376)",
    "sidebar-primary-foreground": t ? dpf : b["50"],
    "sidebar-accent": b["800"],
    "sidebar-accent-foreground": b["50"],
    "sidebar-border": "oklch(1 0 0 / 10%)",
    "sidebar-ring": b["500"],
  }
  return { light, dark }
}

const block = (sel: string, vars: Record<string, string>) =>
  `${sel} {\n${Object.entries(vars)
    .map(([k, v]) => `  --${k}: ${v};`)
    .join("\n")}\n}`

export function ThemeBuilder({
  palette,
  fonts,
  tiles,
  sections,
}: {
  palette: Palette
  fonts: FontOption[]
  tiles: Tile[]
  sections: Section[]
}) {
  const params = useSearchParams()

  const colors = (names: string[]): Option[] =>
    names
      .filter((n) => palette[n])
      .map((n) => ({ value: n, label: cap(n), swatch: palette[n]["500"] }))
  const fontOptions = fonts.map((f) => ({
    value: f.name,
    label: f.name,
    family: f.family,
  }))
  const accentOptions = [
    { value: "base", label: "Base color" },
    ...colors(ACCENTS),
  ]
  const controls: { key: Key; label: string; options: Option[] }[] = [
    { key: "base", label: "Base color", options: colors(BASES) },
    { key: "theme", label: "Theme", options: accentOptions },
    { key: "chart", label: "Chart color", options: accentOptions },
    { key: "radius", label: "Radius", options: RADII },
    { key: "font", label: "Font", options: fontOptions },
    {
      key: "heading",
      label: "Heading",
      options: [{ value: "font", label: "Same as font" }, ...fontOptions],
    },
  ]

  const config = Object.fromEntries(
    controls.map(({ key, options }) => {
      const v = params.get(key)
      return [key, options.some((o) => o.value === v) ? v : DEFAULTS[key]]
    })
  ) as Config

  const set = (next: Partial<Config>) => {
    const q = new URLSearchParams()
    for (const [k, v] of Object.entries({ ...config, ...next }))
      if (v !== DEFAULTS[k as Key]) q.set(k, v)
    window.history.replaceState(
      null,
      "",
      q.size ? `?${q}` : window.location.pathname
    )
  }

  const { light, dark } = build(palette, config)
  const body = fonts.find((f) => f.name === config.font)?.family
  const heading =
    config.heading === "font"
      ? body
      : fonts.find((f) => f.name === config.heading)?.family

  const live = [
    block("html:root", light),
    block("html.dark", dark),
    `html:root, .font-sans { font-family: ${body}; }`,
    `.font-heading { font-family: ${heading}; }`,
  ].join("\n")
  useEffect(() => {
    const el = document.createElement("style")
    el.textContent = live
    document.head.append(el)
    return () => el.remove()
  }, [live])

  const fontVars = [
    config.font !== DEFAULTS.font &&
      `  --font-sans: var(--font-${kebab(config.font)});`,
    config.heading !== DEFAULTS.heading &&
      `  --font-heading: var(--font-${kebab(config.heading)});`,
  ].filter(Boolean)
  const code = [
    fontVars.length > 0 &&
      `/* Load the fonts with next/font/google, using these variable names. */\n@theme inline {\n${fontVars.join("\n")}\n}`,
    block(":root", light),
    block(".dark", dark),
  ]
    .filter(Boolean)
    .join("\n\n")

  return (
    <div className="flex min-h-svh flex-col lg:h-svh lg:overflow-hidden">
      <header className="flex h-14 shrink-0 items-center gap-3 border-b px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Logo className="size-6" />
          Kumiko
        </Link>
        <span aria-hidden className="text-muted-foreground">
          /
        </span>
        <h1 className="text-sm font-medium">Create a theme</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="hidden sm:inline-flex"
            nativeButton={false}
            render={<Link href="/components" />}
          >
            Docs
          </Button>
          <ModeToggle />
          <Dialog>
            <DialogTrigger render={<Button size="sm" />}>
              Get code
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Theme</DialogTitle>
                <DialogDescription>
                  Replace the :root and .dark blocks in app/globals.css with
                  this.
                </DialogDescription>
              </DialogHeader>
              <CodeBlock>
                <CodeBlockActions>
                  <CodeBlockCopyButton value={code} />
                </CodeBlockActions>
                <CodeBlockContent className="max-h-[60vh]">
                  {code}
                </CodeBlockContent>
              </CodeBlock>
            </DialogContent>
          </Dialog>
        </div>
      </header>
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <aside className="flex w-full shrink-0 flex-col gap-4 border-b p-4 lg:w-72 lg:overflow-y-auto lg:border-r lg:border-b-0">
          {controls.map(({ key, label, options }) => (
            <div key={key} className="flex flex-col gap-2">
              <span className="text-sm font-medium">{label}</span>
              <Select
                items={options}
                value={config[key]}
                onValueChange={(v) => v && set({ [key]: v })}
              >
                <SelectTrigger aria-label={label} className="w-full">
                  <SelectValue>
                    {(v: string) => (
                      <OptionLabel
                        option={options.find((o) => o.value === v)}
                      />
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {options.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      <OptionLabel option={o} />
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() =>
                set(
                  Object.fromEntries(
                    controls.map(({ key, options }) => [
                      key,
                      options[Math.floor(Math.random() * options.length)].value,
                    ])
                  )
                )
              }
            >
              <ShuffleIcon />
              Shuffle
            </Button>
            <Button
              variant="outline"
              size="icon"
              aria-label="Reset"
              onClick={() => set(DEFAULTS)}
            >
              <RotateCcwIcon />
            </Button>
          </div>
        </aside>
        <main className="@container relative flex min-w-0 flex-1 flex-col gap-10 p-4 md:p-6 lg:overflow-y-auto">
          {sections.map((s) => (
            <section key={s.id} aria-labelledby={`group-${s.id}`}>
              <h2
                id={`group-${s.id}`}
                className="mb-4 text-lg font-semibold tracking-tight"
              >
                {s.title}
              </h2>
              <div className="columns-1 gap-4 @3xl:columns-2 @6xl:columns-3">
                {tiles
                  .filter((t) => t.group === s.id)
                  .map((t) => (
                    <LazyTile key={t.slug} tile={t} />
                  ))}
              </div>
            </section>
          ))}
        </main>
      </div>
    </div>
  )
}

function ModeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
  const dark = mounted && resolvedTheme === "dark"
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      onClick={() => setTheme(dark ? "light" : "dark")}
    >
      {dark ? <SunIcon /> : <MoonIcon />}
    </Button>
  )
}

function OptionLabel({ option }: { option?: Option }) {
  if (!option) return null
  return (
    <span
      className="flex items-center gap-2"
      style={option.family ? { fontFamily: option.family } : undefined}
    >
      {option.swatch && (
        <span
          aria-hidden
          className="size-3 shrink-0 rounded-full"
          style={{ background: option.swatch }}
        />
      )}
      {option.label}
    </span>
  )
}

function scrollParent(el: HTMLElement) {
  for (let p = el.parentElement; p; p = p.parentElement)
    if (/auto|scroll/.test(getComputedStyle(p).overflowY)) return p
  return null
}

const MOUNT_MARGIN = 700
const PRELOAD_MARGIN = 2000

const mountQueue: (() => void)[] = []
let pumping = false
function pump() {
  const next = mountQueue.shift()
  if (!next) {
    pumping = false
    return
  }
  next()
  setTimeout(pump, 40)
}
function enqueueMount(fn: () => void) {
  mountQueue.push(fn)
  if (!pumping) {
    pumping = true
    pump()
  }
}

const LazyTile = memo(function LazyTile({ tile }: { tile: Tile }) {
  const ref = useRef<HTMLElement>(null)
  const [near, setNear] = useState(false)
  const [height, setHeight] = useState<number>()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let wanted = false
    const io = new IntersectionObserver(
      (entries) => {
        wanted = entries[entries.length - 1].isIntersecting
        if (wanted) {
          enqueueMount(() => wanted && startTransition(() => setNear(true)))
        } else if (el.hasAttribute("data-loaded")) {
          setHeight(el.offsetHeight)
          startTransition(() => setNear(false))
        }
      },
      { root: scrollParent(el), rootMargin: `${MOUNT_MARGIN}px 0px` }
    )
    io.observe(el)
    const pre = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        preloadDemo(tile.slug, "default")
        pre.disconnect()
      },
      { root: scrollParent(el), rootMargin: `${PRELOAD_MARGIN}px 0px` }
    )
    pre.observe(el)
    return () => {
      io.disconnect()
      pre.disconnect()
    }
  }, [tile.slug])

  return (
    <section
      ref={ref}
      data-tile={tile.slug}
      data-loaded={near || undefined}
      style={near ? undefined : { minHeight: height }}
      className="mb-4 flex break-inside-avoid flex-col gap-3 rounded-xl border bg-card/40 p-4 [contain-intrinsic-size:auto_10rem] [content-visibility:auto]"
    >
      <h3 className="text-sm font-medium">{tile.title}</h3>
      <div className="flex min-h-24 min-w-0 items-center justify-center overflow-auto">
        {near ? (
          <DemoRender slug={tile.slug} demo="default" />
        ) : (
          <Skeleton className="h-24 w-full animate-none" />
        )}
      </div>
    </section>
  )
})
