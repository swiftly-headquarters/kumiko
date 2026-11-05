import type { Metadata } from "next"

import { Rise } from "@/components/docs/rise"
import { HomeCard } from "@/components/docs/home-card"
import { components, groups } from "@/lib/docs/components"

export const metadata: Metadata = { title: "Components" }

export default function Page() {
  return (
    <div className="flex flex-col gap-12 py-8 md:pl-6">
      <Rise className="flex max-w-2xl flex-col gap-3">
        <h1 className="text-4xl font-semibold tracking-tight">Components</h1>
        <p className="text-lg text-muted-foreground">
          {components.length} animated components built on Base UI and Motion.
          Add any of them to your project with the shadcn CLI.
        </p>
      </Rise>
      {groups.map((g) => (
        <section key={g.id} id={g.id} className="flex scroll-mt-24 flex-col gap-4">
          <h2 className="text-2xl font-semibold tracking-tight">{g.title}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {components
              .filter((c) => c.group === g.id)
              .map((c, i) => (
                <Rise key={c.slug} scroll index={i % 3}>
                  <HomeCard entry={c} />
                </Rise>
              ))}
          </div>
        </section>
      ))}
    </div>
  )
}
