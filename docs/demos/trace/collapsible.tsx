// note: Wrap a TraceLine in TraceCollapsibleTrigger to reveal details.

import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/components/ui/trace"
import { BrainIcon } from "lucide-react"

export default function Demo() {
  return (
    <Trace className="max-w-md">
      <TraceCollapsible>
        <TraceCollapsibleTrigger>
          <TraceLine>
            <TraceIcon>
              <BrainIcon />
            </TraceIcon>
            <TraceTitle>Reasoning</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          The user wants a summary, so I will first list the unread emails and
          then group them by sender.
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </Trace>
  )
}
