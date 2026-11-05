import { CodeView } from "@/components/docs/code-view"
import type { Controls } from "@/components/docs/controls-panel"
import { Preview } from "@/components/docs/preview"
import { hasControls, readDemoSource } from "@/lib/docs/source"

export async function DemoBlock({ slug, demo }: { slug: string; demo: string }) {
  const code = readDemoSource(slug, demo)
  // Only import the module when it declares controls; most demos don't.
  const controls: Controls | undefined = hasControls(slug, demo)
    ? (await import(`@/docs/demos/${slug}/${demo}`)).controls
    : undefined
  return (
    <Preview
      slug={slug}
      demo={demo}
      controls={controls}
      source={<CodeView code={code} />}
    />
  )
}
