import { Button } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

export default function Demo() {
  return (
    <HoverCard>
      <HoverCardTrigger render={<Button variant="link" />}>
        @kumiko
      </HoverCardTrigger>
      <HoverCardContent className="w-72">
        <div className="space-y-1">
          <h4 className="text-sm font-semibold">@kumiko</h4>
          <p className="text-sm">A component registry with motion built in.</p>
          <p className="text-xs text-muted-foreground">Joined December 2025</p>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
