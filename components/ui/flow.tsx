"use client"

import {
  Children,
  createContext,
  Fragment,
  use,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react"
import { motion, useReducedMotion } from "motion/react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cn } from "@/lib/utils"
import { withAnimated } from "@/lib/motion"

type Orientation = "horizontal" | "vertical"
type Align = "start" | "center"

const FlowContext = createContext<{ orientation: Orientation }>({
  orientation: "horizontal",
})

// Connectors are drawn as one SVG layer, measured from the laid-out nodes.
const RADIUS = 8 // elbow radius
const TURN = 32 // where a fork/merge turns, measured from its shared end
const ARROW = 8 // space left in front of a node for the arrowhead
const STEP = 0.45 // seconds between one step and the next
const START = 18 // "start" align: anchor 1.125rem from the node's edge (a default node is h-9)

const SLOTS = ["flow-node", "flow-list", "flow-parallel"]
const items = (el: Element) =>
  [...el.children].filter((c) =>
    SLOTS.includes(c.getAttribute("data-slot") ?? "")
  ) as HTMLElement[]

// Nodes where an item is entered (first) or left (last).
function ends(el: HTMLElement, first: boolean): HTMLElement[] {
  const slot = el.dataset.slot
  if (slot === "flow-node") return [el]
  if (slot === "flow-list") {
    const its = items(el)
    const it = first ? its[0] : its.at(-1)
    return it ? ends(it, first) : []
  }
  return [...el.children].flatMap((b) =>
    items(b).flatMap((it) => ends(it, first))
  )
}

type Edge = { a: HTMLElement; b: HTMLElement; fanIn: boolean; fanOut: boolean }

function edges(container: HTMLElement, out: Edge[] = []) {
  const its = items(container)
  its.forEach((it, i) => {
    if (i > 0) {
      const from = ends(its[i - 1], false)
      const to = ends(it, true)
      for (const a of from)
        for (const b of to)
          out.push({ a, b, fanIn: from.length > 1, fanOut: to.length > 1 })
    }
    if (it.dataset.slot === "flow-list") edges(it, out)
    if (it.dataset.slot === "flow-parallel")
      for (const branch of it.children) edges(branch as HTMLElement, out)
  })
  return out
}

// Box relative to `root`. Offsets ignore transforms, so the node entrance
// animation doesn't skew the lines.
function box(el: HTMLElement, root: HTMLElement) {
  let x = 0
  let y = 0
  let e: Element | null = el
  while (e instanceof HTMLElement && e !== root) {
    x += e.offsetLeft
    y += e.offsetTop
    e = e.offsetParent
  }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight }
}

const n = (v: number) => Math.round(v * 100) / 100

// A path along the main axis (u) that steps across (v) at `um`, with two
// rounded elbows.
function route(
  u1: number,
  v1: number,
  u2: number,
  v2: number,
  um: number,
  h: boolean
) {
  const p = (u: number, v: number) =>
    h ? `${n(u)} ${n(v)}` : `${n(v)} ${n(u)}`
  const dv = v2 - v1
  if (Math.abs(dv) < 1) return `M ${p(u1, v1)} L ${p(u2, v1)}`
  const s = Math.sign(dv)
  const r = Math.max(0, Math.min(RADIUS, Math.abs(dv) / 2, um - u1, u2 - um))
  return [
    `M ${p(u1, v1)}`,
    `L ${p(um - r, v1)}`,
    `Q ${p(um, v1)} ${p(um, v1 + s * r)}`,
    `L ${p(um, v2 - s * r)}`,
    `Q ${p(um, v2)} ${p(um + r, v2)}`,
    `L ${p(u2, v2)}`,
  ].join(" ")
}

function measure(
  root: HTMLElement,
  orientation: Orientation,
  align: Align,
  arrows: boolean
) {
  const h = orientation === "horizontal"
  const anchor = (start: number, size: number) =>
    start + (align === "start" ? Math.min(START, size / 2) : size / 2)
  const list = edges(root)
  // Depth = steps from the start. Nodes and lines animate in depth order.
  const depth = new Map<HTMLElement, number>()
  for (let i = 0; i <= list.length; i++)
    for (const { a, b } of list)
      depth.set(b, Math.max(depth.get(b) ?? 0, (depth.get(a) ?? 0) + 1))
  root
    .querySelectorAll<HTMLElement>("[data-slot=flow-node]")
    .forEach((node) => {
      node.style.animationDelay = `${(depth.get(node) ?? 0) * STEP}s`
    })
  return list.map(({ a, b, fanIn, fanOut }) => {
    const A = box(a, root)
    const B = box(b, root)
    const u1 = h ? A.x + A.w : A.y + A.h
    const v1 = h ? anchor(A.y, A.h) : anchor(A.x, A.w)
    const u2 = (h ? B.x : B.y) - (arrows ? ARROW : 0)
    const v2 = h ? anchor(B.y, B.h) : anchor(B.x, B.w)
    const gap = Math.min(TURN, (u2 - u1) / 2)
    const um =
      fanOut && !fanIn ? u1 + gap : fanIn && !fanOut ? u2 - gap : (u1 + u2) / 2
    return {
      d: route(u1, v1, u2, v2, um, h),
      delay: (depth.get(a) ?? 0) * STEP + 0.2,
      disabled:
        a.hasAttribute("data-disabled") || b.hasAttribute("data-disabled"),
    }
  })
}

// Spacing between items; the lines are drawn over it.
function Gap() {
  const { orientation } = use(FlowContext)
  return (
    <div
      aria-hidden
      data-slot="flow-gap"
      className={cn("shrink-0", orientation === "horizontal" ? "w-16" : "h-14")}
    />
  )
}

function Sequence({ children }: { children?: ReactNode }) {
  return Children.toArray(children).map((child, i) => (
    <Fragment key={i}>
      {i > 0 && <Gap />}
      {child}
    </Fragment>
  ))
}

function FlowBase({
  orientation = "horizontal",
  align = "start",
  arrows = false,
  className,
  children,
  ...props
}: ComponentProps<"div"> & {
  orientation?: Orientation
  align?: Align
  arrows?: boolean
}) {
  const h = orientation === "horizontal"
  const ref = useRef<HTMLDivElement>(null)
  const marker = useId()
  const reduce = useReducedMotion()
  const [paths, setPaths] = useState<
    { d: string; delay: number; disabled: boolean }[]
  >([])

  useLayoutEffect(() => {
    const root = ref.current
    if (!root) return
    const draw = () => setPaths(measure(root, orientation, align, arrows))
    draw()
    const ro = new ResizeObserver(draw)
    ro.observe(root)
    root
      .querySelectorAll("[data-slot=flow-node]")
      .forEach((node) => ro.observe(node))
    return () => ro.disconnect()
  }, [orientation, align, arrows, children])

  return (
    <FlowContext value={{ orientation }}>
      <div
        data-slot="flow"
        data-orientation={orientation}
        className={cn(
          "flex w-full max-w-full [scrollbar-width:thin] overflow-auto p-4",
          className
        )}
        {...props}
      >
        <div
          ref={ref}
          className={cn(
            "relative flex shrink-0",
            h ? "flex-row" : "flex-col",
            align === "center" ? "items-center" : "items-start"
          )}
        >
          <svg
            aria-hidden
            className="pointer-events-none absolute inset-0 size-full overflow-visible text-[color-mix(in_oklab,var(--muted-foreground)_55%,var(--background))]"
          >
            {arrows && (
              <defs>
                <marker
                  id={marker}
                  markerWidth="8"
                  markerHeight="8"
                  refX="0"
                  refY="4"
                  orient="auto"
                  markerUnits="userSpaceOnUse"
                >
                  <path
                    d="M1.5 1.5 L7 4 L1.5 6.5 Z"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </marker>
              </defs>
            )}
            {/* Disabled first, so active lines draw over shared segments. */}
            {[...paths]
              .sort((x, y) => Number(y.disabled) - Number(x.disabled))
              .map((p, i) => (
                <motion.path
                  key={i}
                  d={p.d}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  markerEnd={arrows ? `url(#${marker})` : undefined}
                  initial={reduce ? false : { pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: p.disabled ? 0.4 : 1 }}
                  transition={{
                    pathLength: {
                      delay: p.delay,
                      duration: STEP - 0.15,
                      ease: "easeInOut",
                    },
                    opacity: { delay: p.delay, duration: 0.1 },
                  }}
                />
              ))}
          </svg>
          <Sequence>{children}</Sequence>
        </div>
      </div>
    </FlowContext>
  )
}

function FlowNode({
  className,
  render,
  disabled,
  ...props
}: useRender.ComponentProps<"div"> & { disabled?: boolean }) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        "data-slot": "flow-node",
        "data-disabled": disabled ? "" : undefined,
        className: cn(
          "flex shrink-0 items-center",
          // A custom `render` owns the whole look.
          !render &&
            "min-h-9 animate-in rounded-lg border bg-card px-3 text-sm whitespace-nowrap text-card-foreground shadow-xs duration-300 fade-in-0 zoom-in-98 [animation-fill-mode:backwards] motion-reduce:animate-none",
          disabled && "opacity-50",
          className
        ),
      } as ComponentProps<"div">,
      props
    ),
    render,
  })
}

function FlowList({ className, children, ...props }: ComponentProps<"div">) {
  const { orientation } = use(FlowContext)
  return (
    <div
      data-slot="flow-list"
      className={cn(
        "items-[inherit] flex shrink-0",
        orientation === "horizontal" ? "flex-row" : "flex-col",
        className
      )}
      {...props}
    >
      <Sequence>{children}</Sequence>
    </div>
  )
}

function FlowParallel({
  align = "start",
  className,
  children,
  ...props
}: ComponentProps<"div"> & { align?: "start" | "end" }) {
  const { orientation } = use(FlowContext)
  const h = orientation === "horizontal"
  return (
    <div
      data-slot="flow-parallel"
      className={cn(
        "items-[inherit] flex shrink-0 gap-4",
        h ? "flex-col" : "flex-row",
        className
      )}
      {...props}
    >
      {Children.toArray(children).map((child, i) => (
        <div
          key={i}
          data-slot="flow-branch"
          className={cn(
            "items-[inherit] flex self-stretch",
            h ? "flex-row" : "flex-col",
            align === "end" && "justify-end"
          )}
        >
          {child}
        </div>
      ))}
    </div>
  )
}

const Flow = withAnimated(FlowBase)

export { Flow, FlowNode, FlowList, FlowParallel }
