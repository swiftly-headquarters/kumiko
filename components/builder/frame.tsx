"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"
import Link from "next/link"

import { Tree } from "@/components/builder/render"
import { find, label, nests, parentOf, read, type Node } from "@/lib/builder/tree"

export type DragData = { kind: "new"; nodes: Node[] } | { kind: "move"; id: string }
export type ToFrame = { type: "state"; tree: Node; selected: string | null; edit: boolean }
export type FromFrame =
  | { type: "ready" }
  | { type: "select"; id: string }
  | { type: "drop"; data: DragData; parent: string; index: number }
  | { type: "key"; key: string; mod: boolean; shift: boolean }
export const DRAG_TYPE = "application/x-kumiko-node"

type Rect = { x: number; y: number; w: number; h: number }
type Drop = { parent: string; index: number; line: Rect; box: Rect | null }

const ACCENT = "oklch(0.6 0.2 262)"
const sel = (id: string) => `[data-node-id="${CSS.escape(id)}"]`
const rect = (el: Element | null): Rect | null => {
  if (!el) return null
  const r = el.getBoundingClientRect()
  return { x: r.left, y: r.top, w: r.width, h: r.height }
}
const same = (a: Rect | null, b: Rect | null) =>
  a === b || (!!a && !!b && a.x === b.x && a.y === b.y && a.w === b.w && a.h === b.h)

function isRow(el: Element) {
  const s = getComputedStyle(el)
  if (s.display.includes("grid")) return true
  return s.display.includes("flex") && s.flexDirection.startsWith("row")
}

function edgeLine(r: Rect, row: boolean, after: boolean): Rect {
  return row
    ? { x: after ? r.x + r.w - 1 : r.x - 1, y: r.y, w: 2, h: r.h }
    : { x: r.x, y: after ? r.y + r.h - 1 : r.y - 1, w: r.w, h: 2 }
}

function dropInside(node: Node, el: Element, x: number, y: number): Drop {
  const row = isRow(el)
  const box = rect(el)!
  const kids = (node.c ?? []).flatMap((k) => {
    const r = rect(document.querySelector(sel(k.id)))
    return r ? [{ k, r }] : []
  })
  const all = node.c ?? []
  for (const { k, r } of kids) {
    const before = row
      ? y < r.y || (y <= r.y + r.h && x < r.x + r.w / 2)
      : y < r.y + r.h / 2
    if (before) return { parent: node.id, index: all.indexOf(k), line: edgeLine(r, row, false), box }
  }
  const last = kids.at(-1)
  return {
    parent: node.id,
    index: all.length,
    line: last
      ? edgeLine(last.r, row, true)
      : { x: box.x + 4, y: box.y + 4, w: Math.max(box.w - 8, 2), h: 2 },
    box,
  }
}

function dropTarget(tree: Node, x: number, y: number, moving: string | null): Drop | null {
  const hit = document.elementFromPoint(x, y)?.closest("[data-node-id]")
  let el = hit ?? document.querySelector(sel(tree.id))
  let node = el && find(tree, (el as HTMLElement).dataset.nodeId!)
  if (!el || !node) return null
  if (moving && node.c?.some((k) => k.id === moving)) return dropInside(node, el, x, y)
  let at = parentOf(tree, node.id)
  while (at && !nests(at[0]) && !at[0].c?.some((k) => k.id === moving) && parentOf(tree, at[0].id)) {
    const up = document.querySelector(sel(at[0].id))
    if (!up) break
    ;[el, node, at] = [up, at[0], parentOf(tree, at[0].id)]
  }
  const r = rect(el)!
  const edge = Math.min(8, r.h / 4, r.w / 4)
  const nearEdge = x < r.x + edge || x > r.x + r.w - edge || y < r.y + edge || y > r.y + r.h - edge
  if (nests(node) && (!at || !nearEdge)) return dropInside(node, el, x, y)
  if (!at) return null
  const row = el.parentElement ? isRow(el.parentElement) : false
  const after = row ? x > r.x + r.w / 2 : y > r.y + r.h / 2
  return {
    parent: at[0].id,
    index: at[1] + (after ? 1 : 0),
    line: edgeLine(r, row, after),
    box: rect(document.querySelector(sel(at[0].id))),
  }
}

const post = (msg: FromFrame) => window.parent.postMessage(msg, location.origin)

export function Frame() {
  const [state, setState] = useState<ToFrame | null>(null)
  const [broken, setBroken] = useState<"broken" | "unsafe" | null>(null)
  const [hover, setHover] = useState<string | null>(null)
  const [drop, setDrop] = useState<Drop | null>(null)
  const [boxes, setBoxes] = useState<{ sel: Rect | null; hover: Rect | null }>({ sel: null, hover: null })
  const stateRef = useRef(state)
  const moving = useRef<string | null>(null) // node being dragged by its badge
  useEffect(() => {
    stateRef.current = state
  }, [state])

  useEffect(() => {
    if (window.parent !== window && new URLSearchParams(location.search).has("edit")) {
      const onMessage = (e: MessageEvent<ToFrame>) => {
        if (e.origin !== location.origin || e.source !== window.parent) return
        if (e.data?.type === "state") setState(e.data)
      }
      window.addEventListener("message", onMessage)
      post({ type: "ready" })
      return () => window.removeEventListener("message", onMessage)
    }
    const load = () =>
      read(location.hash.slice(1)).then((r) => {
        setState("tree" in r ? { type: "state", tree: r.tree, selected: null, edit: false } : null)
        setBroken("error" in r ? r.error : null)
      })
    load()
    window.addEventListener("hashchange", load)
    return () => window.removeEventListener("hashchange", load)
  }, [])

  const edit = !!state?.edit

  useEffect(() => {
    if (!edit) return
    const ui = (e: Event) => (e.target as Element).closest?.("[data-builder-ui]")
    const block = (e: Event) => {
      if (ui(e)) return
      e.preventDefault()
      e.stopPropagation()
    }
    const onClick = (e: MouseEvent) => {
      if (ui(e)) return
      block(e)
      const id = (e.target as Element).closest?.("[data-node-id]")?.getAttribute("data-node-id")
      post({ type: "select", id: id ?? stateRef.current!.tree.id })
    }
    const onOver = (e: PointerEvent) =>
      setHover((e.target as Element).closest?.("[data-node-id]")?.getAttribute("data-node-id") ?? null)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Tab") return
      e.preventDefault()
      e.stopPropagation()
      post({ type: "key", key: e.key, mod: e.ctrlKey || e.metaKey, shift: e.shiftKey })
    }
    const onDragOver = (e: DragEvent) => {
      if (!e.dataTransfer?.types.includes(DRAG_TYPE)) return
      e.preventDefault()
      setDrop(dropTarget(stateRef.current!.tree, e.clientX, e.clientY, moving.current))
    }
    const onDrop = (e: DragEvent) => {
      const raw = e.dataTransfer?.getData(DRAG_TYPE)
      if (!raw) return
      e.preventDefault()
      const at = dropTarget(stateRef.current!.tree, e.clientX, e.clientY, moving.current)
      moving.current = null
      setDrop(null)
      if (at) post({ type: "drop", data: JSON.parse(raw), parent: at.parent, index: at.index })
    }
    const clear = (e: Event) => {
      if (e.type !== "dragleave" || !(e as DragEvent).relatedTarget) setDrop(null)
    }
    const leave = () => setHover(null)
    const blocked = ["pointerdown", "mousedown", "pointerup", "mouseup", "dblclick", "contextmenu", "touchstart", "submit"]
    const on = [
      ...blocked.map((t) => [t, block] as const),
      ["click", onClick],
      ["pointerover", onOver],
      ["keydown", onKey],
      ["dragover", onDragOver],
      ["drop", onDrop],
      ["dragleave", clear],
      ["dragend", clear],
    ] as const
    for (const [t, f] of on) document.addEventListener(t, f as EventListener, true)
    document.documentElement.addEventListener("pointerleave", leave)
    return () => {
      for (const [t, f] of on) document.removeEventListener(t, f as EventListener, true)
      document.documentElement.removeEventListener("pointerleave", leave)
    }
  }, [edit])

  const selected = edit ? state?.selected ?? null : null
  useEffect(() => {
    if (!edit) return
    let raf = 0
    const tick = () => {
      const next = {
        sel: selected ? rect(document.querySelector(sel(selected))) : null,
        hover: hover && hover !== selected ? rect(document.querySelector(sel(hover))) : null,
      }
      setBoxes((b) => (same(b.sel, next.sel) && same(b.hover, next.hover) ? b : next))
      raf = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(raf)
  }, [edit, selected, hover])

  if (!state)
    return broken ? (
      <main className="flex min-h-svh flex-col items-center justify-center gap-2 p-6 text-center">
        <h1 className="text-lg font-medium">
          {broken === "unsafe" ? "This page can't be shown" : "This page link is incomplete"}
        </h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          {broken === "unsafe" ? (
            <>It uses something the builder does not allow, such as event handlers or unknown components. </>
          ) : (
            <>The design lives in the link itself. If it was shared in a chat, it may have been cut short. Ask for the full link, or </>
          )}
          {broken === "unsafe" && "Ask the sender for a new link, or "}
          <Link href="/builder" className="underline underline-offset-4">start a new page</Link>.
        </p>
      </main>
    ) : null
  const selNode = selected ? find(state.tree, selected) : undefined
  const box = (r: Rect, style: CSSProperties) => ({
    position: "fixed" as const,
    left: r.x,
    top: r.y,
    width: r.w,
    height: r.h,
    pointerEvents: "none" as const,
    zIndex: 2147483646,
    ...style,
  })

  return (
    <>
      <Tree node={state.tree} edit={edit} />
      {edit && (
        <div aria-hidden>
          {!state.tree.c?.length && (
            <p className="pointer-events-none fixed inset-0 flex items-center justify-center p-6 text-center text-sm text-muted-foreground">
              Drag components here, or press + next to one in the list.
            </p>
          )}
          {boxes.hover && <div style={box(boxes.hover, { outline: `1px dashed ${ACCENT}` })} />}
          {boxes.sel && <div style={box(boxes.sel, { outline: `2px solid ${ACCENT}`, outlineOffset: -1 })} />}
          {boxes.sel && selNode && selNode.id !== state.tree.id && (
            <div
              data-builder-ui
              draggable
              title="Drag to move"
              onDragStart={(e) => {
                moving.current = selNode.id
                e.dataTransfer.setData(DRAG_TYPE, JSON.stringify({ kind: "move", id: selNode.id }))
                e.dataTransfer.effectAllowed = "move"
              }}
              onDragEnd={() => {
                moving.current = null
              }}
              style={{
                position: "fixed",
                left: boxes.sel.x,
                top: Math.max(0, boxes.sel.y - 22),
                zIndex: 2147483647,
                background: ACCENT,
                color: "white",
                font: "500 11px/22px var(--font-sans, sans-serif)",
                padding: "0 8px",
                borderRadius: 4,
                cursor: "grab",
              }}
            >
              ⠿ {label(selNode)}
            </div>
          )}
          {drop?.box && <div style={box(drop.box, { outline: `1px solid ${ACCENT}`, background: "color-mix(in oklch, oklch(0.6 0.2 262) 6%, transparent)" })} />}
          {drop && <div style={box(drop.line, { background: ACCENT, borderRadius: 2 })} />}
        </div>
      )}
    </>
  )
}
