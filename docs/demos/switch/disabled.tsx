import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function Demo() {
  return (
    <div className="flex items-center gap-2">
      <Switch id="disabled" disabled />
      <Label htmlFor="disabled">Disabled</Label>
    </div>
  )
}
