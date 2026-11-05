import { highlightCode } from "@/lib/highlighter"
import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockLine,
} from "@/components/ui/code-block"

// Server component: highlighted code with a copy button; raw text if no grammar.
export async function CodeView({
  code,
  language = "tsx",
  className,
}: {
  code: string
  language?: string
  className?: string
}) {
  const lines = await highlightCode(code, language)
  return (
    <CodeBlock className={className}>
      <div className="relative min-w-0">
        <CodeBlockCopyButton
          value={code}
          className="absolute top-2 right-2 z-10"
        />
        <CodeBlockContent className="mr-10 max-h-[32rem]">
          {lines
            ? lines.map((line, i) => (
                <CodeBlockLine key={i}>{line}</CodeBlockLine>
              ))
            : code}
        </CodeBlockContent>
      </div>
    </CodeBlock>
  )
}
