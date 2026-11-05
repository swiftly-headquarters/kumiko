// title: Vertical

"use client"

import { Flow, FlowNode, FlowParallel } from "@/components/ui/flow"

export default function Demo() {
  return (
    <Flow orientation="vertical" align="center">
      <FlowNode>Start</FlowNode>
      <FlowParallel>
        <FlowNode>Branch A</FlowNode>
        <FlowNode>Branch B</FlowNode>
        <FlowNode>Branch C</FlowNode>
      </FlowParallel>
      <FlowNode>End</FlowNode>
    </Flow>
  )
}
