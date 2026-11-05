"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { geoDistance, geoEqualEarth, geoOrthographic, geoPath } from "d3-geo"
import { motion } from "motion/react"
import { feature } from "topojson-client"
import type { Feature, FeatureCollection, Geometry } from "geojson"
import worldData from "world-atlas/countries-110m.json"

import { softSpring, useAnimated } from "@/lib/motion"
import { cn } from "@/lib/utils"

const W = 960
const H = 480

const topo = worldData as unknown as Parameters<typeof feature>[0]
const all = feature(
  topo,
  topo.objects.countries
) as unknown as FeatureCollection<Geometry, { name: string }>
// No Antarctica: it eats a tenth of the map and carries no data.
const world: FeatureCollection<Geometry, { name: string }> = {
  ...all,
  features: all.features.filter((f) => f.properties.name !== "Antarctica"),
}

const projection = geoEqualEarth().fitSize([W, H], world)
const path = geoPath(projection)
const shapes = world.features.map((f: Feature<Geometry, { name: string }>) => ({
  name: f.properties.name,
  d: path(f) ?? "",
}))

export type MapBubble = {
  id: string
  lat: number
  lng: number
  value: number
  label?: string
}

export type ProbeStatus = "up" | "degraded" | "down"

export type MapProbe = {
  id: string
  lat: number
  lng: number
  status: ProbeStatus
  label?: string
}

const STATUS_COLOR: Record<ProbeStatus, string> = {
  up: "var(--color-emerald-500, #10b981)",
  degraded: "var(--color-amber-500, #f59e0b)",
  down: "var(--destructive)",
}

type Tip = { x: number; y: number; text: string } | null

const shade = (v: number | undefined, top: number) =>
  v === undefined
    ? "color-mix(in oklab, var(--muted-foreground) 18%, transparent)"
    : `color-mix(in oklab, var(--primary) ${15 + Math.min(1, v / top) * 85}%, transparent)`

// SVG world map. Three layers, all optional:
// - `values`: choropleth, country name -> number, shaded by `max`.
// - `bubbles`: circles sized by value.
// - `probes`: status dots that pulse.
export function WorldMap({
  values,
  max,
  bubbles,
  probes,
  className,
  animated,
}: {
  values?: Record<string, number>
  max?: number
  bubbles?: MapBubble[]
  probes?: MapProbe[]
  className?: string
  animated?: boolean
}) {
  const inherited = useAnimated()
  const on = animated ?? inherited
  const [tip, setTip] = useState<Tip>(null)
  const top = useMemo(
    () => max ?? Math.max(1, ...Object.values(values ?? { _: 1 })),
    [max, values]
  )
  const maxBubble = useMemo(
    () => Math.max(1, ...(bubbles ?? []).map((b) => b.value)),
    [bubbles]
  )
  // Rounded: Node and the browser differ in the last float digits (hydration).
  const at = (lng: number, lat: number) =>
    (projection([lng, lat]) ?? [0, 0]).map((n) => Math.round(n * 100) / 100)
  const show = (e: React.PointerEvent, text?: string) => {
    if (!text) return
    const r = (e.currentTarget as SVGElement).ownerSVGElement!.getBoundingClientRect()
    setTip({ x: e.clientX - r.left, y: e.clientY - r.top, text })
  }

  return (
    <div
      data-slot="world-map"
      className={cn("relative w-full", className)}
      onPointerLeave={() => setTip(null)}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="World map"
        className="block h-auto w-full"
      >
        <g className="stroke-background" strokeWidth={0.5}>
          {shapes.map((s) => {
            const v = values?.[s.name]
            return (
              <path
                key={s.name}
                d={s.d}
                fill={shade(v, top)}
                className="transition-opacity hover:opacity-70"
                onPointerMove={
                  v === undefined
                    ? undefined
                    : (e) => show(e, `${s.name}: ${v.toLocaleString()}`)
                }
                onPointerLeave={() => setTip(null)}
              />
            )
          })}
        </g>
        {bubbles?.map((b, i) => {
          const [x, y] = at(b.lng, b.lat)
          const r = 4 + Math.sqrt(b.value / maxBubble) * 24
          return (
            <motion.circle
              key={b.id}
              cx={x}
              cy={y}
              r={r}
              initial={on ? { scale: 0, opacity: 0 } : false}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ ...softSpring, delay: on ? i * 0.05 : 0 }}
              style={{ transformOrigin: `${x}px ${y}px` }}
              className="cursor-default fill-primary/40 stroke-primary"
              strokeWidth={1}
              onPointerMove={(e) =>
                show(e, `${b.label ?? b.id}: ${b.value.toLocaleString()}`)
              }
              onPointerLeave={() => setTip(null)}
            />
          )
        })}
        {probes?.map((p) => {
          const [x, y] = at(p.lng, p.lat)
          const color = STATUS_COLOR[p.status]
          return (
            <g
              key={p.id}
              className="cursor-default"
              onPointerMove={(e) => show(e, `${p.label ?? p.id}: ${p.status}`)}
              onPointerLeave={() => setTip(null)}
            >
              {on && p.status !== "down" && (
                <motion.circle
                  cx={x}
                  cy={y}
                  r={4}
                  fill={color}
                  style={{ transformOrigin: `${x}px ${y}px` }}
                  animate={{ scale: [1, 3], opacity: [0.5, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                />
              )}
              <circle cx={x} cy={y} r={4} fill={color} stroke="var(--background)" strokeWidth={1.5} />
            </g>
          )
        })}
      </svg>
      {tip && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[130%] rounded-md border bg-popover px-2 py-1 text-xs whitespace-nowrap text-popover-foreground shadow-md"
          style={{ left: tip.x, top: tip.y }}
        >
          {tip.text}
        </div>
      )}
    </div>
  )
}

const G = 480

// Same layers as WorldMap, on a spinning orthographic globe. Drag to rotate.
// `speed` is degrees per second; auto-spin pauses while hovered or dragged.
export function Globe({
  values,
  max,
  bubbles,
  probes,
  className,
  animated,
  speed = 12,
}: {
  values?: Record<string, number>
  max?: number
  bubbles?: MapBubble[]
  probes?: MapProbe[]
  className?: string
  animated?: boolean
  speed?: number
}) {
  const inherited = useAnimated()
  const on = animated ?? inherited
  const [rot, setRot] = useState<[number, number]>([-20, -20])
  const [tip, setTip] = useState<Tip>(null)
  const drag = useRef<{ x: number; y: number } | null>(null)
  const hover = useRef(false)
  const top = useMemo(
    () => max ?? Math.max(1, ...Object.values(values ?? { _: 1 })),
    [max, values]
  )
  const maxBubble = useMemo(
    () => Math.max(1, ...(bubbles ?? []).map((b) => b.value)),
    [bubbles]
  )

  useEffect(() => {
    if (!on || !speed) return
    let raf = 0
    let last = performance.now()
    const tick = (t: number) => {
      const dt = t - last
      last = t
      if (!drag.current && !hover.current)
        setRot(([l, p]) => [(l + (dt * speed) / 1000) % 360, p])
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [on, speed])

  const projection = geoOrthographic()
    .translate([G / 2, G / 2])
    .scale(G / 2 - 4)
    .rotate(rot)
  const path = geoPath(projection)
  const center: [number, number] = [-rot[0], -rot[1]]
  const front = (lng: number, lat: number) =>
    geoDistance([lng, lat], center) < Math.PI / 2
  const at = (lng: number, lat: number) =>
    (projection([lng, lat]) ?? [0, 0]).map((n) => Math.round(n * 100) / 100)
  const show = (e: React.PointerEvent, text?: string) => {
    if (!text || drag.current) return
    const r = (e.currentTarget as SVGElement).ownerSVGElement!.getBoundingClientRect()
    setTip({ x: e.clientX - r.left, y: e.clientY - r.top, text })
  }

  return (
    <div
      data-slot="globe"
      className={cn("relative mx-auto aspect-square w-full max-w-md", className)}
      onPointerEnter={() => (hover.current = true)}
      onPointerLeave={() => {
        hover.current = false
        setTip(null)
      }}
    >
      <svg
        viewBox={`0 0 ${G} ${G}`}
        role="img"
        aria-label="Globe"
        className="block h-full w-full cursor-grab touch-pan-y select-none active:cursor-grabbing"
        onPointerDown={(e) => {
          drag.current = { x: e.clientX, y: e.clientY }
          setTip(null)
          e.currentTarget.setPointerCapture(e.pointerId)
        }}
        onPointerMove={(e) => {
          const d = drag.current
          if (!d) return
          const dx = e.clientX - d.x
          const dy = e.clientY - d.y
          drag.current = { x: e.clientX, y: e.clientY }
          setRot(([l, p]) => [
            l + dx * 0.4,
            Math.max(-80, Math.min(80, p - dy * 0.4)),
          ])
        }}
        onPointerUp={() => (drag.current = null)}
        onPointerCancel={() => (drag.current = null)}
      >
        <path
          d={path({ type: "Sphere" }) ?? ""}
          className="fill-muted/50 stroke-border"
          strokeWidth={1}
        />
        <g className="stroke-background" strokeWidth={0.5}>
          {world.features.map((f) => {
            const name = f.properties.name
            const v = values?.[name]
            return (
              <path
                key={name}
                d={path(f) ?? ""}
                fill={shade(v, top)}
                onPointerMove={
                  v === undefined
                    ? undefined
                    : (e) => show(e, `${name}: ${v.toLocaleString()}`)
                }
                onPointerLeave={() => setTip(null)}
              />
            )
          })}
        </g>
        {bubbles
          ?.filter((b) => front(b.lng, b.lat))
          .map((b, i) => {
            const [x, y] = at(b.lng, b.lat)
            const r = 4 + Math.sqrt(b.value / maxBubble) * 20
            return (
              <motion.circle
                key={b.id}
                cx={x}
                cy={y}
                r={r}
                initial={on ? { scale: 0, opacity: 0 } : false}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ ...softSpring, delay: on ? i * 0.05 : 0 }}
                style={{ transformOrigin: `${x}px ${y}px` }}
                className="fill-primary/40 stroke-primary"
                strokeWidth={1}
                onPointerMove={(e) =>
                  show(e, `${b.label ?? b.id}: ${b.value.toLocaleString()}`)
                }
                onPointerLeave={() => setTip(null)}
              />
            )
          })}
        {probes
          ?.filter((p) => front(p.lng, p.lat))
          .map((p) => {
            const [x, y] = at(p.lng, p.lat)
            const color = STATUS_COLOR[p.status]
            return (
              <g
                key={p.id}
                onPointerMove={(e) => show(e, `${p.label ?? p.id}: ${p.status}`)}
                onPointerLeave={() => setTip(null)}
              >
                {on && p.status !== "down" && (
                  <motion.circle
                    cx={x}
                    cy={y}
                    r={4}
                    fill={color}
                    style={{ transformOrigin: `${x}px ${y}px` }}
                    animate={{ scale: [1, 3], opacity: [0.5, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                  />
                )}
                <circle cx={x} cy={y} r={4} fill={color} stroke="var(--background)" strokeWidth={1.5} />
              </g>
            )
          })}
      </svg>
      {tip && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[130%] rounded-md border bg-popover px-2 py-1 text-xs whitespace-nowrap text-popover-foreground shadow-md"
          style={{ left: tip.x, top: tip.y }}
        >
          {tip.text}
        </div>
      )}
    </div>
  )
}
