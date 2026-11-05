// title: Diff and highlighted lines
// note: Use CodeBlockLine to mark added, removed or highlighted lines. Syntax highlighting is separate: lib/highlighter.tsx returns tokens you can render inside CodeBlockLine.

import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockLine,
} from "@/components/ui/code-block"

export default function Demo() {
  return (
    <CodeBlock className="max-w-md">
      <CodeBlockContent>
        <CodeBlockLine>{"function total(items) {"}</CodeBlockLine>
        <CodeBlockLine variant="removed">
          {"  return items.length"}
        </CodeBlockLine>
        <CodeBlockLine variant="added">
          {"  return items.reduce((n, i) => n + i.qty, 0)"}
        </CodeBlockLine>
        <CodeBlockLine variant="highlighted">{"}"}</CodeBlockLine>
      </CodeBlockContent>
    </CodeBlock>
  )
}
