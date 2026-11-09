import {
  createMcpHandler,
  hostHeaderValidationResponse,
  localhostAllowedHostnames,
  McpServer,
  originValidationResponse,
} from "@modelcontextprotocol/server"
import { icons } from "lucide-react"
import * as z from "zod"

import { getCatalog, getPresets } from "@/lib/builder/catalog"
import {
  ICONS,
  REGISTRY,
  UI,
  encode,
  installArgs,
  isJsx,
  read,
  toCode,
  valid,
  type Node,
} from "@/lib/builder/tree"

const FORMAT = `A page is one JSON node tree. A node is one of:
- a component: { "m": "@/components/ui/<slug>", "n": "<ExportName>", "p": { props }, "c": [children] }
- an icon: { "m": "lucide-react", "n": "<IconName>Icon", "p": { "className": "size-4" } }
- a chart part: { "m": "recharts", "n": "<Name>", "p": { props } }
- a plain element: { "n": "<tag>", "p": { "className": "..." }, "c": [children] }, tags: div span p section header footer main nav article aside h1-h6 ul ol li a img strong em small code pre blockquote figure label hr table parts
- text: { "t": "Hello" }
Props are JSON. A prop that takes JSX (for example render) is { "$jsx": node }. Style with Tailwind in className.
Plain elements take only className, style, id, role, title, alt, src, href, target, rel, type, width, height, aria-* and data-*. No event handlers.
The root is usually { "n": "div", "p": { "className": "flex min-h-svh flex-col gap-6 p-6" }, "c": [...] }. Ids are optional.`

const text = (s: string) => ({ content: [{ type: "text" as const, text: s }] })
const fail = (s: string) => ({ ...text(s), isError: true })

// valid() checks shape and safety; this adds the names the renderer can resolve.
function unknownNames(root: Node): string[] {
  const parts = new Map(getCatalog().entries.map((e) => [UI + e.slug, new Set(e.parts.map((p) => p.name))]))
  const out = new Set<string>()
  const walkValue = (v: unknown): void => {
    if (isJsx(v)) walk(v.$jsx)
    else if (Array.isArray(v)) v.forEach(walkValue)
    else if (v && typeof v === "object") Object.values(v).forEach(walkValue)
  }
  const walk = (n: Node) => {
    if (n.m?.startsWith(UI)) {
      const names = parts.get(n.m)
      if (!names) out.add(`module ${n.m}`)
      else if (!names.has(n.n!)) out.add(`${n.n} in ${n.m} (has ${[...names].join(", ")})`)
    } else if (n.m === ICONS && !(n.n! in icons) && !(n.n!.replace(/^Lucide|Icon$/g, "") in icons))
      out.add(`icon ${n.n}`)
    walkValue(n.p)
    n.c?.forEach(walk)
  }
  walk(root)
  return [...out]
}

function server(origin: string) {
  const mcp = new McpServer({ name: "kumiko-builder", version: "0.0.1" })

  mcp.registerTool(
    "list_components",
    {
      title: "List components",
      description: "Lists every Kumiko UI component with its slug, group, description and parts. Call get_component for props and examples.",
      annotations: { readOnlyHint: true },
    },
    async () => {
      const { groups, entries } = getCatalog()
      const lines = groups.map((g) =>
        [`## ${g.title}`, ...entries.filter((e) => e.group === g.id).map((e) => `- ${e.slug}: ${e.description} Parts: ${e.parts.map((p) => p.name).join(", ")}`)].join("\n")
      )
      return text(`${lines.join("\n\n")}\n\n${FORMAT}`)
    }
  )

  mcp.registerTool(
    "get_component",
    {
      title: "Get component",
      description: "Returns a component's parts, their props with allowed values, and example node trees taken from the docs. Copy the examples' structure.",
      inputSchema: z.object({ slug: z.string().describe("Component slug from list_components, for example card") }),
      annotations: { readOnlyHint: true },
    },
    async ({ slug }) => {
      const entry = getCatalog().entries.find((e) => e.slug === slug)
      if (!entry) return fail(`No component "${slug}". Call list_components for the slugs.`)
      return text(
        JSON.stringify({
          module: UI + slug,
          description: entry.description,
          parts: entry.parts,
          examples: getPresets(slug),
        })
      )
    }
  )

  mcp.registerTool(
    "build_page",
    {
      title: "Build page",
      description: `Checks a page and returns a link that opens it, a link to edit it in the builder, the shadcn install command and the page source.\n\n${FORMAT}`,
      inputSchema: z.object({ page: z.record(z.string(), z.unknown()).describe("Root node of the page") }),
    },
    async ({ page }) => {
      if (!valid(page))
        return fail(`The page is not valid or uses something the builder does not allow.\n\n${FORMAT}`)
      const missing = unknownNames(page)
      if (missing.length) return fail(`Unknown names: ${missing.join("; ")}`)
      const hash = await encode(page)
      const back = await read(hash)
      if (!("tree" in back)) return fail("The page did not survive encoding.")
      const args = installArgs(back.tree, REGISTRY)
      return text(
        [
          `View: ${origin}/builder/view#${hash}`,
          `Edit: ${origin}/builder#${hash}`,
          hash.length > 1900 ? "Note: the link is long; chat apps may cut it short." : "",
          args ? `Install: npx shadcn@latest add ${args}` : "Install: nothing, plain HTML only.",
          `Code:\n${toCode(back.tree)}`,
        ]
          .filter(Boolean)
          .join("\n\n")
      )
    }
  )

  return mcp
}

const handler = createMcpHandler(({ requestInfo }) =>
  server(new URL(requestInfo?.url ?? "http://localhost:3000").origin)
)

const hosts = [...localhostAllowedHostnames(), "kumiko.swiftlylabs.net"]
const serve = (request: Request) =>
  hostHeaderValidationResponse(request, hosts) ??
  originValidationResponse(request, hosts) ??
  handler.fetch(request)

export { serve as GET, serve as POST, serve as DELETE }
