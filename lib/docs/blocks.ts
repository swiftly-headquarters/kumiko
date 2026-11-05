import type { ComponentType } from "react"

import Dashboard01 from "@/components/blocks/dashboard-01/page"

// One entry per registry:block. `name` matches registry.json and /r/<name>.json.
// Add a block: build it in components/blocks/<name>/, list it here and in
// registry.json.
export const blocks: {
  name: string
  title: string
  description: string
  Component: ComponentType
}[] = [
  {
    name: "dashboard-01",
    title: "Dashboard",
    description:
      "Inset sidebar with logo, header with org switcher, centered search across this app and others, theme toggle and user menu.",
    Component: Dashboard01,
  },
]

export const getBlock = (name: string) => blocks.find((b) => b.name === name)
