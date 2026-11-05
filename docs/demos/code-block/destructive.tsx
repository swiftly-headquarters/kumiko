import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@/components/ui/code-block"
import { AlertCircleIcon } from "lucide-react"

const trace = `TypeError: Cannot read properties of undefined
    at render (app.tsx:12:5)`

export default function Demo() {
  return (
    <CodeBlock variant="destructive" size="sm" className="max-w-md">
      <CodeBlockHeader>
        <CodeBlockTitle>
          <AlertCircleIcon />
          Error
        </CodeBlockTitle>
      </CodeBlockHeader>
      <CodeBlockContent>{trace}</CodeBlockContent>
    </CodeBlock>
  )
}
