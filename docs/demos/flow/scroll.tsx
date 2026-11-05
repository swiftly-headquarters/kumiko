// title: Large diagrams
// note: A diagram wider than its container scrolls inside it.

"use client"

import { Flow, FlowNode } from "@/components/ui/flow"

const steps = [
  "Start",
  "Authenticate",
  "Validate",
  "Transform",
  "Process",
  "Store",
  "Notify",
  "Log",
  "Complete",
]

export default function Demo() {
  return (
    <Flow className="rounded-lg border">
      {steps.map((s) => (
        <FlowNode key={s}>{s}</FlowNode>
      ))}
    </Flow>
  )
}
