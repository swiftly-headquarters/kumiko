import type { Metadata } from "next"

import { Builder } from "@/components/builder/builder"
import { getCatalog } from "@/lib/builder/catalog"

export const metadata: Metadata = { title: "Page builder" }

export default function BuilderPage() {
  return <Builder catalog={getCatalog()} />
}
