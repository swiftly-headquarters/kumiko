// title: Parallel alignment
// note: Use align="end" on FlowParallel to line up differently sized nodes on the right.

"use client"

import { Flow, FlowNode, FlowParallel } from "@/components/ui/flow"

export default function Demo() {
  return (
    <Flow>
      <FlowNode>Start</FlowNode>
      <FlowParallel align="end">
        <FlowNode>Short</FlowNode>
        <FlowNode>Medium length</FlowNode>
        <FlowNode>Very long node name</FlowNode>
      </FlowParallel>
      <FlowNode>End</FlowNode>
    </Flow>
  )
}
