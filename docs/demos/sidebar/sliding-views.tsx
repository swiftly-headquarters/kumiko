// title: Sliding views
// note: Swap whole navigation surfaces with a horizontal slide. Inactive views are aria-hidden and inert.

"use client"

import { useState } from "react"
import {
  ArrowLeftIcon,
  BellIcon,
  FolderIcon,
  HomeIcon,
  KeyIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSlidingView,
  SidebarSlidingViews,
} from "@/components/ui/sidebar"

export default function Demo() {
  const [view, setView] = useState("main")

  return (
    <SidebarProvider className="min-h-0 w-auto">
      <Sidebar collapsible="none" className="h-72 rounded-lg border">
        <SidebarSlidingViews activeKey={view}>
          <SidebarSlidingView value="main">
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Workspace</SidebarGroupLabel>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive>
                      <HomeIcon />
                      Home
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <FolderIcon />
                      Projects
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton onClick={() => setView("settings")}>
                      <SettingsIcon />
                      Settings
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>
            </SidebarContent>
          </SidebarSlidingView>
          <SidebarSlidingView value="settings">
            <SidebarContent>
              <SidebarGroup>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton onClick={() => setView("main")}>
                      <ArrowLeftIcon />
                      Back
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>
              <SidebarGroup>
                <SidebarGroupLabel>Settings</SidebarGroupLabel>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive>
                      <UserIcon />
                      Profile
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <BellIcon />
                      Notifications
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <KeyIcon />
                      API keys
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>
            </SidebarContent>
          </SidebarSlidingView>
        </SidebarSlidingViews>
      </Sidebar>
    </SidebarProvider>
  )
}
