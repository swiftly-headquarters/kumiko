import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

export default function Demo() {
  return (
    <ScrollArea className="w-96 max-w-full rounded-md border">
      <div className="flex w-max gap-4 p-4">
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            className="flex size-24 shrink-0 items-center justify-center rounded-md bg-muted text-sm"
          >
            {i + 1}
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
