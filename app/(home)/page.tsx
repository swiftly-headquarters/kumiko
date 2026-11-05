import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { ButtonLink } from "@/components/docs/button-link"
import { Intro } from "@/components/docs/intro"
import { HomeCard } from "@/components/docs/home-card"
import { Navbar } from "@/components/docs/navbar"
import { PmCommand } from "@/components/docs/pm-command"
import { Rise } from "@/components/docs/rise"
import { components, groups } from "@/lib/docs/components"

// First visual component of each group.
const featured = groups.flatMap((g) => {
  const c = components.find((c) => c.group === g.id && c.visual)
  return c ? [c] : []
})

export default function Page() {
  return (
    <>
      <Intro />
      <Navbar />
      <main className="mx-auto flex max-w-6xl flex-col items-center px-4 md:px-6">
        <section className="flex w-full min-w-0 flex-col items-center gap-6 py-20 text-center md:py-28">
          <Rise>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance md:text-6xl">
              Kumiko, the animated UI library by SwiftlyLabs
            </h1>
          </Rise>
          <Rise index={1}>
            <p className="max-w-xl text-lg text-balance text-muted-foreground">
              {components.length} components, crafted by SwiftlyLabs
              on ShadCN and Motion. Add any of them to your project in one
              command.
            </p>
          </Rise>
          <Rise index={2} className="w-full max-w-xl text-left">
            <PmCommand args="https://kumiko.swiftlylabs.net/r/button.json" />
          </Rise>
          <Rise index={3} className="flex flex-wrap justify-center gap-3">
            <ButtonLink
              href="/components/accordion"
              size="lg"
              className="rounded-full px-5"
            >
              Get started
              <ArrowRightIcon />
            </ButtonLink>
            <ButtonLink
              href="/components"
              variant="outline"
              size="lg"
              className="rounded-full px-5"
            >
              Browse components
            </ButtonLink>
          </Rise>
        </section>

        <section className="flex w-full flex-col items-center gap-10 pb-24">
          <Rise scroll className="flex flex-col items-center gap-3 text-center">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Every component, alive.
            </h2>
            <p className="max-w-lg text-muted-foreground">
              Motion is built in. Open, close, hover and press states all
              animate out of the box.
            </p>
          </Rise>
          <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((c, i) => (
              <Rise key={c.slug} scroll index={i % 3}>
                <HomeCard entry={c} />
              </Rise>
            ))}
          </div>
          <ButtonLink href="/components" variant="ghost" className="rounded-full">
            See all {components.length} components
            <ArrowRightIcon />
          </ButtonLink>
        </section>
      </main>
      <footer className="border-t">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 text-sm text-muted-foreground md:px-6">
          <span>Kumiko by SwiftlyLabs</span>
          <Link href="/components" className="hover:text-foreground">
            Docs
          </Link>
        </div>
      </footer>
    </>
  )
}
