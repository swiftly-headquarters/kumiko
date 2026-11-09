"use client"

import { useCallback, useEffect, useRef, useState, type ReactElement } from "react"
import Link from "next/link"
import {
  BlocksIcon,
  CheckIcon,
  CodeIcon,
  ExternalLinkIcon,
  FullscreenIcon,
  LaptopIcon,
  LayersIcon,
  LinkIcon,
  MonitorIcon,
  MoveHorizontalIcon,
  Redo2Icon,
  RulerIcon,
  SmartphoneIcon,
  TabletIcon,
  TriangleAlertIcon,
  Undo2Icon,
} from "lucide-react"

import type { DragData, FromFrame, ToFrame } from "@/components/builder/frame"
import { Inspector, Layers, Output, Palette, entryOf } from "@/components/builder/panels"
import { Logo } from "@/components/docs/logo"
import { ModeToggle } from "@/components/docs/theme-builder"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Kbd } from "@/components/ui/kbd"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import type { Catalog } from "@/lib/builder/catalog"
import {
  canHold,
  clone,
  decode,
  duplicate,
  encode,
  find,
  insert,
  move,
  nests,
  parentOf,
  remove,
  uid,
  update,
  valid,
  type Node,
} from "@/lib/builder/tree"

const VIEWPORTS = [
  { id: "fluid", label: "Fit canvas", width: 0, Icon: MoveHorizontalIcon },
  { id: "mobile", label: "Mobile", width: 375, Icon: SmartphoneIcon },
  { id: "tablet", label: "Tablet", width: 768, Icon: TabletIcon },
  { id: "laptop", label: "Laptop", width: 1280, Icon: LaptopIcon },
  { id: "desktop", label: "Desktop", width: 1440, Icon: MonitorIcon },
  { id: "custom", label: "Custom width", width: -1, Icon: RulerIcon },
] as const
const PAD = 24
const LONG_LINK = 1900
const PANEL = "flex min-h-0 w-64 flex-col *:flex *:min-h-0 *:flex-1 *:flex-col"

function Tip({
  label,
  keys,
  side = "bottom",
  children,
}: {
  label: string
  keys?: string[]
  side?: "top" | "bottom" | "left" | "right"
  children: ReactElement
}) {
  return (
    <Tooltip>
      <TooltipTrigger render={children} />
      <TooltipContent side={side}>
        {label}
        {keys?.map((k) => <Kbd key={k}>{k}</Kbd>)}
      </TooltipContent>
    </Tooltip>
  )
}

const blank = (): Node => ({
  id: uid(),
  n: "div",
  p: { className: "flex min-h-svh flex-col gap-6 p-6" },
})

type History = { tree: Node; past: Node[]; future: Node[] }

export function Builder({ catalog }: { catalog: Catalog }) {
  const [h, setH] = useState<History>(() => ({ tree: blank(), past: [], future: [] }))
  const [picked, setPicked] = useState<string | null>(null)
  const [tab, setTab] = useState("components")
  const [vp, setVp] = useState<string>("fluid")
  const [custom, setCustom] = useState(1024)
  const [preview, setPreview] = useState(false)
  const [hash, setHash] = useState<string | null>(null)
  const [stage, setStage] = useState({ w: 0, h: 0 })
  const [full, setFull] = useState(false)
  const [codeOpen, setCodeOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const frame = useRef<HTMLIFrameElement>(null)
  const canvas = useRef<HTMLDivElement>(null)
  const last = useRef<{ key?: string; at: number }>({ at: 0 })

  const tree = h.tree
  // Chat apps cut links at about 2000 characters, and the whole design is in the link.
  const long = (hash?.length ?? 0) > LONG_LINK
  const selected = picked && find(tree, picked) ? picked : tree.id
  const node = find(tree, selected)!

  // Edits with the same key within a second (typing in one field) are one undo step.
  const commit = useCallback((f: (t: Node) => Node, key?: string) => {
    const now = Date.now()
    const merge = key !== undefined && last.current.key === key && now - last.current.at < 1000
    last.current = { key, at: now }
    setH((s) => {
      const next = f(s.tree)
      if (next === s.tree) return s
      return merge
        ? { ...s, tree: next, future: [] }
        : { tree: next, past: [...s.past, s.tree].slice(-100), future: [] }
    })
  }, [])
  const undo = () => {
    last.current = { at: 0 }
    setH((s) => (s.past.length ? { tree: s.past.at(-1)!, past: s.past.slice(0, -1), future: [s.tree, ...s.future] } : s))
  }
  const redo = () => {
    last.current = { at: 0 }
    setH((s) => (s.future.length ? { tree: s.future[0], past: [...s.past, s.tree], future: s.future.slice(1) } : s))
  }

  const place = (data: DragData, parent: string, index: number) => {
    if (data?.kind === "move") {
      if (typeof data.id !== "string") return
      commit((t) => move(t, data.id, parent, index))
      setPicked(data.id)
      return
    }
    if (data?.kind !== "new" || !Array.isArray(data.nodes) || !data.nodes.length || !data.nodes.every(valid)) return
    const target = find(tree, parent)
    if (!target || !canHold(target)) return
    const nodes = data.nodes.map((n) => clone(n))
    commit((t) => insert(t, parent, index, nodes))
    setPicked(nodes[0].id)
  }
  const add = (nodes: Node[]) => {
    const at = parentOf(tree, node.id)
    if (!at || (!node.m && nests(node))) place({ kind: "new", nodes }, node.id, node.c?.length ?? 0)
    else place({ kind: "new", nodes }, at[0].id, at[1] + 1)
  }
  const removeSelected = () => {
    const at = parentOf(tree, node.id)
    if (!at) return
    commit((t) => remove(t, node.id))
    setPicked(at[0].c?.[at[1] + 1]?.id ?? at[0].id)
  }
  const duplicateSelected = () => {
    if (node.id === tree.id) return
    const [next, id] = duplicate(tree, node.id)
    commit(() => next)
    setPicked(id)
  }

  const shortcut = (key: string, mod: boolean, shift: boolean) => {
    const k = key.toLowerCase()
    if (mod && k === "z") (shift ? redo : undo)()
    else if (mod && k === "y") redo()
    else if (mod && k === "d") duplicateSelected()
    else if (!mod && (key === "Delete" || key === "Backspace")) removeSelected()
    else if (key === "Escape") setPicked(parentOf(tree, node.id)?.[0].id ?? tree.id)
    else return false
    return true
  }
  const shortcutRef = useRef(shortcut)
  const placeRef = useRef(place)
  useEffect(() => {
    shortcutRef.current = shortcut
    placeRef.current = place
  })

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      if (t.closest?.("input, textarea, select, [contenteditable], [role=dialog], [role=listbox], [role=menu]")) return
      if (shortcutRef.current(e.key, e.ctrlKey || e.metaKey, e.shiftKey)) e.preventDefault()
    }
    const onMessage = (e: MessageEvent<FromFrame>) => {
      if (e.origin !== location.origin || e.source !== frame.current?.contentWindow) return
      const m = e.data
      if (m.type === "ready") setH((s) => ({ ...s })) // re-send state to the new frame
      else if (m.type === "select") setPicked(m.id)
      else if (m.type === "drop") placeRef.current(m.data, m.parent, m.index)
      else if (m.type === "key") shortcutRef.current(m.key, m.mod, m.shift)
    }
    const onFull = () => setFull(document.fullscreenElement === canvas.current)
    window.addEventListener("keydown", onKey)
    window.addEventListener("message", onMessage)
    document.addEventListener("fullscreenchange", onFull)
    return () => {
      window.removeEventListener("keydown", onKey)
      window.removeEventListener("message", onMessage)
      document.removeEventListener("fullscreenchange", onFull)
    }
  }, [])

  useEffect(() => {
    const msg: ToFrame = { type: "state", tree, selected, edit: !preview }
    frame.current?.contentWindow?.postMessage(msg, location.origin)
  }, [h, tree, selected, preview])

  // The design lives in the URL hash: read once, write on change.
  // `loaded` is state, not a ref: a blank page needs a hash too, for Copy link and Open page.
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    decode(location.hash.slice(1)).then((t) => {
      if (t) setH({ tree: t, past: [], future: [] })
      setLoaded(true)
    })
  }, [])
  useEffect(() => {
    if (!loaded) return
    const id = setTimeout(
      () =>
        encode(tree).then((s) => {
          setHash(s)
          window.history.replaceState(null, "", `#${s}`)
        }),
      250
    )
    return () => clearTimeout(id)
  }, [tree, loaded])

  useEffect(() => {
    const el = canvas.current!
    const ro = new ResizeObserver(([e]) =>
      setStage({ w: e.contentRect.width, h: e.contentRect.height })
    )
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const preset = VIEWPORTS.find((v) => v.id === vp)!
  const fluid = preset.width === 0
  const width = fluid ? stage.w : preset.width < 0 ? custom : preset.width
  const pad = fluid ? 0 : PAD
  const scale = fluid || !stage.w ? 1 : Math.min(1, (stage.w - pad * 2) / width)
  const height = (stage.h - pad * 2) / scale

  return (
    <div className="flex h-svh flex-col overflow-hidden">
      <header className="flex h-14 shrink-0 items-center gap-2 border-b px-3">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Logo className="size-6" />
          <span className="max-sm:hidden">Kumiko</span>
        </Link>
        <span aria-hidden className="text-muted-foreground">/</span>
        <h1 className="text-sm font-medium">Builder</h1>

        <div className="ml-4 flex items-center gap-1 max-md:hidden">
          <Tip label="Undo" keys={["Ctrl", "Z"]}>
            <Button variant="ghost" size="icon-sm" aria-label="Undo" disabled={!h.past.length} onClick={undo}>
              <Undo2Icon />
            </Button>
          </Tip>
          <Tip label="Redo" keys={["Ctrl", "Shift", "Z"]}>
            <Button variant="ghost" size="icon-sm" aria-label="Redo" disabled={!h.future.length} onClick={redo}>
              <Redo2Icon />
            </Button>
          </Tip>
        </div>

        <div className="mx-auto flex items-center gap-2">
          <ToggleGroup
            variant="outline"
            size="sm"
            value={[vp]}
            onValueChange={(v) => v[0] && setVp(v[0])}
            aria-label="Viewport"
          >
            {VIEWPORTS.map(({ id, label, width, Icon }) => (
              <Tip key={id} label={width > 0 ? `${label} · ${width}px` : label}>
                <ToggleGroupItem value={id} aria-label={label}>
                  <Icon />
                </ToggleGroupItem>
              </Tip>
            ))}
          </ToggleGroup>
          {vp === "custom" && (
            <Input
              type="number"
              min={240}
              max={3840}
              value={custom}
              onChange={(e) => setCustom(Math.max(240, Math.min(3840, Number(e.target.value) || 240)))}
              aria-label="Custom width in pixels"
              className="h-8 w-20 tabular-nums"
            />
          )}
        </div>

        <div className="flex items-center gap-1">
          <Label className="mr-2 gap-2 text-sm max-lg:hidden">
            <Switch checked={preview} onCheckedChange={setPreview} />
            Interact
          </Label>
          <Tip label="Fullscreen canvas">
            <Button variant="ghost" size="icon-sm" aria-label="Fullscreen canvas" onClick={() => canvas.current?.requestFullscreen().catch(() => {})}>
              <FullscreenIcon />
            </Button>
          </Tip>
          <Tip label={copied ? "Copied" : long ? `Copy link · ${hash!.length} characters, chat apps may cut it short` : "Copy link to this design"}>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Copy link to this design"
              disabled={!hash}
              className={long && !copied ? "text-amber-600 dark:text-amber-400" : undefined}
              onClick={() =>
                navigator.clipboard
                  .writeText(`${location.origin}/builder#${hash}`)
                  .then(() => {
                    setCopied(true)
                    setTimeout(() => setCopied(false), 1500)
                  })
                  .catch(() => {})
              }
            >
              {copied ? <CheckIcon /> : long ? <TriangleAlertIcon /> : <LinkIcon />}
            </Button>
          </Tip>
          <Tip label="Open page in a new tab">
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Open page in a new tab"
              nativeButton={false}
              render={<a href={`/builder/view#${hash ?? ""}`} target="_blank" rel="noreferrer" />}
            >
              <ExternalLinkIcon />
            </Button>
          </Tip>
          <ModeToggle />
          <Button size="sm" className="ml-1" onClick={() => setCodeOpen(true)}>
            Get code
          </Button>
          <Dialog open={codeOpen} onOpenChange={setCodeOpen}>
            <DialogContent className="sm:max-w-3xl">
              <DialogHeader>
                <DialogTitle>Your page</DialogTitle>
                <DialogDescription>
                  Install the components with the shadcn CLI, then paste the page into your app.
                </DialogDescription>
              </DialogHeader>
              <Output tree={tree} />
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <Tabs orientation="vertical" value={tab} onValueChange={(v) => setTab(String(v))} className="min-h-0 shrink-0 gap-0 border-r">
          <div className="flex h-full w-12 flex-col items-center justify-between border-r py-2">
            <TabsList variant="line" className="h-auto w-full justify-start gap-1 px-1.5">
              {[
                { id: "components", label: "Components", Icon: BlocksIcon },
                { id: "layers", label: "Layers", Icon: LayersIcon },
              ].map(({ id, label, Icon }) => (
                <Tip key={id} label={label} side="right">
                  <TabsTrigger value={id} aria-label={label} className="size-9 flex-none group-data-vertical/tabs:justify-center">
                    <Icon />
                  </TabsTrigger>
                </Tip>
              ))}
            </TabsList>
            <Tip label="Get code" side="right">
              <Button variant="ghost" size="icon" aria-label="Get code" onClick={() => setCodeOpen(true)}>
                <CodeIcon />
              </Button>
            </Tip>
          </div>
          <TabsContent value="components" className={PANEL}>
            <Palette catalog={catalog} onAdd={add} />
          </TabsContent>
          <TabsContent value="layers" className={PANEL}>
            <Layers tree={tree} selected={selected} onSelect={setPicked} onMove={place} />
          </TabsContent>
        </Tabs>

        <main
          ref={canvas}
          className="relative min-w-0 flex-1 overflow-hidden bg-background bg-[repeating-linear-gradient(45deg,var(--color-border)_0_1px,transparent_1px_12px)]"
          aria-label="Canvas"
        >
          {!fluid && (
            <p className="absolute top-1 left-1/2 -translate-x-1/2 text-xs text-muted-foreground tabular-nums">
              {width}px{scale < 1 && ` · ${Math.round(scale * 100)}%`}
            </p>
          )}
          {full && (
            <Button size="sm" variant="secondary" className="absolute top-2 right-2 z-10" onClick={() => document.exitFullscreen()}>
              Exit fullscreen
            </Button>
          )}
          <div
            className="absolute overflow-hidden bg-background shadow-sm"
            style={{
              left: fluid ? 0 : Math.max(pad, (stage.w - width * scale) / 2),
              top: pad,
              width: width * scale,
              height: stage.h - pad * 2,
              outline: fluid ? undefined : "1px solid var(--color-border)",
            }}
          >
            {stage.w > 0 && (
              <iframe
                ref={frame}
                src="/builder/view?edit"
                title="Canvas"
                className="block origin-top-left border-0"
                style={{ width, height, transform: `scale(${scale})` }}
              />
            )}
          </div>
        </main>

        <aside className="flex w-72 shrink-0 flex-col border-l max-lg:hidden" aria-label="Inspector">
          <Inspector
            key={node.id}
            node={node}
            root={tree}
            entry={entryOf(catalog, node)}
            onChange={(patch, key) => commit((t) => update(t, node.id, patch), key)}
            onSelect={setPicked}
            onDuplicate={duplicateSelected}
            onRemove={removeSelected}
          />
        </aside>
      </div>
    </div>
  )
}
