"use client"

import { Fragment } from "react"
import { motion, useReducedMotion } from "motion/react"

const ease = [0.23, 1, 0.32, 1] as const

// Word-by-word blur-in. `shine` word gets a sweeping gradient.
export function Words({
  text,
  shine,
  className,
}: {
  text: string
  shine?: string
  className?: string
}) {
  const reduce = useReducedMotion()
  const words = text.split(" ")
  return (
    <span className={className}>
      {words.map((w, i) => (
        <Fragment key={i}>
        <motion.span
          className="inline-block"
          initial={reduce ? false : { opacity: 0, y: 24, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease, delay: 0.1 + i * 0.07 }}
        >
          {shine && w.replace(/[^\w]/g, "") === shine ? (
            <motion.span
              className="bg-gradient-to-r from-foreground via-muted-foreground to-foreground bg-[length:200%_100%] bg-clip-text text-transparent"
              animate={reduce ? undefined : { backgroundPosition: ["0% 0%", "200% 0%"] }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            >
              {w}
            </motion.span>
          ) : (
            w
          )}
        </motion.span>
        {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </span>
  )
}
