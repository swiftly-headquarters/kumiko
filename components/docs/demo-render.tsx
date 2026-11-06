"use client"

import { lazy, Suspense, type ComponentType } from "react"

// Demos are plain components (hooks, handlers, client-only helpers) with no
// "use client" of their own, so they must be rendered inside a client boundary.
// Each demo is its own lazy chunk, loaded by path from docs/demos.
// Demos with `export const controls` take those values as props.
type Props = Record<string, unknown>
const cache = new Map<string, ComponentType<Props>>()

function load(slug: string, demo: string) {
  const key = `${slug}/${demo}`
  let C = cache.get(key)
  if (!C) {
    C = lazy(() => import(`@/docs/demos/${slug}/${demo}`))
    cache.set(key, C)
  }
  return C
}

export function preloadDemo(slug: string, demo: string) {
  void import(`@/docs/demos/${slug}/${demo}`)
}

export function DemoRender({
  slug,
  demo,
  props,
}: {
  slug: string
  demo: string
  props?: Props
}) {
  // Stable identity per slug/demo (module-level cache), so no remounts.
  const Demo = load(slug, demo)
  return (
    <Suspense fallback={null}>
      {/* eslint-disable-next-line react-hooks/static-components */}
      <Demo {...props} />
    </Suspense>
  )
}
