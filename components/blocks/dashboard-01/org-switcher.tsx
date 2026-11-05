"use client"

import { useState } from "react"
import { CheckIcon, ChevronsUpDownIcon, PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { orgs as sampleOrgs } from "@/components/blocks/dashboard-01/data"

// Multi-org switcher. Lives in the application header, left of the search.
export function OrgSwitcher({ orgs }: { orgs: typeof sampleOrgs }) {
  const [active, setActive] = useState(orgs[0])

  if (!active) return null

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        render={
          <Button
            render={<button />}
            variant="outline"
            className="h-8 gap-2 px-2.5"
          />
        }
      >
        <span className="hidden text-xs text-muted-foreground @xl/header:inline">
          Org
        </span>
        <span className="max-w-20 truncate font-mono text-sm @xl/header:max-w-none">
          {active.name}
        </span>
        <ChevronsUpDownIcon className="size-3.5 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Organizations</DropdownMenuLabel>
          {orgs.map((org) => (
            <DropdownMenuItem
              key={org.name}
              onClick={() => setActive(org)}
              className="gap-2"
            >
              <span className="flex-1 truncate font-mono">{org.name}</span>
              <span className="text-xs text-muted-foreground">{org.plan}</span>
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
  )
}
