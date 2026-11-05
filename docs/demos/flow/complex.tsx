// title: Pipeline

"use client"

import { Flow, FlowNode, FlowParallel } from "@/components/ui/flow"

export default function Demo() {
  return (
    <Flow align="center">
      <FlowParallel>
        <FlowNode>HTTP trigger</FlowNode>
        <FlowNode>Cron trigger</FlowNode>
      </FlowParallel>
      <FlowNode>Process request</FlowNode>
      <FlowParallel>
        <FlowNode>Log analytics</FlowNode>
        <FlowNode>Update cache</FlowNode>
        <FlowNode>Send notification</FlowNode>
      </FlowParallel>
      <FlowNode>Complete</FlowNode>
    </Flow>
  )
}
