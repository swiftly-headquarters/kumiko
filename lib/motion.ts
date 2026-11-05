import { createContext, createElement, use, useState, type ReactNode } from "react"
import { MotionConfig, type Transition, type Variants } from "motion/react"

const AnimationsContext = createContext(true)

// Turns animations on/off for everything inside (on by default, nestable):
// <Animations enabled={false}><Button /></Animations>
// `enabled` left undefined inherits from the parent wrapper.
export function Animations({
  enabled,
  children,
}: {
  enabled?: boolean
  children?: ReactNode
}) {
  const parent = useAnimated()
  const on = enabled ?? parent
  return createElement(
    AnimationsContext,
    { value: on },
    createElement(
      MotionConfig,
      { skipAnimations: !on },
      // The display:contents span carries data-animated so globals.css can also
      // switch off CSS transitions/animations in the subtree. It is always
      // rendered, so toggling never remounts children. A nested enabled
      // <Animations> inside a disabled one re-enables motion, not these rules.
      createElement(
        "span",
        {
          style: { display: "contents" },
          "data-animated": on ? undefined : "false",
        },
        children
      )
    )
  )
}

export const useAnimated = () => use(AnimationsContext)

// Spread on portaled roots (they render outside the <Animations> span) so the
// same globals.css rule reaches them.
export const useAnimatedAttr = (): { "data-animated"?: "false" } =>
  useAnimated() ? {} : { "data-animated": "false" }

// Adds an `animated` prop to a component: `<Button animated={false} />`.
// Unset = inherit from the nearest <Animations> (on by default).
export function withAnimated<P extends object>(
  Component: (props: P) => ReactNode,
  name = Component.name.replace(/Base$/, "")
) {
  function Animated({ animated, ...props }: P & { animated?: boolean }) {
    const content = createElement(Component, props as unknown as P)
    return animated === undefined
      ? content
      : createElement(Animations, { enabled: animated }, content)
  }
  Animated.displayName = name
  return Animated
}

// skipAnimations still snaps hover/tap targets, so gestures are dropped too.
export function useGestures<T extends object>(gestures: T): Partial<T> {
  return useAnimated() ? gestures : {}
}

// Shared motion presets so every component animates with the same feel.
export const spring: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 30,
}

export const softSpring: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 26,
}

export const fast: Transition = { duration: 0.15, ease: "easeOut" }

// Overlay popups (popover, menus, tooltip, select, hover-card).
export const popup: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: -4 },
  visible: { opacity: 1, scale: 1, y: 0 },
}

// Tap/hover feedback for pressable things.
export const press = { whileHover: { scale: 1.03 }, whileTap: { scale: 0.96 } }
export const usePress = () => useGestures(press)

// Scale + fade that slides in from the side the popup opens toward, like the
// old slide-in-from-* classes. Uses the requested side, not a flipped one.
export function popFrom(
  side: "top" | "bottom" | "left" | "right" | "inline-start" | "inline-end"
): Variants {
  const from = {
    top: { y: 8 },
    bottom: { y: -8 },
    left: { x: 8 },
    "inline-start": { x: 8 },
    right: { x: -8 },
    "inline-end": { x: -8 },
  }[side]

  return {
    hidden: { opacity: 0, scale: 0.95, ...from },
    visible: { opacity: 1, scale: 1, x: 0, y: 0 },
  }
}

// Controlled/uncontrolled open state, so a popup can be mounted inside
// AnimatePresence and still play its exit animation.
export function useOpenState<D>({
  open,
  defaultOpen = false,
  onOpenChange,
}: {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean, details: D) => void
}) {
  const [inner, setInner] = useState(defaultOpen)

  return [
    open ?? inner,
    (next: boolean, details: D) => {
      setInner(next)
      onOpenChange?.(next, details)
    },
  ] as const
}
