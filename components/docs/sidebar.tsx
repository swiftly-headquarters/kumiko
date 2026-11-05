"use client"

import { createContext, useContext, useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BookOpenIcon,
  BotMessageSquareIcon,
  ChevronsUpDownIcon,
  LayersIcon,
  LayoutGridIcon,
  MenuIcon,
  PanelsTopLeftIcon,
  SlidersHorizontalIcon,
  type LucideIcon,
} from "lucide-react"

import { AnimatedNav, NavItem, NavTitle } from "@/components/docs/animated-nav"
import { components, groups } from "@/lib/docs/components"
import type { Group } from "@/lib/docs/types"
import { cn } from "@/lib/utils"

const groupIcons: Record<Group, LucideIcon> = {
  overlays: LayersIcon,
  menus: MenuIcon,
  controls: SlidersHorizontalIcon,
  disclosure: ChevronsUpDownIcon,
  display: PanelsTopLeftIcon,
  chat: BotMessageSquareIcon,
}

const guides = [
  { href: "/blocks", label: "Blocks" },
  { href: "/contributing", label: "Contributing" },
  { href: "/accessibility", label: "Accessibility" },
  { href: "/skill", label: "Design skill" },
]

// Mobile open state, shared with the navbar menu button.
const NavContext = createContext<{
  open: boolean
  setOpen: (v: boolean) => void
}>({ open: false, setOpen: () => {} })

export const useDocsNav = () => useContext(NavContext)

export function DocsNavProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return <NavContext value={{ open, setOpen }}>{children}</NavContext>
}

export function Sidebar() {
  const { open, setOpen } = useDocsNav()
  const pathname = usePathname()
  const active = pathname.split("/")[2]

  // Close on Escape and on any route change (browser back/forward included).
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, setOpen])

  useEffect(() => {
    setOpen(false)
  }, [pathname, setOpen])

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 overflow-y-auto [scrollbar-width:thin] [scrollbar-color:var(--border)_transparent] bg-background p-5 md:sticky md:top-17 md:z-auto md:block md:h-[calc(100svh-4.25rem)] md:w-auto md:px-0 md:py-6 md:pr-6",
          open ? "block" : "hidden"
        )}
      >
        <nav aria-label="Components" className="pb-10">
          <AnimatedNav>
            <div className="mb-6 flex flex-col">
              <NavTitle icon={LayoutGridIcon}>Overview</NavTitle>
              <NavItem
                id="all"
                active={pathname === "/components"}
                className="ml-2"
                render={(p) => (
                  <Link
                    href="/components"
                    aria-current={pathname === "/components" ? "page" : undefined}
                    {...p}
                  />
                )}
              >
                All components
              </NavItem>
            </div>
            <div className="mb-6 flex flex-col">
              <NavTitle icon={BookOpenIcon}>Guides</NavTitle>
              {guides.map((g) => {
                const current = pathname.startsWith(g.href)
                return (
                  <NavItem
                    key={g.href}
                    id={g.href}
                    active={current}
                    className="ml-2"
                    render={(p) => (
                      <Link
                        href={g.href}
                        aria-current={current ? "page" : undefined}
                        {...p}
                      />
                    )}
                  >
                    {g.label}
                  </NavItem>
                )
              })}
            </div>
            {groups.map((g) => (
              <div key={g.id} className="mb-6 flex flex-col">
                <NavTitle icon={groupIcons[g.id]}>{g.title}</NavTitle>
                {components
                  .filter((c) => c.group === g.id)
                  .map((c) => (
                    <NavItem
                      key={c.slug}
                      id={c.slug}
                      active={c.slug === active}
                      className="ml-2"
                      render={(p) => (
                        <Link
                          href={`/components/${c.slug}`}
                          aria-current={c.slug === active ? "page" : undefined}
                          {...p}
                        />
                      )}
                    >
                      {c.title}
                    </NavItem>
                  ))}
              </div>
            ))}
          </AnimatedNav>
        </nav>
      </aside>
    </>
  )
}
