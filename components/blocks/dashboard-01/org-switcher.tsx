"use client"

import { useState } from "react"
import { CheckIcon, ChevronsUpDownIcon, PlusIcon } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  product,
  type orgs as sampleOrgs,
} from "@/components/blocks/dashboard-01/data"

// Multi-org switcher. Lives in the sidebar header, in place of the logo row.
export function OrgSwitcher({ orgs }: { orgs: typeof sampleOrgs }) {
  const { isMobile } = useSidebar()
  const [active, setActive] = useState(orgs[0])

  if (!active) return null

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                render={<button />}
                size="lg"
                className="group-data-[collapsible=icon]:p-1! data-popup-open:bg-sidebar-accent"
              />
            }
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border bg-background">
              <product.logo className="size-5" />
            </span>
            <span className="grid flex-1 text-left leading-tight">
              <span className="truncate font-mono text-sm font-medium">
                {active.name}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {active.plan}
              </span>
            </span>
            <ChevronsUpDownIcon className="ml-auto size-4 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            side={isMobile ? "bottom" : "right"}
            className="w-auto min-w-64"
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel>Organizations</DropdownMenuLabel>
              {orgs.map((org) => (
                <DropdownMenuItem
                  key={org.name}
                  onClick={() => setActive(org)}
                  className="gap-2"
                >
                  <span className="flex-1 truncate font-mono">{org.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {org.plan}
                  </span>
                  {org.name === active.name && <CheckIcon />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2">
              <PlusIcon />
              Add organization
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
