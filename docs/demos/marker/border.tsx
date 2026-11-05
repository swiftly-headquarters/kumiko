import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker"
import { HistoryIcon } from "lucide-react"

export default function Demo() {
  return (
    <Marker variant="border" className="max-w-md">
      <MarkerIcon>
        <HistoryIcon />
      </MarkerIcon>
      <MarkerContent>Earlier messages are hidden</MarkerContent>
    </Marker>
  )
}
