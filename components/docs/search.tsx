"use client"

import { useRouter } from "next/navigation"

import { components, groups } from "@/lib/docs/components"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

export function Search({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const router = useRouter()

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Search components"
      description="Search the component docs"
    >
      <CommandInput placeholder="Search components..." />
      <CommandList>
        <CommandEmpty>No components found.</CommandEmpty>
        {groups.map((g) => (
          <CommandGroup key={g.id} heading={g.title}>
            {components
              .filter((c) => c.group === g.id)
              .map((c) => (
                <CommandItem
                  key={c.slug}
                  value={`${c.title} ${c.slug}`}
                  onSelect={() => {
                    onOpenChange(false)
                    router.push(`/components/${c.slug}`)
                  }}
                >
                  {c.title}
                </CommandItem>
              ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  )
}
