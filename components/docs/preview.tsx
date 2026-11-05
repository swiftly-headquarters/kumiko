"use client"

import { useState } from "react"
import { RotateCcwIcon, SlidersHorizontalIcon, SparklesIcon } from "lucide-react"

import {
  ControlsPanel,
  controlsToProps,
  type Controls,
} from "@/components/docs/controls-panel"
import { DemoRender } from "@/components/docs/demo-render"
import { Animations } from "@/lib/motion"
import { cn } from "@/lib/utils"

const toolButton =
  "flex size-8 items-center justify-center rounded-lg bg-accent text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 aria-pressed:text-foreground"

// Live preview on top (with optional controls panel), source below
// (collapsed until "View code"). Layout follows animate-ui.
export function Preview({
  slug,
  demo,
  controls: initial,
  source,
}: {
  slug: string
  demo: string
  controls?: Controls
  source: React.ReactNode
}) {
  const [n, setN] = useState(0)
  const [expanded, setExpanded] = useState(false)
  const [controls, setControls] = useState(initial)
  const [open, setOpen] = useState(true)
  const [animated, setAnimated] = useState(true)
  return (
    <div className="flex flex-col gap-1 rounded-xl bg-accent p-1">
      <div className="flex flex-col md:flex-row">
        <div className="relative flex min-h-[400px] min-w-0 flex-1 items-center justify-center rounded-lg bg-background px-6 py-16 sm:px-10">
          <div className="absolute top-3 right-3 flex gap-1">
            {controls && (
              <button
                type="button"
                aria-label="Controls"
                title="Controls"
                aria-pressed={open}
                className={toolButton}
                onClick={() => setOpen((o) => !o)}
              >
                <SlidersHorizontalIcon className="size-3.5" />
              </button>
            )}
            <button
              type="button"
              aria-label="Animations"
              title={animated ? "Disable animations" : "Enable animations"}
              aria-pressed={animated}
              className={toolButton}
              onClick={() => setAnimated((a) => !a)}
            >
              <SparklesIcon className="size-3.5" />
            </button>
            <button
              type="button"
              aria-label="Replay"
              title="Replay"
              className={toolButton}
              onClick={() => setN((v) => v + 1)}
            >
              <RotateCcwIcon className="size-3.5" />
            </button>
          </div>
          <div key={n} className="flex w-full items-center justify-center">
            <Animations enabled={animated}>
              <DemoRender
                slug={slug}
                demo={demo}
                props={controls && controlsToProps(controls)}
              />
            </Animations>
          </div>
        </div>
        {controls && (
          // Fixed-width inner box, so the panel unfolds instead of reflowing.
          <div
            className={cn(
              "overflow-hidden transition-[width] duration-300 ease-out md:shrink-0",
              open ? "md:w-[254px]" : "hidden md:block md:w-0"
            )}
            // Collapsed to 0 width, but still in the DOM: keep it out of Tab order.
            inert={!open}
          >
            <div className="h-full pt-1 md:w-[254px] md:pt-0 md:pl-1">
              <ControlsPanel controls={controls} onControlsChange={setControls} />
            </div>
          </div>
        )}
      </div>
      <div
        className={cn(
          "relative overflow-hidden rounded-lg bg-background [&_[data-slot=code-block]]:rounded-none [&_[data-slot=code-block]]:border-0 [&_[data-slot=code-block]]:bg-transparent",
          !expanded && "max-h-40 [&_*]:[scrollbar-width:none]"
        )}
      >
        {source}
        {!expanded && (
          <div className="absolute inset-0 flex items-center justify-center bg-linear-to-b from-background/20 to-background">
            <button
              type="button"
              className="h-9 rounded-lg bg-accent px-4 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              onClick={() => setExpanded(true)}
            >
              View code
            </button>
          </div>
        )}
      </div>
      {expanded && (
        <button
          type="button"
          className="h-8 rounded-lg text-sm font-medium text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
          onClick={() => setExpanded(false)}
        >
          Hide code
        </button>
      )}
    </div>
  )
}
