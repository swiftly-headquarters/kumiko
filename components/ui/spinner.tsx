import { cn } from "@/lib/utils"
import { Loader2Icon } from "lucide-react"

// Same scheme as Skeleton: `animated={false}` or an ancestor
// <Animations enabled={false}> stops the spin via globals.css.
function Spinner({
  className,
  animated,
  ...props
}: React.ComponentProps<"svg"> & { animated?: boolean }) {
  return (
    <Loader2Icon
      data-slot="spinner"
      data-animated={animated === false ? "false" : undefined}
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  )
}

export { Spinner }
