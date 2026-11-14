import type { ComponentType } from "react"

import Dashboard01 from "@/components/blocks/dashboard-01/page"
import Dashboard02 from "@/components/blocks/dashboard-02/page"
import Dashboard03 from "@/components/blocks/dashboard-03/page"
import Dashboard04 from "@/components/blocks/dashboard-04/page"
import Authentication01 from "@/components/blocks/authentication-01/page"
import Authentication02 from "@/components/blocks/authentication-02/page"
import Authentication03 from "@/components/blocks/authentication-03/page"

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
      "Collapsible sidebar with org switcher, header with centered search across this app and others, theme toggle, user menu and skeleton loading state.",
    Component: Dashboard01,
  },
  {
    name: "dashboard-02",
    title: "Analytics dashboard",
    description:
      "Top navigation, KPI cards with trends, traffic area chart, top pages and a recent sign-ups table.",
    Component: Dashboard02,
  },
  {
    name: "dashboard-03",
    title: "Sales dashboard",
    description:
      "Collapsible icon sidebar, revenue KPIs, monthly revenue bar chart and a filterable recent orders table.",
    Component: Dashboard03,
  },
  {
    name: "dashboard-04",
    title: "Project board",
    description:
      "Kanban board with sprint header, avatar stack, view tabs and task cards with progress, comments and attachments.",
    Component: Dashboard04,
  },
  {
    name: "authentication-01",
    title: "Sign in",
    description:
      "Centered sign-in card with Google, Microsoft and GitHub, single sign-on, email and password, remember me and passkey.",
    Component: Authentication01,
  },
  {
    name: "authentication-02",
    title: "Sign up",
    description:
      "Split layout with a testimonial panel, social sign-up, work email and a live password strength checklist.",
    Component: Authentication02,
  },
  {
    name: "authentication-03",
    title: "Single sign-on flow",
    description:
      "Email-first sign-in that detects SSO domains, with passkey and a one-time code step.",
    Component: Authentication03,
  },
]

export const getBlock = (name: string) => blocks.find((b) => b.name === name)
