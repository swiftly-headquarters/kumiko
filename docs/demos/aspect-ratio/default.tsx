import { AspectRatio } from "@/components/ui/aspect-ratio"

export default function Demo() {
  return (
    <AspectRatio ratio={16 / 9}>
      <div className="flex size-full items-center justify-center rounded-lg bg-muted text-sm text-muted-foreground">
        16 / 9
      </div>
    </AspectRatio>
  )
}
