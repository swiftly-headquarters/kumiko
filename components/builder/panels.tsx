"use client"

import { useEffect, useState, type DragEvent, type ReactNode } from "react"
import {
  ArrowUpIcon,
  ChevronRightIcon,
  CopyIcon,
  PlusIcon,
  SearchIcon,
  Trash2Icon,
} from "lucide-react"

import { DRAG_TYPE, type DragData } from "@/components/builder/frame"
import { Button } from "@/components/ui/button"
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockLine,
} from "@/components/ui/code-block"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import type { Catalog, Entry, Field, Preset } from "@/lib/builder/catalog"
import { highlightCode } from "@/lib/highlighter"
import {
  ICONS,
  UI,
  canHold,
  installArgs,
  label,
  parentOf,
  toCode,
  uid,
  valid,
  REGISTRY,
  type Node,
  type Props,
} from "@/lib/builder/tree"
import { cn } from "@/lib/utils"


const startDrag = (e: DragEvent, data: DragData) => {
  e.dataTransfer.setData(DRAG_TYPE, JSON.stringify(data))
  e.dataTransfer.effectAllowed = data.kind === "new" ? "copy" : "move"
}

// Plain HTML with Tailwind classes, for page structure. Nothing to install.
const el = (n: string, className: string, text?: string): Node => ({
  id: "",
  n,
  p: { className },
  ...(text ? { c: [{ id: "", t: text }] } : {}),
})
const LAYOUT_PRESETS: Preset[] = [
  { title: "Stack", nodes: [el("div", "flex flex-col gap-4")] },
  { title: "Row", nodes: [el("div", "flex flex-wrap items-center gap-4")] },
  { title: "Grid", nodes: [el("div", "grid gap-4 sm:grid-cols-2 lg:grid-cols-3")] },
  { title: "Section", nodes: [el("section", "mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-12")] },
  { title: "Heading", nodes: [el("h2", "text-2xl font-semibold tracking-tight", "Heading")] },
  { title: "Paragraph", nodes: [el("p", "text-muted-foreground", "Some text.")] },
]
const LAYOUT: Entry = {
  slug: "layout",
  title: "Layout",
  group: "layout",
  description: "Plain HTML elements with Tailwind classes.",
  parts: [],
  presets: LAYOUT_PRESETS.map((p) => p.title),
}

// Library presets load per component, once, when a row is hovered or opened.
const pending = new Map<string, Promise<Preset[]>>()
const loaded = new Map<string, Preset[]>()
function loadPresets(slug: string) {
  let p = pending.get(slug)
  if (!p) {
    p = fetch(`/builder/presets/${slug}`)
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status))
        return r.json() as Promise<Preset[]>
      })
      .then((list) => (loaded.set(slug, list), list))
    p.catch(() => pending.delete(slug)) // retry on the next open
    pending.set(slug, p)
  }
  return p
}
const presetsIn = (slug: string) => (slug === LAYOUT.slug ? LAYOUT_PRESETS : loaded.get(slug))

function PresetList({ entry, onAdd }: { entry: Entry; onAdd: (nodes: Node[]) => void }) {
  const [list, setList] = useState<Preset[] | "error" | undefined>(() => presetsIn(entry.slug))
  useEffect(() => {
    if (!list) loadPresets(entry.slug).then(setList, () => setList("error"))
  }, [entry.slug, list])

  if (list === "error")
    return <p className="px-2 py-1 text-sm text-destructive">Could not load. Close and open to retry.</p>
  if (!list) return <p className="px-2 py-1 text-sm text-muted-foreground">Loading…</p>
  return (
    <ul>
      {list.map((p, i) => (
        <li key={i} className="group flex items-center">
          <span
            draggable
            onDragStart={(ev) => startDrag(ev, { kind: "new", nodes: p.nodes })}
            className="flex-1 cursor-grab truncate rounded-md px-2 py-1 text-sm text-muted-foreground hover:bg-accent hover:text-foreground active:cursor-grabbing"
          >
            {p.title}
          </span>
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label={`Add ${entry.title}: ${p.title}`}
            onClick={() => onAdd(p.nodes)}
          >
            <PlusIcon />
          </Button>
        </li>
      ))}
    </ul>
  )
}

export function Palette({
  catalog,
  onAdd,
}: {
  catalog: Catalog
  onAdd: (nodes: Node[]) => void
}) {
  const [q, setQ] = useState("")
  const [open, setOpen] = useState<string | null>(null)
  const query = q.trim().toLowerCase()
  const entries = [LAYOUT, ...catalog.entries].filter(
    (e) => !query || e.title.toLowerCase().includes(query) || e.slug.includes(query)
  )
  const groups = [{ id: "layout", title: "Layout" }, ...catalog.groups]

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="relative p-3">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-5.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search components"
          aria-label="Search components"
          className="pl-8"
        />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-6">
        {groups.map((g) => {
          const list = entries.filter((e) => e.group === g.id)
          if (!list.length) return null
          return (
            <section key={g.id} className="mb-4">
              <h3 className="px-2 pb-1 text-xs font-medium text-muted-foreground">
                {g.title}
              </h3>
              {list.map((e) => {
                const expanded = open === e.slug || (!!query && list.length === 1)
                return (
                  <div key={e.slug}>
                    <button
                      type="button"
                      draggable
                      onDragStart={(ev) => {
                        // Dragging needs the nodes now; hovering has started the load.
                        const first = presetsIn(e.slug)?.[0]
                        if (first) startDrag(ev, { kind: "new", nodes: first.nodes })
                        else ev.preventDefault()
                      }}
                      onPointerEnter={() => e.slug !== LAYOUT.slug && loadPresets(e.slug).catch(() => {})}
                      onFocus={() => e.slug !== LAYOUT.slug && loadPresets(e.slug).catch(() => {})}
                      onClick={() => setOpen(expanded ? null : e.slug)}
                      aria-expanded={expanded}
                      title={e.description}
                      className="flex w-full cursor-grab items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-sm hover:bg-accent active:cursor-grabbing"
                    >
                      <ChevronRightIcon
                        className={cn("size-3.5 shrink-0 text-muted-foreground transition-transform", expanded && "rotate-90")}
                      />
                      <span className="truncate">{e.title}</span>
                      <span className="ml-auto text-xs text-muted-foreground tabular-nums">
                        {e.presets.length}
                      </span>
                    </button>
                    {expanded && (
                      <div className="mb-1 ml-4 border-l pl-2">
                        <PresetList entry={e} onAdd={onAdd} />
                      </div>
                    )}
                  </div>
                )
              })}
            </section>
          )
        })}
        {!entries.length && (
          <p className="px-2 py-6 text-center text-sm text-muted-foreground">
            No component matches “{q}”.
          </p>
        )}
      </div>
    </div>
  )
}

type Zone = "before" | "after" | "inside"

export function Layers({
  tree,
  selected,
  onSelect,
  onMove,
}: {
  tree: Node
  selected: string
  onSelect: (id: string) => void
  onMove: (data: DragData, parent: string, index: number) => void
}) {
  const [hint, setHint] = useState<{ id: string; zone: Zone } | null>(null)

  const zoneOf = (e: DragEvent, n: Node): Zone => {
    if (n.id === tree.id) return "inside"
    const r = e.currentTarget.getBoundingClientRect()
    const y = (e.clientY - r.top) / r.height
    if (canHold(n)) return y < 0.25 ? "before" : y > 0.75 ? "after" : "inside"
    return y < 0.5 ? "before" : "after"
  }

  const row = (n: Node, depth: number): React.ReactNode => {
    const z = hint?.id === n.id ? hint.zone : null
    return (
      <li key={n.id}>
        <button
          type="button"
          draggable={n.id !== tree.id}
          onDragStart={(e) => {
            e.stopPropagation()
            startDrag(e, { kind: "move", id: n.id })
          }}
          onDragOver={(e) => {
            if (!e.dataTransfer.types.includes(DRAG_TYPE)) return
            e.preventDefault()
            setHint({ id: n.id, zone: zoneOf(e, n) })
          }}
          onDragLeave={() => setHint(null)}
          onDrop={(e) => {
            const raw = e.dataTransfer.getData(DRAG_TYPE)
            setHint(null)
            if (!raw) return
            e.preventDefault()
            let data: DragData
            try {
              data = JSON.parse(raw)
            } catch {
              return
            }
            const zone = zoneOf(e, n)
            const at = parentOf(tree, n.id)
            if (zone === "inside" || !at) onMove(data, n.id, n.c?.length ?? 0)
            else onMove(data, at[0].id, at[1] + (zone === "after" ? 1 : 0))
          }}
          onClick={() => onSelect(n.id)}
          aria-current={selected === n.id || undefined}
          style={{ paddingLeft: 8 + depth * 12 }}
          className={cn(
            "flex w-full items-center gap-1.5 truncate rounded-md border-y-2 border-transparent py-1 pr-2 text-left text-sm hover:bg-accent",
            selected === n.id && "bg-accent font-medium",
            n.t !== undefined && "text-muted-foreground",
            z === "before" && "border-t-primary",
            z === "after" && "border-b-primary",
            z === "inside" && "bg-primary/10"
          )}
        >
          <span className="truncate">{n.m ? n.n : n.t !== undefined ? label(n) : `<${n.n}>`}</span>
        </button>
        {!!n.c?.length && <ul>{n.c.map((k) => row(k, depth + 1))}</ul>}
      </li>
    )
  }

  return (
    <div className="min-h-0 flex-1 overflow-y-auto p-3">
      <ul onDragEnd={() => setHint(null)}>{row(tree, 0)}</ul>
      <p className="px-2 pt-4 text-xs text-muted-foreground">
        Drag rows to reorder. Drop on the middle of a container to nest.
      </p>
    </div>
  )
}

const parse = (raw?: string) => {
  if (raw === undefined) return undefined
  try {
    return JSON.parse(raw)
  } catch {
    return raw
  }
}
const DEFAULT = "__default"

export function Inspector({
  node,
  root,
  entry,
  onChange,
  onSelect,
  onDuplicate,
  onRemove,
}: {
  node: Node
  root: Node
  entry?: Entry
  onChange: (patch: Partial<Node>, key: string) => void
  onSelect: (id: string) => void
  onDuplicate: () => void
  onRemove: () => void
}) {
  const p = node.p ?? {}
  const part = entry?.parts.find((x) => x.name === node.n)
  const parent = parentOf(root, node.id)?.[0]
  const isRoot = node.id === root.id

  const setProps = (next: Props, key: string) => {
    const clean = Object.fromEntries(Object.entries(next).filter(([, v]) => v !== undefined))
    onChange({ p: Object.keys(clean).length ? clean : undefined }, key)
  }
  // Setting a prop to its documented default removes it from the code.
  const setField = (f: Field, v: unknown) =>
    setProps(
      { ...p, [f.name]: f.def !== undefined && JSON.stringify(v) === JSON.stringify(parse(f.def)) ? undefined : v },
      `${node.id}:${f.name}`
    )
  const setKid = (i: number, t: string) =>
    onChange({ c: node.c!.map((k, j) => (j === i ? { ...k, t } : k)) }, `${node.id}:text${i}`)

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-center gap-1 border-b p-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">
            {node.t !== undefined ? "Text" : node.m ? node.n : `<${node.n}>`}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {node.m ?? (isRoot ? "Page root" : "HTML element")}
          </p>
        </div>
        <Button variant="ghost" size="icon-sm" aria-label="Select parent" title="Select parent (Esc)" disabled={!parent} onClick={() => parent && onSelect(parent.id)}>
          <ArrowUpIcon />
        </Button>
        <Button variant="ghost" size="icon-sm" aria-label="Duplicate" title="Duplicate (Ctrl+D)" disabled={isRoot} onClick={onDuplicate}>
          <CopyIcon />
        </Button>
        <Button variant="ghost" size="icon-sm" aria-label="Delete" title="Delete (Del)" disabled={isRoot} onClick={onRemove}>
          <Trash2Icon />
        </Button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-3 pb-8">
        {node.t !== undefined && (
          <Row label="Text" id="t">
            <Textarea id="t" value={node.t} onChange={(e) => onChange({ t: e.target.value }, `${node.id}:t`)} />
          </Row>
        )}

        {node.m === ICONS && (
          <Row label="Icon" id="icon" hint="A lucide-react export, for example StarIcon.">
            <Input id="icon" value={node.n} onChange={(e) => onChange({ n: e.target.value }, `${node.id}:icon`)} />
          </Row>
        )}

        {part?.fields
          .filter((f) => f.kind !== "json")
          .map((f) => (
            <FieldInput key={f.name} field={f} value={p[f.name]} onChange={(v) => setField(f, v)} />
          ))}

        {node.t === undefined && (
          <Row label="className" id="cls" hint="Tailwind classes.">
            <Textarea
              id="cls"
              value={typeof p.className === "string" ? p.className : ""}
              onChange={(e) => setProps({ ...p, className: e.target.value || undefined }, `${node.id}:className`)}
              className="min-h-16 font-mono text-xs"
              spellCheck={false}
            />
          </Row>
        )}

        {node.c?.map((k, i) =>
          k.t === undefined ? null : (
            <Row key={k.id} label="Text content" id={`k${i}`}>
              <Textarea id={`k${i}`} value={k.t} onChange={(e) => setKid(i, e.target.value)} />
            </Row>
          )
        )}
        {canHold(node) && !node.c?.some((k) => k.t !== undefined) && (
          <Button
            variant="outline"
            size="sm"
            className="self-start"
            onClick={() => onChange({ c: [...(node.c ?? []), { id: uid(), t: "Text" }] }, `${node.id}:addtext`)}
          >
            <PlusIcon />
            Add text
          </Button>
        )}

        {node.t === undefined && (
          <JsonProps
            key={`${node.id}:${JSON.stringify(p)}`}
            value={p}
            onApply={(v) => setProps(v, `${node.id}:json`)}
          />
        )}
      </div>
    </div>
  )
}

function Row({ label, id, hint, children }: { label: string; id: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

function FieldInput({ field: f, value, onChange }: { field: Field; value: unknown; onChange: (v: unknown) => void }) {
  const id = `f-${f.name}`
  if (f.kind === "boolean")
    return (
      <div className="flex items-center justify-between gap-3" title={f.description}>
        <Label htmlFor={id} className="font-mono text-xs">{f.name}</Label>
        <Switch id={id} checked={value === undefined ? f.def === "true" : !!value} onCheckedChange={(c) => onChange(c)} />
      </div>
    )
  if (f.kind === "select") {
    const items = [
      { value: DEFAULT, label: f.def ? `Default (${String(parse(f.def))})` : "Default" },
      ...f.options!.map((o) => ({ value: o, label: String(parse(o)) })),
    ]
    return (
      <Row label={f.name} id={id}>
        <Select
          items={items}
          value={value === undefined ? DEFAULT : JSON.stringify(value)}
          onValueChange={(v) => onChange(v === DEFAULT || v === null ? undefined : parse(v))}
        >
          <SelectTrigger id={id} className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {items.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Row>
    )
  }
  return (
    <Row label={f.name} id={id}>
      <Input
        id={id}
        type={f.kind === "number" ? "number" : "text"}
        value={value === undefined || typeof value === "object" ? "" : String(value)}
        placeholder={f.def ? String(parse(f.def)) : undefined}
        title={f.description}
        onChange={(e) =>
          onChange(e.target.value === "" ? undefined : f.kind === "number" ? Number(e.target.value) : e.target.value)
        }
      />
    </Row>
  )
}

// Every prop as JSON: the escape hatch for values the fields above don't cover.
function JsonProps({ value, onApply }: { value: Props; onApply: (v: Props) => void }) {
  const initial = JSON.stringify(value, null, 2)
  const [draft, setDraft] = useState(initial)
  const [error, setError] = useState<string | null>(null)
  return (
    <Row label="All props (JSON)" id="json" hint={error ?? "Applied when the field loses focus. Event handlers are not allowed."}>
      <Textarea
        id="json"
        value={draft}
        spellCheck={false}
        aria-invalid={!!error || undefined}
        className="min-h-28 font-mono text-xs"
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => {
          if (draft === initial) return
          try {
            const v: unknown = JSON.parse(draft || "{}")
            if (!v || typeof v !== "object" || Array.isArray(v)) throw new Error("Props must be a JSON object.")
            if (!valid({ n: "div", p: v })) throw new Error("Prop names must be plain identifiers.")
            setError(null)
            onApply(v as Props)
          } catch (e) {
            setError((e as Error).message)
          }
        }}
      />
    </Row>
  )
}

const runners = { npm: "npx", pnpm: "pnpm dlx", yarn: "yarn dlx", bun: "bunx --bun" }

// Client-side shiki: plain text until the grammar loads, then highlighted lines.
export function Highlighted({ code, lang }: { code: string; lang: string }) {
  const [out, setOut] = useState<{ code: string; lines: ReactNode[] } | null>(null)
  useEffect(() => {
    let live = true
    highlightCode(code, lang).then((lines) => live && lines && setOut({ code, lines }))
    return () => {
      live = false
    }
  }, [code, lang])
  return out?.code === code
    ? out.lines.map((line, i) => <CodeBlockLine key={i}>{line}</CodeBlockLine>)
    : code
}

export function Output({ tree }: { tree: Node }) {
  const args = installArgs(tree, REGISTRY)
  const code = toCode(tree)
  return (
    <div className="flex min-w-0 flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-medium">1. Install the components</h3>
        {args ? (
          <Tabs defaultValue="npm" className="gap-0 overflow-hidden rounded-xl border bg-muted/40">
            <TabsList variant="line" className="h-10 w-full justify-start border-b px-2">
              {Object.keys(runners).map((pm) => (
                <TabsTrigger key={pm} value={pm} className="flex-none px-3">
                  {pm}
                </TabsTrigger>
              ))}
            </TabsList>
            {Object.entries(runners).map(([pm, run]) => {
              const cmd = `${run} shadcn@latest add ${args}`
              return (
                <TabsContent key={pm} value={pm}>
                  <CodeBlock className="rounded-none border-0 bg-transparent">
                    <CodeBlockActions>
                      <CodeBlockCopyButton value={cmd} aria-label="Copy install command" />
                    </CodeBlockActions>
                    <CodeBlockContent wrap className="mr-10">
                      <Highlighted code={cmd} lang="bash" />
                    </CodeBlockContent>
                  </CodeBlock>
                </TabsContent>
              )
            })}
          </Tabs>
        ) : (
          <p className="text-sm text-muted-foreground">
            Nothing to install yet. Add a component from the library.
          </p>
        )}
      </div>
      <div className="flex min-w-0 flex-col gap-2">
        <h3 className="text-sm font-medium">2. Add the page</h3>
        <CodeBlock>
          <CodeBlockActions>
            <CodeBlockCopyButton value={code} aria-label="Copy code" />
          </CodeBlockActions>
          <CodeBlockContent className="mr-10 max-h-[50vh]">
            <Highlighted code={code} lang="tsx" />
          </CodeBlockContent>
        </CodeBlock>
      </div>
    </div>
  )
}

export const entryOf = (catalog: Catalog, n: Node) =>
  n.m?.startsWith(UI) ? catalog.entries.find((e) => e.slug === n.m!.slice(UI.length)) : undefined
