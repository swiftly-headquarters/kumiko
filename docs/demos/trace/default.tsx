import {
  Trace,
  TraceDescription,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/components/ui/trace"
import { BrainIcon, GlobeIcon, SearchIcon } from "lucide-react"

export default function Demo() {
  return (
    <Trace className="max-w-md">
      <TraceLine>
        <TraceIcon>
          <BrainIcon />
        </TraceIcon>
        <TraceTitle>Thought for 4s</TraceTitle>
      </TraceLine>
      <TraceLine>
        <TraceIcon>
          <SearchIcon />
        </TraceIcon>
        <TraceTitle>Searched the docs</TraceTitle>
        <TraceDescription>1.2s</TraceDescription>
      </TraceLine>
      <TraceLine>
        <TraceIcon>
          <GlobeIcon />
        </TraceIcon>
        <TraceTitle>Fetched 3 pages</TraceTitle>
        <TraceDescription>0.8s</TraceDescription>
      </TraceLine>
    </Trace>
  )
}
