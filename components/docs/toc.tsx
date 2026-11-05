"use client"

import { useEffect, useState } from "react"
import { TextAlignStartIcon } from "lucide-react"

import { AnimatedNav, NavItem, NavTitle } from "@/components/docs/animated-nav"

export function Toc({ items }: { items: { id: string; title: string }[] }) {
  const [active, setActive] = useState(items[0]?.id)

  useEffect(() => {
    const seen = new Set<string>()
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) seen.add(e.target.id)
          else seen.delete(e.target.id)
        }
        // first section (page order) currently in the band
        const first = items.find((i) => seen.has(i.id))
        if (first) setActive(first.id)
      },
      { rootMargin: "-80px 0px -60% 0px" }
    )
    for (const i of items) {
      const el = document.getElementById(i.id)
      if (el) io.observe(el)
    }
    return () => io.disconnect()
  }, [items])

  return (
    <nav aria-label="On this page">
      <AnimatedNav>
        <NavTitle icon={TextAlignStartIcon}>On this page</NavTitle>
        <div className="ml-2 flex flex-col">
          {items.map((i) => (
            <NavItem
              key={i.id}
              id={i.id}
              active={active === i.id}
              render={(p) => <a href={`#${i.id}`} {...p} />}
            >
              {i.title}
            </NavItem>
          ))}
        </div>
      </AnimatedNav>
    </nav>
  )
}
