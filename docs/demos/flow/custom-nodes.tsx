// title: Custom nodes
// note: Pass `render` to replace the default node element and its styles. Use align="center" when nodes have different heights.

"use client"

import { Flow, FlowNode } from "@/components/ui/flow"

export default function Demo() {
  return (
    <Flow align="center">
      <FlowNode render={<div className="size-4 rounded-full bg-border" />} />
      <FlowNode
        render={
          <div className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground" />
        }
      >
        my-endpoint
      </FlowNode>
      <FlowNode
        render={
          <div className="rounded-lg bg-card px-3 py-6 text-sm ring-1 ring-foreground/10" />
        }
      >
        Taller node
      </FlowNode>
    </Flow>
  )
}
