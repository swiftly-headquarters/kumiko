import Link from "next/link"

import { CodeView } from "@/components/docs/code-view"
import { PmCommand } from "@/components/docs/pm-command"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getComponent } from "@/lib/docs/components"
import { readRegistryItem } from "@/lib/docs/source"

export function Install({ slug }: { slug: string }) {
  const item = readRegistryItem(slug)

  return (
    <Tabs defaultValue="cli" className="gap-4">
      <TabsList variant="line">
        <TabsTrigger value="cli">CLI</TabsTrigger>
        <TabsTrigger value="manual">Manual</TabsTrigger>
      </TabsList>
      <TabsContent value="cli">
        <PmCommand args={`https://kumiko.swiftlylabs.net/r/${slug}.json`} />
      </TabsContent>
      <TabsContent value="manual" className="flex flex-col gap-4">
        {item.dependencies.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">
              Install the dependencies:
            </p>
            <CodeView
              code={`npm install ${item.dependencies.join(" ")}`}
              language="bash"
            />
          </div>
        )}
        {item.registryDependencies.length > 0 && (
          <p className="text-sm text-muted-foreground">
            This component also needs these kumiko items:{" "}
            {item.registryDependencies.map((d, i) => {
              const entry = getComponent(d)
              return (
                <span key={d}>
                  {i > 0 && ", "}
                  {entry ? (
                    <Link
                      href={`/components/${d}`}
                      className="font-medium text-foreground underline"
                    >
                      {entry.title}
                    </Link>
                  ) : (
                    <code className="font-mono text-foreground">{d}</code>
                  )}
                </span>
              )
            })}
          </p>
        )}
        {item.files.map((f) => (
          <div key={f.path} className="flex flex-col gap-2">
            <p className="font-mono text-xs text-muted-foreground">{f.path}</p>
            <CodeView code={f.content} />
          </div>
        ))}
      </TabsContent>
    </Tabs>
  )
}
