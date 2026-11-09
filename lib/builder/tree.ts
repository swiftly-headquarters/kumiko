// Page builder document model, shared by the editor, the canvas frame and the
// server-side catalog. No path aliases here: lib/builder/tree.check.mjs runs
// this file directly with node.

// A node is a component (m = module, n = export name), an HTML element
// (n = tag, no m) or a text run (t). Props are JSON values; a prop that holds
// JSX (for example `render={<Button />}`) is stored as { $jsx: Node }.
export type Node = {
  id: string
  n?: string
  m?: string
  p?: Props
  c?: Node[]
  t?: string
}
export type Props = Record<string, unknown>
export type Jsx = { $jsx: Node }

export const UI = "@/components/ui/"
export const ICONS = "lucide-react"
export const CHARTS = "recharts"
export const REGISTRY = "https://kumiko.swiftlylabs.net"

export const isJsx = (v: unknown): v is Jsx =>
  typeof v === "object" && v !== null && "$jsx" in v
const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v)

export const uid = () => Math.random().toString(36).slice(2, 10)

export const label = (n: Node) =>
  n.t !== undefined ? `"${n.t.slice(0, 24)}"` : (n.n ?? "?")

// Elements that cannot hold children. Components in LEAF render their own
// content; children dropped into them would be ignored.
// ponytail: hand list, extend when a component turns out to ignore children.
const VOID = new Set(
  "area br col embed hr img input link meta source track wbr textarea select".split(" ")
)
const LEAF = new Set(
  "Input Textarea Separator Slider Switch Checkbox Progress Skeleton Spinner Calendar RadioGroupItem InputOTPSlot WorldMap".split(
    " "
  )
)
export const canHold = (n: Node) =>
  n.t === undefined &&
  !(n.m ? n.m === ICONS || LEAF.has(n.n ?? "") : VOID.has(n.n ?? ""))

// Default target for click-to-add and canvas drops. A node with its own text
// (Button, CardTitle) gets new things beside it, not inside: a Card dropped on
// a Button would nest <button>s. Layers can still nest into anything canHold.
// Parts that only make sense around their own kind (a Card in a TabsList
// breaks the tab strip) also get new things beside them.
// ponytail: hand list, add a name when a canvas drop into it makes nonsense.
const STRICT = new Set(
  "TabsList TableHeader TableBody TableFooter TableRow RadioGroup ToggleGroup ButtonGroup BreadcrumbList PaginationContent NavigationMenuList Menubar".split(
    " "
  )
)
export const nests = (n: Node) =>
  canHold(n) && !n.c?.some((k) => k.t !== undefined) && !(n.m && STRICT.has(n.n ?? ""))

// --- Trust boundary: designs come from shared URLs. ---
// Plain elements come from an allowlist: no SVG/MathML (animate/set can write
// javascript: into href), no custom elements, no script-capable or form tags.
// ponytail: extend SAFE_TAGS when a demo or preset needs another plain tag.
const SAFE_TAGS = new Set(
  ("div span p section header footer main nav article aside h1 h2 h3 h4 h5 h6 " +
    "ul ol li a img strong em b i u s small mark code pre kbd blockquote figure " +
    "figcaption label br hr table thead tbody tfoot tr th td caption").split(" ")
)
export const isSafeTag = (tag: string) => SAFE_TAGS.has(tag)
export const isSafeProp = (key: string) =>
  !/^on|^dangerouslysetinnerhtml$|^srcdoc$|^ref$|^key$|^is$|^formaction$|^action$/i.test(key)
// Plain elements take only these props. Components take any documented prop
// (isSafeProp), since their props are too varied for one list.
export const isPlainProp = (key: string) =>
  /^(className|style|id|role|title|alt|src|href|target|rel|type|lang|dir|width|height|colSpan|rowSpan|aria-[\w-]+|data-[\w-]+)$/.test(
    key
  )
// Script schemes are dropped from every string, since a component may spread
// any prop onto a URL attribute. URL-valued props also need an allowed scheme
// (http, https, mailto, tel) or no scheme at all. Browsers ignore tabs,
// newlines and control characters inside the scheme.
const URL_PROPS = /^(href|src|srcset|poster|action|formaction|xlinkhref|cite|ping|to|from)$/i
export const isSafeValue = (v: unknown, key = "") => {
  if (typeof v !== "string") return true
  const s = v.replace(/[\u0000- ]/g, "")
  if (/^(javascript|vbscript):/i.test(s)) return false
  return !URL_PROPS.test(key) || /^(https?|mailto|tel):/i.test(s) || !/^[^/?#]*:/.test(s)
}
export const isSafeModule = (m: string) =>
  m === ICONS || m === CHARTS || new RegExp(`^${UI}[a-z0-9-]+$`).test(m)

function mapValue(v: unknown, f: (n: Node) => Node): unknown {
  if (isJsx(v)) return { $jsx: f(v.$jsx) }
  if (Array.isArray(v)) return v.map((x) => mapValue(x, f))
  if (isObject(v))
    return Object.fromEntries(
      Object.entries(v).map(([k, x]) => [k, mapValue(x, f)])
    )
  return v
}

// Deep copy with fresh ids (also inside JSX props).
export function clone(n: Node, id: () => string = uid): Node {
  const out: Node = { ...n, id: id() }
  if (n.p) out.p = mapValue(n.p, (x) => clone(x, id)) as Props
  if (n.c) out.c = n.c.map((k) => clone(k, id))
  return out
}

export function find(root: Node, id: string): Node | undefined {
  if (root.id === id) return root
  for (const k of root.c ?? []) {
    const hit = find(k, id)
    if (hit) return hit
  }
}

export function parentOf(root: Node, id: string): [Node, number] | undefined {
  const i = root.c?.findIndex((k) => k.id === id) ?? -1
  if (i >= 0) return [root, i]
  for (const k of root.c ?? []) {
    const hit = parentOf(k, id)
    if (hit) return hit
  }
}

function replace(root: Node, id: string, f: (n: Node) => Node): Node {
  if (root.id === id) return f(root)
  if (!root.c) return root
  let changed = false
  const c = root.c.map((k) => {
    const r = replace(k, id, f)
    if (r !== k) changed = true
    return r
  })
  return changed ? { ...root, c } : root
}

export const update = (root: Node, id: string, patch: Partial<Node>) =>
  replace(root, id, (n) => ({ ...n, ...patch }))

export function remove(root: Node, id: string): Node {
  const at = parentOf(root, id)
  if (!at) return root
  const [p, i] = at
  return replace(root, p.id, (n) => ({
    ...n,
    c: n.c!.filter((_, j) => j !== i),
  }))
}

export function insert(root: Node, parent: string, index: number, nodes: Node[]) {
  return replace(root, parent, (n) => {
    const c = [...(n.c ?? [])]
    c.splice(Math.max(0, Math.min(index, c.length)), 0, ...nodes)
    return { ...n, c }
  })
}

export function move(root: Node, id: string, parent: string, index: number) {
  const node = find(root, id)
  const at = parentOf(root, id)
  // Unknown node, the root itself, or a drop into its own subtree.
  if (!node || !at || find(node, parent)) return root
  if (at[0].id === parent && at[1] < index) index--
  return insert(remove(root, id), parent, index, [node])
}

export function duplicate(root: Node, id: string): [Node, string] {
  const node = find(root, id)
  const at = parentOf(root, id)
  if (!node || !at) return [root, id]
  const copy = clone(node)
  return [insert(root, at[0].id, at[1] + 1, [copy]), copy.id]
}

// --- URL encoding: deflate-raw + base64url, ids stripped. ---
const noId = () => undefined as unknown as string

async function pipe(bytes: Uint8Array, stream: CompressionStream | DecompressionStream) {
  const body = new Blob([bytes as BlobPart]).stream().pipeThrough(stream)
  return new Uint8Array(await new Response(body).arrayBuffer())
}

export async function encode(root: Node): Promise<string> {
  const json = JSON.stringify(clone(root, noId))
  const z = await pipe(new TextEncoder().encode(json), new CompressionStream("deflate-raw"))
  let s = ""
  for (const b of z) s += String.fromCharCode(b)
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

// Designs come from URLs and end up as rendered elements, generated source and
// a shell command, so decode() rejects anything that is not a known tag or
// module, a plain identifier, or a plain prop name. Every consumer gets a
// clean tree.
const IDENT = /^[A-Za-z_$][\w$]*$/
const PROP_KEY = /^[A-Za-z_$][\w$-]*$/

function validValue(v: unknown): boolean {
  if (isJsx(v)) return valid(v.$jsx)
  if (Array.isArray(v)) return v.every(validValue)
  if (isObject(v)) return Object.values(v).every(validValue)
  return true
}

export function valid(n: unknown): n is Node {
  if (!isObject(n)) return false
  if (typeof n.t === "string") return true
  if (typeof n.n !== "string") return false
  if (n.m === undefined ? !isSafeTag(n.n) : typeof n.m !== "string" || !isSafeModule(n.m) || !IDENT.test(n.n))
    return false
  if (n.p !== undefined) {
    if (!isObject(n.p)) return false
    for (const [k, v] of Object.entries(n.p)) if (!PROP_KEY.test(k) || !validValue(v)) return false
  }
  return n.c === undefined || (Array.isArray(n.c) && n.c.every(valid))
}

// "broken": not a design (cut short or mangled). "unsafe": a design that
// uses something the builder does not allow.
export type Decoded = { tree: Node } | { error: "broken" | "unsafe" }

export async function read(s: string): Promise<Decoded> {
  let root: unknown
  try {
    const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/"))
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0))
    const json = new TextDecoder().decode(
      await pipe(bytes, new DecompressionStream("deflate-raw"))
    )
    root = JSON.parse(json)
  } catch {
    return { error: "broken" }
  }
  return valid(root) ? { tree: clone(root) } : { error: isObject(root) ? "unsafe" : "broken" }
}

export const decode = async (s: string) => {
  const r = await read(s)
  return "tree" in r ? r.tree : null
}

export function slugs(root: Node): string[] {
  const out = new Set<string>()
  const walk = (n: Node) => {
    if (n.m && isSafeModule(n.m) && n.m.startsWith(UI)) out.add(n.m.slice(UI.length))
    mapValue(n.p, (x) => (walk(x), x))
    n.c?.forEach(walk)
  }
  walk(root)
  return [...out].sort()
}

export const installArgs = (root: Node, base: string) =>
  slugs(root)
    .map((s) => `${base}/r/${s}.json`)
    .join(" ")

const textOut = (t: string) =>
  /[{}<>]/.test(t) || t !== t.trim() || t === "" ? `{${JSON.stringify(t)}}` : t

// JS literal for a prop value. `ind` is the indentation of the current line.
function literal(v: unknown, ind: string): string {
  if (isJsx(v)) return jsx(v.$jsx, ind).trimStart()
  const inner = ind + "  "
  if (Array.isArray(v)) {
    if (!v.length) return "[]"
    if (v.every((x) => !isObject(x) && !Array.isArray(x)))
      return `[${v.map((x) => JSON.stringify(x)).join(", ")}]`
    return `[\n${v.map((x) => inner + literal(x, inner)).join(",\n")},\n${ind}]`
  }
  if (isObject(v)) {
    const keys = Object.entries(v).filter(([, x]) => x !== undefined)
    if (!keys.length) return "{}"
    return `{\n${keys
      .map(([k, x]) => `${inner}${IDENT.test(k) ? k : JSON.stringify(k)}: ${literal(x, inner)}`)
      .join(",\n")},\n${ind}}`
  }
  return JSON.stringify(v) ?? "undefined"
}

function attr(k: string, v: unknown, ind: string) {
  if (v === true) return k
  if (typeof v === "string")
    return /["\n]/.test(v) ? `${k}={${JSON.stringify(v)}}` : `${k}="${v}"`
  return `${k}={${literal(v, ind)}}`
}

function jsx(n: Node, ind: string): string {
  if (n.t !== undefined) return ind + textOut(n.t)
  const name = n.n!
  const props = Object.entries(n.p ?? {}).filter(
    ([k, v]) =>
      v !== undefined && isSafeProp(k) && (n.m || isPlainProp(k)) && isSafeValue(v, k)
  )
  const flat = props.map(([k, v]) => attr(k, v, ind))
  const oneLine = `<${name}${flat.map((a) => " " + a).join("")}`
  const split = ind.length + oneLine.length > 80 || flat.some((a) => a.includes("\n"))
  const open = split
    ? `<${name}\n${props.map(([k, v]) => ind + "  " + attr(k, v, ind + "  ")).join("\n")}\n${ind}`
    : oneLine
  const kids = n.c ?? []
  if (!kids.length) return `${ind}${open}${split ? "/>" : " />"}`
  if (kids.length === 1 && kids[0].t !== undefined && !split) {
    const one = `${ind}${open}>${textOut(kids[0].t)}</${name}>`
    if (one.length <= 80) return one
  }
  return `${ind}${open}>\n${kids.map((k) => jsx(k, ind + "  ")).join("\n")}\n${ind}</${name}>`
}

export function toCode(root: Node, name = "Page"): string {
  const imports = new Map<string, Set<string>>()
  const walk = (n: Node) => {
    if (n.m && n.n && isSafeModule(n.m) && IDENT.test(n.n)) {
      if (!imports.has(n.m)) imports.set(n.m, new Set())
      imports.get(n.m)!.add(n.n)
    }
    mapValue(n.p, (x) => (walk(x), x))
    n.c?.forEach(walk)
  }
  walk(root)
  // Packages first, then project aliases, like the docs examples.
  const lines = [...imports]
    .sort(([a], [b]) => Number(a.startsWith("@/")) - Number(b.startsWith("@/")) || a.localeCompare(b))
    .map(([m, names]) => {
      const list = [...names].sort()
      const one = `import { ${list.join(", ")} } from "${m}"`
      return one.length <= 80
        ? one
        : `import {\n${list.map((x) => `  ${x},`).join("\n")}\n} from "${m}"`
    })
  // Recharts components are client-only.
  const head = imports.has(CHARTS) ? `"use client"\n\n` : ""
  return `${head}${lines.join("\n")}${lines.length ? "\n\n" : ""}export default function ${name}() {\n  return (\n${jsx(root, "    ")}\n  )\n}\n`
}
