import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { ButtonLink } from "@/components/docs/button-link"
import { Button } from "@/components/ui/button"
import type { ComponentEntry } from "@/lib/docs/types"

import { CodeView } from "@/components/docs/code-view"
import { CopyPage } from "@/components/docs/copy-page"
import { Rise } from "@/components/docs/rise"
import { Toc } from "@/components/docs/toc"
import { components, getComponent, groups } from "@/lib/docs/components"
import { pageToMarkdown } from "@/lib/docs/markdown"
import { exampleStart, sectionsFor } from "@/lib/docs/sections"
import { listExamples, readDemoSource, readProps } from "@/lib/docs/source"
import { DemoBlock } from "./_parts/demo-block"
import { Install } from "./_parts/install"
import { PropsTable } from "./_parts/props-table"
import { Section } from "./_parts/section"

export const dynamicParams = false

export function generateStaticParams() {
  return components.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const entry = getComponent((await params).slug)
  return entry ? { title: entry.title, description: entry.description } : {}
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const entry = getComponent(slug)
  if (!entry) notFound()
  const props = readProps(slug)
  const examples = listExamples(slug)
  const hasHero = examples.some((e) => e.demo === "default")

  // Ids/order come from sectionsFor() in lib/docs/sections.ts.
  const sections = sectionsFor(entry, examples)
  const exampleIds = sections.slice(exampleStart(entry)).map((s) => s.id)

  // Sidebar order: by group, then entry order.
  const ordered = groups.flatMap((g) =>
    components.filter((c) => c.group === g.id)
  )
  const i = ordered.indexOf(entry)
  const prev = ordered[i - 1]
  const next = ordered[i + 1]

  return (
    <div className="flex justify-center gap-10 md:pl-6">
      <article className="flex w-full max-w-3xl min-w-0 flex-col gap-14 py-8">
        <Rise className="flex flex-col gap-3">
          <p className="text-sm text-muted-foreground">
            <Link href="/components" className="hover:text-foreground">
              Components
            </Link>
            <ChevronRightIcon className="mx-1 inline size-3.5" />
            <span className="text-foreground">{entry.title}</span>
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">
            {entry.title}
          </h1>
          <p className="text-lg text-muted-foreground">{entry.description}</p>
          <div className="mt-2 flex items-center gap-2">
            <CopyPage markdown={pageToMarkdown(props, examples, entry)} />
            <div className="ml-auto flex gap-1">
              <PagerLink entry={prev} dir="prev" />
              <PagerLink entry={next} dir="next" />
            </div>
          </div>
        </Rise>

        {entry.visual && hasHero && (
          <Section id="preview" title="Preview">
            <DemoBlock slug={slug} demo="default" />
          </Section>
        )}

        <Section id="installation" title="Installation">
          <Install slug={slug} />
        </Section>

        <Section id="usage" title="Usage">
          <CodeView code={readDemoSource(slug, "default")} />
        </Section>

        {entry.visual &&
          examples.map((e, i) => {
            return (
              <Section
                key={e.demo}
                id={exampleIds[i]}
                title={e.title}
                note={e.note}
              >
                <DemoBlock slug={slug} demo={e.demo} />
              </Section>
            )
          })}

        <Section id="api-reference" title="API Reference">
          <PropsTable rows={props} />
        </Section>
        <nav aria-label="Pagination" className="flex justify-between gap-4 border-t pt-6 text-sm">
          {prev ? (
            <Link href={`/components/${prev.slug}`} className="flex flex-col gap-1">
              <span className="text-muted-foreground">Previous</span>
              <span className="font-medium">{prev.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link href={`/components/${next.slug}`} className="flex flex-col items-end gap-1">
              <span className="text-muted-foreground">Next</span>
              <span className="font-medium">{next.title}</span>
            </Link>
          )}
        </nav>
      </article>
      <aside className="sticky top-17 hidden h-[calc(100svh-4.25rem)] w-56 shrink-0 overflow-y-auto py-8 xl:block">
        <Toc items={sections} />
      </aside>
    </div>
  )
}

function PagerLink({
  entry,
  dir,
}: {
  entry?: ComponentEntry
  dir: "prev" | "next"
}) {
  const Icon = dir === "prev" ? ChevronLeftIcon : ChevronRightIcon
  const label = dir === "prev" ? "Previous" : "Next"
  if (!entry)
    return (
      <Button variant="outline" size="icon-sm" disabled aria-label={label}>
        <Icon />
      </Button>
    )
  return (
    <ButtonLink
      href={`/components/${entry.slug}`}
      aria-label={`${label}: ${entry.title}`}
      variant="outline"
      size="icon-sm"
    >
      <Icon />
    </ButtonLink>
  )
}
