"use client"

import { createContext, useContext } from "react"
import { PreviewCard as PreviewCardPrimitive } from "@base-ui/react/preview-card"
import { AnimatePresence, motion } from "motion/react"
import { fast, popFrom, useOpenState, withAnimated, useAnimatedAttr } from "@/lib/motion"
import { cn } from "@/lib/utils"

const HoverCardContext = createContext(false)

function HoverCardBase({
  open,
  defaultOpen,
  onOpenChange,
  ...props
}: PreviewCardPrimitive.Root.Props) {
  const [isOpen, handleOpenChange] = useOpenState({
    open,
    defaultOpen,
    onOpenChange,
  })

  return (
    <HoverCardContext.Provider value={isOpen}>
      <PreviewCardPrimitive.Root
        data-slot="hover-card"
        open={isOpen}
        onOpenChange={handleOpenChange}
        {...props}
      />
    </HoverCardContext.Provider>
  )
}

function HoverCardTrigger({ ...props }: PreviewCardPrimitive.Trigger.Props) {
  return (
    <PreviewCardPrimitive.Trigger data-slot="hover-card-trigger" {...props} />
  )
}

function HoverCardContent({
  className,
  side = "bottom",
  sideOffset = 4,
  align = "center",
  alignOffset = 4,
  ...props
}: PreviewCardPrimitive.Popup.Props &
  Pick<
    PreviewCardPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >) {
  const off = useAnimatedAttr()
  const isOpen = useContext(HoverCardContext)

  return (
    <AnimatePresence>
      {isOpen && (
        <PreviewCardPrimitive.Portal {...off} keepMounted data-slot="hover-card-portal">
          <PreviewCardPrimitive.Positioner
            hidden={false}
            align={align}
            alignOffset={alignOffset}
            side={side}
            sideOffset={sideOffset}
            className="isolate z-50"
          >
            <PreviewCardPrimitive.Popup
              render={
                <motion.div
                  variants={popFrom(side)}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  transition={fast}
                />
              }
              data-slot="hover-card-content"
              className={cn(
                "z-50 w-64 origin-(--transform-origin) rounded-lg bg-popover p-2.5 text-sm text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden",
                className
              )}
              {...props}
            />
          </PreviewCardPrimitive.Positioner>
        </PreviewCardPrimitive.Portal>
      )}
    </AnimatePresence>
  )
}

const HoverCard = withAnimated(HoverCardBase)

export { HoverCard, HoverCardTrigger, HoverCardContent }
