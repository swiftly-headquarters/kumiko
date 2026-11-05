import { cn } from "@/lib/utils"

// No hook, so it stays a server component: `animated={false}` or an ancestor
// <Animations enabled={false}> sets data-animated="false", and globals.css
// turns the CSS animation off.
function Skeleton({
  className,
  animated,
  ...props
}: React.ComponentProps<"div"> & { animated?: boolean }) {
  return (
    <div
      data-slot="skeleton"
      data-animated={animated === false ? "false" : undefined}
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }
