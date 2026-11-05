import { InfoIcon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export const controls = {
  variant: { value: "default", options: ["default", "destructive"] },
  title: { value: "Heads up" },
  description: { value: "You can add components to your app with the CLI." },
}

type Props = {
  variant?: "default" | "destructive"
  title?: string
  description?: string
}

export default function Demo({
  variant,
  title = "Heads up",
  description = "You can add components to your app with the CLI.",
}: Props) {
  return (
    <Alert variant={variant} className="max-w-md">
      <InfoIcon />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  )
}
