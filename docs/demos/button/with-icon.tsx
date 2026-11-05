// note: Set data-icon="inline-start" or "inline-end" on the icon to adjust padding.

import { MailIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Demo() {
  return (
    <Button variant="outline">
      <MailIcon data-icon="inline-start" />
      Login with email
    </Button>
  )
}
