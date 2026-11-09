import { components } from "@/lib/docs/components"
import { getPresets } from "@/lib/builder/catalog"

export const dynamicParams = false

export const generateStaticParams = () => components.map((c) => ({ slug: c.slug }))

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const presets = getPresets(slug)
  return presets ? Response.json(presets) : new Response(null, { status: 404 })
}
