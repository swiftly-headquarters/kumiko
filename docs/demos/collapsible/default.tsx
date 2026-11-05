import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

export default function Demo() {
  return (
    <Collapsible className="flex w-full max-w-sm flex-col gap-2">
      <div className="flex items-center justify-between gap-4">
        <h4 className="text-sm font-medium">3 repositories starred</h4>
        <CollapsibleTrigger render={<Button variant="outline" size="sm" />}>
          Toggle
        </CollapsibleTrigger>
      </div>
      <div className="rounded-lg border px-3 py-2 text-sm">kumiko/ui</div>
      <CollapsibleContent className="flex flex-col gap-2">
        <div className="rounded-lg border px-3 py-2 text-sm">kumiko/docs</div>
        <div className="rounded-lg border px-3 py-2 text-sm">kumiko/cli</div>
      </CollapsibleContent>
    </Collapsible>
  )
}
