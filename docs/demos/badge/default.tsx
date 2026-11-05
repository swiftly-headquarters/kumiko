import { Badge } from "@/components/ui/badge"

export const controls = {
  variant: {
    value: "default",
    options: ["default", "secondary", "destructive", "outline", "ghost", "link"],
  },
  label: { value: "Badge" },
}

type Props = {
  variant?: "default" | "secondary" | "destructive" | "outline" | "ghost" | "link"
  label?: string
}

export default function Demo({ variant, label = "Badge" }: Props) {
  return <Badge variant={variant}>{label}</Badge>
}
