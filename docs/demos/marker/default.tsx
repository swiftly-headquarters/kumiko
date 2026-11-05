import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker"
import { UserPlusIcon } from "lucide-react"

export default function Demo() {
  return (
    <Marker className="max-w-md">
      <MarkerIcon>
        <UserPlusIcon />
      </MarkerIcon>
      <MarkerContent>Ana joined the conversation</MarkerContent>
    </Marker>
  )
}
