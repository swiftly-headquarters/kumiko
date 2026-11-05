import { BoldIcon } from "lucide-react"
import { Toggle } from "@/components/ui/toggle"

export default function Demo() {
  return (
    <Toggle aria-label="Toggle bold">
      <BoldIcon />
    </Toggle>
  )
}
