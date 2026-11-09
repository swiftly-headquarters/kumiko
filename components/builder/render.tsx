"use client"

import {
  Component,
  createElement,
  Suspense,
  use,
  type ComponentType,
  type ReactNode,
} from "react"

import {
  CHARTS,
  ICONS,
  UI,
  isJsx,
  isPlainProp,
  isSafeModule,
  isSafeProp,
  isSafeTag,
  isSafeValue,
  type Node,
} from "@/lib/builder/tree"

type Mod = Record<string, unknown>
const pending = new Map<string, Promise<Mod>>()
const loaded = new Map<string, Mod>()

function load(m: string): Promise<Mod> {
  let p = pending.get(m)
  if (!p) {
    p = (
      m === ICONS
        ? import("lucide-react").then((x) => x.icons as Mod)
        : m === CHARTS
          ? import("recharts")
          : isSafeModule(m)
            ? import(`@/components/ui/${m.slice(UI.length)}`)
            : Promise.reject(new Error(`Unknown module ${m}`))
    ).then((mod: Mod) => (loaded.set(m, mod), mod))
    pending.set(m, p)
  }
  return p
}

function pick(m: string, mod: Mod, name: string) {
  const C = mod[name] ?? (m === ICONS ? mod[name.replace(/^Lucide|Icon$/g, "")] : undefined)
  if (!C) throw new Error(`${name} is not exported by ${m}`)
  return C as ComponentType<Record<string, unknown>>
}

const CONTROLLED = ["open", "value", "checked", "pressed"]
const VOID_TAGS =/^(area|br|col|hr|img|input|source|track|wbr)$/i

function jsxModules(v: unknown, out: Set<string>) {
  if (isJsx(v)) {
    if (v.$jsx.m) out.add(v.$jsx.m)
    for (const x of Object.values(v.$jsx.p ?? {})) jsxModules(x, out)
    v.$jsx.c?.forEach((k) => jsxModules({ $jsx: k }, out))
  } else if (Array.isArray(v)) v.forEach((x) => jsxModules(x, out))
  else if (v && typeof v === "object") Object.values(v).forEach((x) => jsxModules(x, out))
}

function element(n: Node, key?: string): ReactNode {
  if (n.t !== undefined) return n.t
  if (!n.n) return null
  if (!n.m && !isSafeTag(n.n)) return null
  const C = n.m ? pick(n.m, loaded.get(n.m)!, n.n) : n.n
  const kids = VOID_TAGS.test(n.n) ? [] : (n.c ?? []).map((k, i) => element(k, String(i)))
  return createElement(C, { ...hydrate(n.p, !n.m), key }, ...kids)
}

function hydrate(p: Node["p"], plain: boolean): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  const value = (v: unknown, key: string): unknown =>
    isJsx(v)
      ? element(v.$jsx)
      : Array.isArray(v)
        ? v.map((x) => value(x, key))
        : v && typeof v === "object"
          ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, value(x, k)]))
          : isSafeValue(v, key)
            ? v
            : undefined
  for (const [k, v] of Object.entries(p ?? {}))
    if (isSafeProp(k) && (!plain || isPlainProp(k))) out[k] = value(v, k)
  return out
}

class Guard extends Component<
  { node: Node; edit: boolean; children: ReactNode },
  { error: Error | null; node: Node | null }
> {
  state = { error: null as Error | null, node: null as Node | null }
  static getDerivedStateFromError(error: Error) {
    return { error }
  }
  static getDerivedStateFromProps(props: { node: Node }, state: { node: Node | null }) {
    return props.node !== state.node ? { error: null, node: props.node } : null
  }
  render() {
    const { error } = this.state
    if (!error) return this.props.children
    if (!this.props.edit) return null
    return (
      <span
        data-node-id={this.props.node.id}
        role="alert"
        className="inline-flex max-w-full rounded-md border border-dashed border-destructive/60 bg-destructive/10 px-2 py-1 text-xs text-destructive"
      >
        {this.props.node.n}: {error.message.split("\n")[0]}
      </span>
    )
  }
}

function NodeView({ node, edit }: { node: Node; edit: boolean }) {
  const mods = new Set<string>()
  if (node.m) mods.add(node.m)
  for (const v of Object.values(node.p ?? {})) jsxModules(v, mods)
  for (const m of mods) use(load(m))

  const name = node.n ?? ""
  if (!node.m && !isSafeTag(name)) return null
  const C = node.m ? pick(node.m, loaded.get(node.m)!, name) : name
  const props = hydrate(node.p, !node.m)
  if (edit) props["data-node-id"] = node.id
  if (node.m) {
    const controlled = CONTROLLED.filter((k) => k in props)
    if (controlled.length) props.key = controlled.join()
  }
  const kids =
    !node.m && VOID_TAGS.test(name)
      ? []
      : (node.c ?? []).map((k) =>
          k.t !== undefined ? k.t : <Tree key={k.id} node={k} edit={edit} />
        )
  return createElement(C, props, ...kids)
}

export function Tree({ node, edit }: { node: Node; edit: boolean }) {
  return (
    <Guard node={node} edit={edit}>
      <Suspense fallback={null}>
        <NodeView node={node} edit={edit} />
      </Suspense>
    </Guard>
  )
}
