"use client"

import { type ComponentProps, createContext, useContext } from "react"
import { Popover as PopoverPrimitive } from "@base-ui/react/popover"
import { AnimatePresence, motion } from "motion/react"
import { fast, popFrom, useOpenState, withAnimated, useAnimatedAttr } from "@/lib/motion"
import { cn } from "@/lib/utils"

const PopoverContext = createContext(false)

function PopoverBase({
  open,
  defaultOpen,
  onOpenChange,
  ...props
}: PopoverPrimitive.Root.Props) {
  const [isOpen, handleOpenChange] = useOpenState({
    open,
    defaultOpen,
    onOpenChange,
  })

  return (
    <PopoverContext.Provider value={isOpen}>
      <PopoverPrimitive.Root
        data-slot="popover"
        open={isOpen}
        onOpenChange={handleOpenChange}
        {...props}
      />
    </PopoverContext.Provider>
  )
}

function PopoverTrigger({ ...props }: PopoverPrimitive.Trigger.Props) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

function PopoverContent({
  className,
  align = "center",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 4,
  ...props
}: PopoverPrimitive.Popup.Props &
  Pick<
    PopoverPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >) {
  const off = useAnimatedAttr()
  const isOpen = useContext(PopoverContext)

  return (
    <AnimatePresence>
      {isOpen && (
        <PopoverPrimitive.Portal {...off} keepMounted>
          <PopoverPrimitive.Positioner
            hidden={false}
            align={align}
            alignOffset={alignOffset}
            side={side}
            sideOffset={sideOffset}
            className="isolate z-50"
          >
            <PopoverPrimitive.Popup
              render={
                <motion.div
                  variants={popFrom(side)}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  transition={fast}
                />
              }
              data-slot="popover-content"
              className={cn(
                "z-50 flex w-72 origin-(--transform-origin) flex-col gap-2.5 rounded-lg bg-popover p-2.5 text-sm text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden",
                className
              )}
              {...props}
            />
          </PopoverPrimitive.Positioner>
        </PopoverPrimitive.Portal>
      )}
    </AnimatePresence>
  )
}

function PopoverHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="popover-header"
      className={cn("flex flex-col gap-0.5 text-sm", className)}
      {...props}
    />
  )
}

function PopoverTitle({ className, ...props }: PopoverPrimitive.Title.Props) {
  return (
    <PopoverPrimitive.Title
      data-slot="popover-title"
      className={cn("font-medium", className)}
      {...props}
    />
  )
}

function PopoverDescription({
  className,
  ...props
}: PopoverPrimitive.Description.Props) {
  return (
    <PopoverPrimitive.Description
      data-slot="popover-description"
      className={cn("text-muted-foreground", className)}
      {...props}
    />
  )
}

const Popover = withAnimated(PopoverBase)

export {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
}
