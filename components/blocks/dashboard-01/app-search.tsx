"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SearchIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Kbd } from "@/components/ui/kbd"
import { apps, type App } from "@/components/blocks/dashboard-01/data"

// Header search: pages of the current app first, then every other app.
// Opens with Ctrl/Cmd+K. Reads `apps` here, not as a prop: icon components
// can't be passed from a server component into this client component.
export function AppSearch() {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [])

  const go = (app: App, url: string) => {
    setOpen(false)
    // Other apps usually live on another origin: full navigation.
    if (app.current) router.push(url)
    else window.location.assign(url)
  }

  return (
    <>
      <Button
        render={<button />}
        variant="outline"
        onClick={() => setOpen(true)}
        aria-label="Search"
        // Narrow header: square icon button. Wide header: full search field.
        className="size-9 max-w-xl justify-center gap-2 bg-muted/40 px-0 font-normal text-muted-foreground shadow-none @2xl/header:w-full @2xl/header:min-w-0 @2xl/header:shrink @2xl/header:justify-start @2xl/header:px-2.5"
      >
        <SearchIcon />
        <span className="hidden flex-1 truncate text-left @2xl/header:block">
          Search pages, apps...
        </span>
        <Kbd className="hidden @2xl/header:inline-flex">Ctrl K</Kbd>
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Search"
        description="Search this app and your other apps"
      >
        <CommandInput placeholder="Search pages and apps..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {apps.map((app, i) => (
            <div key={app.name}>
              {i > 0 && <CommandSeparator />}
              <CommandGroup heading={app.current ? `${app.name} (this app)` : app.name}>
                {!app.current && (
                  <CommandItem
                    value={`${app.name} open app`}
                    onSelect={() => go(app, app.url)}
                  >
                    <app.icon />
                    Open {app.name}
                  </CommandItem>
                )}
                {app.pages.map((page) => (
                  <CommandItem
                    key={page.title}
                    value={`${app.name} ${page.title}`}
                    onSelect={() => go(app, page.url)}
                  >
                    <app.icon />
                    {page.title}
                  </CommandItem>
                ))}
              </CommandGroup>
            </div>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  )
}
