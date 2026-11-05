import { CheckIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function Demo() {
  return (
    <Badge variant="secondary">
      <CheckIcon data-icon="inline-start" />
      Verified
    </Badge>
  )
}
