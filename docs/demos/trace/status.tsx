import { Trace, TraceIcon, TraceLine, TraceTitle } from "@/components/ui/trace"
import { Spinner } from "@/components/ui/spinner"
import { AlertCircleIcon, ClockIcon } from "lucide-react"

export default function Demo() {
  return (
    <Trace className="max-w-md">
      <TraceLine status="running">
        <TraceIcon>
          <Spinner />
        </TraceIcon>
        <TraceTitle>Running tests</TraceTitle>
      </TraceLine>
      <TraceLine status="error">
        <TraceIcon>
          <AlertCircleIcon />
        </TraceIcon>
        <TraceTitle>Request failed</TraceTitle>
      </TraceLine>
      <TraceLine status="pending">
        <TraceIcon>
          <ClockIcon />
        </TraceIcon>
        <TraceTitle>Waiting for approval</TraceTitle>
      </TraceLine>
    </Trace>
  )
}
