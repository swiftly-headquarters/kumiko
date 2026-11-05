// title: Parallel branches

"use client"

import { Flow, FlowList, FlowNode, FlowParallel } from "@/components/ui/flow"

export default function Demo() {
  return (
    <Flow>
      <FlowNode>Start</FlowNode>
      <FlowParallel>
        <FlowList>
          <FlowNode>Branch A1</FlowNode>
          <FlowNode>Branch A2</FlowNode>
        </FlowList>
        <FlowNode>Branch B</FlowNode>
        <FlowNode>Branch C</FlowNode>
      </FlowParallel>
      <FlowNode>End</FlowNode>
    </Flow>
  )
}
