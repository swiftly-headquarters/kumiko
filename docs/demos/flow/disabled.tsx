// title: Disabled nodes
// note: A disabled node and the connectors that touch it fade out.

"use client"

import { Flow, FlowNode, FlowParallel } from "@/components/ui/flow"

export default function Demo() {
  return (
    <Flow>
      <FlowNode>Request</FlowNode>
      <FlowParallel>
        <FlowNode>Primary handler</FlowNode>
        <FlowNode disabled>Backup handler</FlowNode>
      </FlowParallel>
      <FlowNode>Response</FlowNode>
    </Flow>
  )
}
