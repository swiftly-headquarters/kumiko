"use client"

import { createContext, useContext, useId, useState } from "react"
import { AnimatePresence, LayoutGroup, motion } from "motion/react"

import { cn } from "@/lib/utils"

// Sliding active/hover bar shared by the docs sidebar and TOC.
const bar = { type: "spring", stiffness: 500, damping: 35 } as const
const label = { type: "spring", stiffness: 200, damping: 20 } as const

const HoverContext = createContext<{
  hovered: string | null
  setHovered: (id: string | null) => void
}>({ hovered: null, setHovered: () => {} })

export function AnimatedNav({ children }: { children: React.ReactNode }) {
  const [hovered, setHovered] = useState<string | null>(null)
  return (
    <LayoutGroup id={useId()}>
      <HoverContext value={{ hovered, setHovered }}>{children}</HoverContext>
    </LayoutGroup>
  )
}

// A rail item: 1px rail, 3px active bar, 3px hover bar, label nudged right.
export function NavItem({
  id,
  active,
  className,
  render,
  children,
}: {
  id: string
  active: boolean
  className?: string
  render: (props: {
    className: string
    onPointerEnter: (e: React.PointerEvent) => void
    onPointerLeave: () => void
    children: React.ReactNode
  }) => React.ReactNode
  children: React.ReactNode
}) {
  const { hovered, setHovered } = useContext(HoverContext)
  const isHovered = hovered === id
  return render({
    className: cn("relative flex items-center py-1.5 pr-1 pl-4", className),
    onPointerEnter: (e) => {
      if (e.pointerType === "mouse") setHovered(id)
    },
    onPointerLeave: () => setHovered(null),
    children: (
      <>
        <span className="absolute inset-y-0 left-[9px] w-px bg-border" />
        <AnimatePresence initial={false}>
          {active && (
            <motion.span
              layoutId="docs-active-bar"
              className="pointer-events-none absolute top-1/2 left-[8px] z-[11] h-[56%] w-[3px] -translate-y-1/2 rounded-full bg-primary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={bar}
            />
          )}
        </AnimatePresence>
        <AnimatePresence initial={false}>
          {isHovered && (
            <motion.span
              layoutId="docs-hover-bar"
              className="pointer-events-none absolute top-1/2 left-[8px] z-10 h-[56%] w-[3px] -translate-y-1/2 rounded-full bg-neutral-300 dark:bg-neutral-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={bar}
            />
          )}
        </AnimatePresence>
        <motion.span
          className={cn(
            "w-full pl-3 text-sm text-neutral-700 transition-colors dark:text-neutral-200",
            (active || isHovered) && "text-black dark:text-white"
          )}
          animate={{ x: active || isHovered ? 3 : 0 }}
          transition={label}
        >
          {children}
        </motion.span>
      </>
    ),
  })
}

// Section heading: small icon box with a short rail stub underneath.
export function NavTitle({
  icon: Icon,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
}) {
  return (
    <p className="mb-2 flex items-center gap-2 px-2">
      <span className="relative flex size-5 items-center justify-center rounded-[5px] bg-border text-muted-foreground">
        <Icon className="size-3" />
        <span className="absolute top-full left-1/2 h-2 w-px -translate-x-1/2 bg-border" />
      </span>
      <span className="text-[13px] text-neutral-500">{children}</span>
    </p>
  )
}
