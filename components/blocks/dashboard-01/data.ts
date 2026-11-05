import type { ComponentType } from "react"

import { Logo } from "@/components/docs/logo"
import {
  ChartPieIcon,
  GlobeIcon,
  HistoryIcon,
  KeyRoundIcon,
  LayoutGridIcon,
  LifeBuoyIcon,
  MailIcon,
  MapIcon,
  PackageIcon,
  type LucideIcon,
  Settings2Icon,
  ShieldCheckIcon,
  TerminalIcon,
  UsersIcon,
  ServerIcon,
} from "lucide-react"

// Sample data. Replace with your product, orgs, user and routes.

export type NavItem = {
  title: string
  url: string
  icon: LucideIcon
  active?: boolean
  badge?: string
}

export type NavGroup = { label?: string; items: NavItem[] }

export type App = {
  name: string
  url: string
  icon: LucideIcon | ComponentType<{ className?: string }>
  // Current app: results open with the router instead of a full navigation.
  current?: boolean
  pages: { title: string; url: string }[]
}

export const product = {
  name: "SwiftlyLabs",
  logo: Logo,
}

export const user = {
  name: "Jane Doe",
  role: "Org admin",
  avatar: "",
}

export const orgs = [
  { name: "swiftlylabs-prod", plan: "Enterprise" },
  { name: "swiftlylabs-staging", plan: "Enterprise" },
  { name: "side-project", plan: "Free" },
]

export const navGroups: NavGroup[] = [
  {
    items: [
      { title: "Overview", url: "#", icon: LayoutGridIcon, active: true },
      { title: "Nodes", url: "#", icon: ServerIcon, badge: "4 offline" },
      { title: "Apps", url: "#", icon: PackageIcon, badge: "2 degraded" },
      { title: "Terminal", url: "#", icon: TerminalIcon },
    ],
  },
  {
    label: "Network",
    items: [
      { title: "DNS", url: "#", icon: GlobeIcon },
      { title: "Sites and map", url: "#", icon: MapIcon },
    ],
  },
  {
    label: "Access",
    items: [
      { title: "Secrets", url: "#", icon: KeyRoundIcon },
      { title: "Teams", url: "#", icon: UsersIcon },
      { title: "Roles and tokens", url: "#", icon: ShieldCheckIcon },
      { title: "Audit log", url: "#", icon: HistoryIcon },
    ],
  },
]

export const settingsItem: NavItem = {
  title: "Settings",
  url: "#",
  icon: Settings2Icon,
}

// What the header search covers: this app first, then the others.
export const apps: App[] = [
  {
    name: product.name,
    url: "#",
    icon: product.logo,
    current: true,
    pages: [...navGroups.flatMap((g) => g.items), settingsItem].map((i) => ({
      title: i.title,
      url: i.url,
    })),
  },
  {
    name: "Analytics",
    url: "#",
    icon: ChartPieIcon,
    pages: [
      { title: "Overview", url: "#" },
      { title: "Reports", url: "#" },
    ],
  },
  {
    name: "Mail",
    url: "#",
    icon: MailIcon,
    pages: [
      { title: "Inbox", url: "#" },
      { title: "Campaigns", url: "#" },
    ],
  },
  {
    name: "Support",
    url: "#",
    icon: LifeBuoyIcon,
    pages: [
      { title: "Tickets", url: "#" },
      { title: "Knowledge base", url: "#" },
    ],
  },
]
