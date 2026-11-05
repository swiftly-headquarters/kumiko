import type { Metadata } from "next"
import { ExternalLinkIcon } from "lucide-react"

import { ButtonLink } from "@/components/docs/button-link"
import { CodeView } from "@/components/docs/code-view"
import { Navbar } from "@/components/docs/navbar"
import { PmCommand } from "@/components/docs/pm-command"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { blocks } from "@/lib/docs/blocks"
import { readRegistryItem } from "@/lib/docs/source"

export const metadata: Metadata = {
  title: "Blocks",
  description: "Ready-made layouts built from Kumiko components.",
}

export default function Page() {
  return (
    <>
      <Navbar />
      <main className="mx-auto flex max-w-[90rem] flex-col gap-16 px-4 py-12 md:px-6">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">Blocks</h1>
          <p className="text-muted-foreground">
            Ready-made layouts built from Kumiko components. Copy one into your
            app and make it yours.
          </p>
        </header>
        {blocks.map((b) => {
          const item = readRegistryItem(b.name)
          return (
            <section key={b.name} id={b.name} className="flex flex-col gap-4">
              <div className="flex flex-wrap items-end justify-between gap-2">
                <div>
                  <h2 className="text-xl font-semibold">{b.title}</h2>
                  <p className="text-sm text-muted-foreground">
                    {b.description}
                  </p>
                </div>
                <ButtonLink
                  href={`/view/${b.name}`}
                  target="_blank"
                  variant="outline"
                  size="sm"
                >
                  Open
                  <ExternalLinkIcon />
                </ButtonLink>
              </div>
              <PmCommand
                args={`https://kumiko.swiftlylabs.net/r/${b.name}.json`}
              />
              <Tabs defaultValue="preview" className="gap-2">
                <TabsList>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                  <TabsTrigger value="code">Code</TabsTrigger>
                </TabsList>
                <TabsContent value="preview">
                  <iframe
                    src={`/view/${b.name}`}
                    title={b.title}
                    loading="lazy"
                    className="h-[720px] w-full rounded-xl border bg-background"
                  />
                </TabsContent>
                <TabsContent value="code" className="flex flex-col gap-4">
                  {item.files.map((f) => (
                    <div key={f.path} className="flex flex-col gap-2">
                      <p className="font-mono text-xs text-muted-foreground">
                        {f.path}
                      </p>
                      <CodeView code={f.content} />
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </section>
          )
        })}
      </main>
    </>
  )
}
