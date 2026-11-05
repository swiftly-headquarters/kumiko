"use client"

import { motion, useReducedMotion } from "motion/react"

// Entry animation from animate-ui's hero: fade + rise + blur, staggered by
// `index`. `scroll` plays it when scrolled into view instead of on mount.
export function Rise({
  index = 0,
  scroll = false,
  className,
  children,
}: {
  index?: number
  scroll?: boolean
  className?: string
  children: React.ReactNode
}) {
  const reduce = useReducedMotion()
  const from = { opacity: 0, y: 20, filter: "blur(10px)" }
  const to = { opacity: 1, y: 0, filter: "blur(0px)" }
  return (
    <motion.div
      className={className}
      initial={reduce ? false : from}
      {...(scroll
        ? { whileInView: to, viewport: { once: true, margin: "0px 0px -80px" } }
        : { animate: to })}
      transition={{
        duration: 0.7,
        ease: [0.23, 1, 0.32, 1],
        delay: index * 0.09,
      }}
    >
      {children}
    </motion.div>
  )
}
