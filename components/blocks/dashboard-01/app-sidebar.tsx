"use client"

import type { ComponentProps } from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  navGroups,
  orgs,
  settingsItem,
} from "@/components/blocks/dashboard-01/data"
import { NavMain } from "@/components/blocks/dashboard-01/nav-main"
import { OrgSwitcher } from "@/components/blocks/dashboard-01/org-switcher"

export function AppSidebar(props: ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <OrgSwitcher orgs={orgs} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain groups={navGroups} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={settingsItem.title}
              render={<a href={settingsItem.url} />}
            >
              <settingsItem.icon />
              <span>{settingsItem.title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
