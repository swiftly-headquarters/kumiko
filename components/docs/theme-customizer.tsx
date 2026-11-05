"use client"

import { useEffect, useReducer, useSyncExternalStore } from "react"
import { useTheme } from "next-themes"
import { PaletteIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  applyOverrides,
  clearOverrides,
  computedHex,
  readOverrides,
  writeOverrides,
} from "@/lib/docs/theme-overrides"

const tokens = ["--primary", "--background", "--foreground", "--accent"]

export function ThemeCustomizer() {
  const { resolvedTheme } = useTheme()
  const [, refresh] = useReducer((n: number) => n + 1, 0)
  const mode = resolvedTheme === "dark" ? "dark" : "light"

  // Apply saved overrides on every docs page load.
  useEffect(() => applyOverrides(readOverrides()), [])

  // false on server and during hydration: storage and computed styles are
  // browser-only, so read them only after mount.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
  const current = mounted ? readOverrides() : { light: {}, dark: {} }

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="ghost" size="icon" aria-label="Theme colors" />
        }
      >
        <PaletteIcon />
      </PopoverTrigger>
      <PopoverContent side="bottom" align="end" sideOffset={8}>
        <p className="font-medium">Editing {mode} mode</p>
        {tokens.map((t) => (
          <label key={t} className="flex items-center justify-between gap-2">
            <code className="text-xs">{t}</code>
            <input
              type="color"
              aria-label={`${t} (${mode})`}
              value={current[mode][t] ?? (mounted ? computedHex(t) : "#808080")}
              onChange={(e) => {
                const next = readOverrides()
                next[mode][t] = e.target.value
                writeOverrides(next)
                applyOverrides(next)
                refresh()
              }}
            />
          </label>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            clearOverrides()
            applyOverrides({ light: {}, dark: {} })
            refresh()
          }}
        >
          Reset
        </Button>
      </PopoverContent>
    </Popover>
  )
}
