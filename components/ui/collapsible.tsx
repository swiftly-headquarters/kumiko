"use client"

import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible"
import { motion } from "motion/react"
import { fast, usePress, withAnimated } from "@/lib/motion"

function CollapsibleBase({ ...props }: CollapsiblePrimitive.Root.Props) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />
}

function CollapsibleTrigger({ ...props }: CollapsiblePrimitive.Trigger.Props) {
  const press = usePress()
  return (
    <CollapsiblePrimitive.Trigger
      data-slot="collapsible-trigger"
      render={<motion.button {...press} transition={fast} />}
      {...props}
    />
  )
}

function CollapsibleContent({ ...props }: CollapsiblePrimitive.Panel.Props) {
  return (
    <CollapsiblePrimitive.Panel data-slot="collapsible-content" {...props} />
  )
}

const Collapsible = withAnimated(CollapsibleBase)

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
