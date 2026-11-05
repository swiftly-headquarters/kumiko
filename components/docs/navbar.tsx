"use client"

import { useEffect, useState, useSyncExternalStore } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { MenuIcon, MoonIcon, SearchIcon, SunIcon } from "lucide-react"

import { Logo } from "@/components/docs/logo"
import { Search } from "@/components/docs/search"
import { useDocsNav } from "@/components/docs/sidebar"
import { ThemeCustomizer } from "@/components/docs/theme-customizer"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const links = [
  { href: "/", label: "Home" },
  { href: "/components", label: "Components" },
  { href: "/blocks", label: "Blocks" },
]

export function Navbar({ menu = false }: { menu?: boolean }) {
  const { setOpen } = useDocsNav()
  const { resolvedTheme, setTheme } = useTheme()
  const pathname = usePathname()
  const [searchOpen, setSearchOpen] = useState(false)
  // false on server and during hydration, true after: avoids platform mismatch.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
  const isMac = mounted && /Mac|iPhone|iPad/.test(navigator.platform)

  // Ctrl/Cmd+K toggles search, including while typing in other inputs.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setSearchOpen((o) => !o)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  return (
    <header className="sticky top-0 z-30 bg-background">
      <div className="mx-auto flex h-14 max-w-[90rem] items-center gap-2 px-3 md:h-17 md:px-5">
        {menu && (
          <Button
            variant="ghost"
            size="icon"
            aria-label="Open navigation"
            className="md:hidden"
            onClick={() => setOpen(true)}
          >
            <MenuIcon />
          </Button>
        )}
        <Link
          href="/"
          className="mr-4 flex items-center gap-2 text-xl font-semibold tracking-tight"
        >
          <Logo className="size-6" />
          Kumiko
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-1 text-sm sm:flex">
          {links.map((l) => {
            const active =
              l.href === "/" ? pathname === "/" : pathname.startsWith(l.href)
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex h-8 items-center rounded-md px-3 text-neutral-700 transition-colors hover:text-black dark:text-neutral-200 dark:hover:text-white",
                  active && "text-black dark:text-white"
                )}
              >
                {l.label}
              </Link>
            )
          })}
        </nav>
        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            aria-label="Search components"
            onClick={() => setSearchOpen(true)}
            className="mr-1 hidden h-8 w-56 items-center gap-2 rounded-md bg-accent pr-1.5 pl-3 text-sm text-muted-foreground transition-colors hover:bg-accent/70 md:flex xl:w-64"
          >
            <span>Search...</span>
            <kbd className="ml-auto rounded-[4px] border bg-background px-1.5 py-0.5 font-sans text-[0.625rem] leading-none">
              {isMac ? "⌘ K" : "Ctrl K"}
            </kbd>
          </button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Search"
            className="md:hidden"
            onClick={() => setSearchOpen(true)}
          >
            <SearchIcon />
          </Button>
          <ThemeCustomizer />
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          >
            <SunIcon className="dark:hidden" />
            <MoonIcon className="hidden dark:block" />
          </Button>
        </div>
      </div>
      <Search open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  )
}
