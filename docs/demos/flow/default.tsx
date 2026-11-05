// title: Sequential

"use client"

import { Flow, FlowNode } from "@/components/ui/flow"

export default function Demo() {
  return (
    <Flow>
      <FlowNode>Step 1</FlowNode>
      <FlowNode>Step 2</FlowNode>
      <FlowNode>Step 3</FlowNode>
    </Flow>
  )
}
