"use client"

import { useEffect, useState, useSyncExternalStore } from "react"
import { Logo } from "@/components/docs/logo"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"

const DRAW = 1.4
const ease = [0.23, 1, 0.32, 1] as const

// Read once per page load, so marking it seen mid-intro doesn't cut the exit.
let seen: boolean | undefined
const wasSeen = () => (seen ??= Boolean(sessionStorage.getItem("kumiko-intro")))
const subscribe = () => () => {}

// Full-screen logo draw-in, once per browser session (home page only).
export function Intro() {
  const reduce = useReducedMotion()
  const skip = useSyncExternalStore(subscribe, wasSeen, () => false) || reduce
  const [playing, setPlaying] = useState(true)

  useEffect(() => {
    if (skip) return
    // Mark/unmark in effect+cleanup so StrictMode's double run still plays.
    sessionStorage.setItem("kumiko-intro", "1")
    const root = document.documentElement
    root.style.overflow = "hidden"
    let done = false
    const t = setTimeout(() => {
      done = true
      root.style.overflow = ""
      setPlaying(false)
    }, (DRAW + 1.2) * 1000)
    return () => {
      clearTimeout(t)
      root.style.overflow = ""
      if (!done) sessionStorage.removeItem("kumiko-intro")
    }
  }, [skip])

  if (skip) return null
  return (
    <AnimatePresence>
      {playing && (
        <motion.div
          aria-hidden
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-5 bg-background"
          exit={{ opacity: 0, transition: { duration: 0.6, ease } }}
        >
          <Logo draw className="size-28 text-foreground" />
          <motion.span
            className="text-3xl font-semibold tracking-tight"
            initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.6, ease, delay: DRAW - 0.1 }}
          >
            Kumiko
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
