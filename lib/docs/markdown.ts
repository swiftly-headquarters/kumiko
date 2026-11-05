import { readDemoSource } from "./source"
import type { ComponentEntry, Example, PropRow } from "./types"

const cell = (s: string) => s.replaceAll("|", "\\|").replace(/\r?\n/g, " ")

// Server-only (reads demo sources via fs).
export function pageToMarkdown(
  props: PropRow[],
  examples: Example[],
  entry: ComponentEntry
): string {
  const out = [
    `# ${entry.title}`,
    entry.description,
    "## Usage",
    "```tsx\n" + readDemoSource(entry.slug, "default") + "\n```",
  ]
  if (entry.visual)
    for (const e of examples) {
      out.push(`## ${e.title}`)
      if (e.note) out.push(e.note)
      out.push("```tsx\n" + readDemoSource(entry.slug, e.demo) + "\n```")
    }
  if (props.length)
    out.push(
      "## API Reference",
      [
        "| Prop | Type | Default | Description |",
        "| --- | --- | --- | --- |",
        ...props.map(
          (p) =>
            `| ${[`\`${p.prop}\``, `\`${p.type}\``, p.default, p.description]
              .map(cell)
              .join(" | ")} |`
        ),
      ].join("\n")
    )
  return out.join("\n\n") + "\n"
}
