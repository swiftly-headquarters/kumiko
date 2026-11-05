import Link from "next/link"
import { ArrowUpRightIcon } from "lucide-react"

import { DemoRender } from "@/components/docs/demo-render"
import type { ComponentEntry } from "@/lib/docs/types"

// Link is a sibling overlay, not a wrapper: demos contain their own <a>,
// <button> and <input>, which are invalid inside an <a>.
export function HomeCard({ entry }: { entry: ComponentEntry }) {
  return (
    <div className="group relative flex flex-col rounded-2xl bg-accent p-1.5">
      <Link
        href={`/components/${entry.slug}`}
        aria-label={entry.title}
        className="absolute inset-0 z-10 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      />
      {entry.visual ? (
        <div
          aria-hidden
          inert
          className="pointer-events-none flex aspect-[4/3] overflow-hidden rounded-lg bg-background"
        >
          {/* m-auto centres short demos; tall ones overflow at the bottom, not both ends */}
          <div className="m-auto origin-center scale-75">
            <DemoRender slug={entry.slug} demo="default" />
          </div>
        </div>
      ) : (
        <p className="flex aspect-[4/3] items-center justify-center rounded-lg bg-background px-6 text-center text-sm text-muted-foreground">
          {entry.description}
        </p>
      )}
      <div className="flex items-center gap-2 px-2.5 pt-2.5 pb-1.5 text-sm font-medium">
        <span className="flex-1 truncate">{entry.title}</span>
        <ArrowUpRightIcon className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
      </div>
    </div>
  )
}
