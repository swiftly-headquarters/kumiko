import type { Metadata } from "next"

import { Frame } from "@/components/builder/frame"

export const metadata: Metadata = { title: "Page preview" }

export default function ViewPage() {
  return <Frame />
}
