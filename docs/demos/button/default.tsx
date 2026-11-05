import { Button } from "@/components/ui/button"

export const controls = {
  Style: {
    variant: {
      value: "default",
      options: ["default", "outline", "secondary", "ghost", "destructive", "link"],
    },
    size: { value: "default", options: ["xs", "sm", "default", "lg"] },
  },
  Content: {
    label: { value: "Button" },
    disabled: { value: false },
  },
}

type Props = {
  variant?: "default" | "outline" | "secondary" | "ghost" | "destructive" | "link"
  size?: "xs" | "sm" | "default" | "lg"
  disabled?: boolean
  label?: string
}

export default function Demo({ variant, size, disabled, label = "Button" }: Props) {
  return (
    <Button variant={variant} size={size} disabled={disabled}>
      {label}
    </Button>
  )
}
