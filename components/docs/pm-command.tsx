import { CodeView } from "@/components/docs/code-view"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const runners = {
  npm: "npx",
  pnpm: "pnpm dlx",
  yarn: "yarn dlx",
  bun: "bunx --bun",
}

// shadcn CLI command, one tab per package manager.
export function PmCommand({ args }: { args: string }) {
  return (
    <Tabs defaultValue="npm" className="gap-0 overflow-hidden rounded-xl border bg-muted/40">
      <TabsList variant="line" className="h-10 w-full justify-start border-b px-2">
        {Object.keys(runners).map((pm) => (
          <TabsTrigger key={pm} value={pm} className="flex-none px-3">
            {pm}
          </TabsTrigger>
        ))}
      </TabsList>
      {Object.entries(runners).map(([pm, run]) => (
        <TabsContent key={pm} value={pm}>
          <CodeView
            code={`${run} shadcn@latest add ${args}`}
            language="bash"
            className="rounded-none border-0 bg-transparent"
          />
        </TabsContent>
      ))}
    </Tabs>
  )
}
