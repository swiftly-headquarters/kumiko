import { ArrowUpIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Demo() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button size="xs">Extra small</Button>
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon" aria-label="Up">
        <ArrowUpIcon />
      </Button>
    </div>
  )
}
