import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export const controls = {
  size: { value: "default", options: ["sm", "default"] },
  disabled: { value: false },
}

type Props = { size?: "sm" | "default"; disabled?: boolean }

export default function Demo({ size, disabled }: Props) {
  return (
    <div className="flex items-center gap-2">
      <Switch id="airplane" size={size} disabled={disabled} />
      <Label htmlFor="airplane">Airplane mode</Label>
    </div>
  )
}
