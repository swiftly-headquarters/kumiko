import { CodeBlock, CodeBlockContent } from "@/components/ui/code-block"

const code = `const a = 1
const b = 2

console.log(a + b)`

export default function Demo() {
  return (
    <CodeBlock className="max-w-md">
      <CodeBlockContent lineNumbers>{code}</CodeBlockContent>
    </CodeBlock>
  )
}
