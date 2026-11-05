// title: Arrows
// note: Add `arrows` to show direction. Works in both orientations.

"use client"

import { Flow, FlowList, FlowNode, FlowParallel } from "@/components/ui/flow"

export default function Demo() {
  return (
    <Flow arrows align="center">
      <FlowNode>Request</FlowNode>
      <FlowParallel>
        <FlowList>
          <FlowNode>Validate</FlowNode>
          <FlowNode>Authorize</FlowNode>
        </FlowList>
        <FlowNode>Rate limit</FlowNode>
      </FlowParallel>
      <FlowNode>Response</FlowNode>
    </Flow>
  )
}
