import { notFound } from "next/navigation"

import { blocks, getBlock } from "@/lib/docs/blocks"

// Full-page block render, framed by the /blocks preview.
export const dynamicParams = false

export function generateStaticParams() {
  return blocks.map((b) => ({ name: b.name }))
}

export default async function Page({
  params,
}: {
  params: Promise<{ name: string }>
}) {
  const block = getBlock((await params).name)
  if (!block) notFound()
  return <block.Component />
}
