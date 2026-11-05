import { Progress } from "@/components/ui/progress"

export const controls = {
  value: { value: 60, min: 0, max: 100, step: 1 },
}

export default function Demo({ value = 60 }: { value?: number }) {
  return <Progress value={value} className="w-72" />
}
