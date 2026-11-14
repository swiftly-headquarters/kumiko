"use client"

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import { motion } from "motion/react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { fast, usePress, withAnimated } from "@/lib/motion"

function TabsBase({
  className,
  orientation = "horizontal",
  ...props
}: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      className={cn(
        "group/tabs flex gap-2 data-horizontal:flex-col",
        className
      )}
      {...props}
    />
  )
}

const tabsListVariants = cva(
  "group/tabs-list relative inline-flex w-fit items-center justify-center rounded-lg p-0.5 text-muted-foreground group-data-horizontal/tabs:h-9 group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col data-[variant=line]:rounded-none",
  {
    variants: {
      variant: {
        default: "bg-muted",
        line: "gap-1 bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function TabsList({
  className,
  variant = "default",
  children,
  ...props
}: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    >
      <TabsPrimitive.Indicator
        data-slot="tabs-indicator"
        className="absolute top-(--active-tab-top) left-(--active-tab-left) h-(--active-tab-height) w-(--active-tab-width) rounded-md bg-background shadow-sm transition-[left,top,width,height] duration-250 ease-out group-data-[variant=line]/tabs-list:top-auto group-data-[variant=line]/tabs-list:bottom-[-5px] group-data-[variant=line]/tabs-list:h-0.5 group-data-[variant=line]/tabs-list:rounded-none group-data-[variant=line]/tabs-list:bg-foreground group-data-[variant=line]/tabs-list:shadow-none group-data-vertical/tabs:group-data-[variant=line]/tabs-list:top-(--active-tab-top) group-data-vertical/tabs:group-data-[variant=line]/tabs-list:right-[-4px] group-data-vertical/tabs:group-data-[variant=line]/tabs-list:left-auto group-data-vertical/tabs:group-data-[variant=line]/tabs-list:h-(--active-tab-height) group-data-vertical/tabs:group-data-[variant=line]/tabs-list:w-0.5 dark:group-data-[variant=default]/tabs-list:border dark:group-data-[variant=default]/tabs-list:border-input dark:group-data-[variant=default]/tabs-list:bg-input/30"
      />
      {children}
    </TabsPrimitive.List>
  )
}

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  const press = usePress()
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        "relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2.5 py-0.5 text-sm font-medium whitespace-nowrap text-foreground/60 transition-all group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 has-data-[icon=inline-end]:pr-1 has-data-[icon=inline-start]:pl-1 aria-disabled:pointer-events-none aria-disabled:opacity-50 dark:text-muted-foreground dark:hover:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        "z-10 data-active:text-foreground dark:data-active:text-foreground",
        className
      )}
      render={<motion.button {...press} transition={fast} />}
      {...props}
    />
  )
}

function TabsContent({
  className,
  children,
  ...props
}: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn("flex-1 text-sm outline-none", className)}
      {...props}
    >
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={fast}
      >
        {children}
      </motion.div>
    </TabsPrimitive.Panel>
  )
}

const Tabs = withAnimated(TabsBase)

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants }
