"use client"

import { useId } from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"

// A demo declares `export const controls = { name: { value, ... } }`.
// The input type follows the value: options -> select, boolean -> switch,
// number with min/max -> slider, anything else -> text input.
export type ControlValue = string | number | boolean
export type Control = {
  value: ControlValue
  min?: number
  max?: number
  step?: number
  options?: string[]
}
export type FlatControls = Record<string, Control>
// Flat, or grouped under section headings: { Style: { variant: {...} } }.
export type Controls = FlatControls | Record<string, FlatControls>

const isControl = (v: unknown): v is Control =>
  typeof v === "object" && v !== null && "value" in v
const isGrouped = (c: Controls): c is Record<string, FlatControls> =>
  Object.values(c).every((g) => !isControl(g))
const flatten = (c: Controls): FlatControls =>
  isGrouped(c) ? Object.assign({}, ...Object.values(c)) : c

export const controlsToProps = (controls: Controls) =>
  Object.fromEntries(
    Object.entries(flatten(controls)).map(([k, c]) => [k, c.value])
  )

function setControl(controls: Controls, key: string, value: ControlValue): Controls {
  const set = (flat: FlatControls) =>
    key in flat ? { ...flat, [key]: { ...flat[key], value } } : flat
  if (!isGrouped(controls)) return set(controls)
  return Object.fromEntries(
    Object.entries(controls).map(([g, flat]) => [g, set(flat)])
  )
}

function ControlInput({
  id,
  name,
  control,
  onChange,
}: {
  id: string
  name: string
  control: Control
  onChange: (value: ControlValue) => void
}) {
  const { value, options, min, max, step } = control
  let input
  if (options) {
    input = (
      <Select value={String(value)} onValueChange={(v) => v !== null && onChange(v)}>
        <SelectTrigger id={id} size="sm" className="min-w-0 flex-1">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  } else if (typeof value === "boolean") {
    input = (
      <Switch id={id} checked={value} onCheckedChange={onChange} className="ml-auto" />
    )
  } else if (typeof value === "number" && min !== undefined && max !== undefined) {
    input = (
      <>
        <Slider
          aria-label={name}
          min={min}
          max={max}
          step={step}
          value={value}
          onValueChange={(v) => onChange(Array.isArray(v) ? v[0] : v)}
          className="min-w-0 flex-1"
        />
        <Input
          id={id}
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          autoComplete="off"
          onChange={(e) => {
            if (e.target.value === "") return
            onChange(Math.min(max, Math.max(min, Number(e.target.value))))
          }}
          className="h-7 w-14 shrink-0 px-1.5 text-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
        />
      </>
    )
  } else {
    input = (
      <Input
        id={id}
        type={typeof value === "number" ? "number" : "text"}
        value={value}
        autoComplete="off"
        onChange={(e) =>
          onChange(typeof value === "number" ? Number(e.target.value) : e.target.value)
        }
        className="h-7 min-w-0 flex-1 px-2 text-sm"
      />
    )
  }
  return (
    <div className="flex items-center gap-2.5">
      <Label htmlFor={id} title={name} className="block w-20 shrink-0 truncate text-foreground/80">
        {name}
      </Label>
      {input}
    </div>
  )
}

export function ControlsPanel({
  controls,
  onControlsChange,
}: {
  controls: Controls
  onControlsChange: (controls: Controls) => void
}) {
  const id = useId()
  const list = (flat: FlatControls) =>
    Object.entries(flat).map(([key, control]) => (
      <ControlInput
        key={key}
        id={`${id}-${key}`}
        name={key}
        control={control}
        onChange={(v) => onControlsChange(setControl(controls, key, v))}
      />
    ))
  return (
    <div className="flex size-full flex-col gap-3 overflow-y-auto rounded-lg bg-background p-3">
      {isGrouped(controls)
        ? Object.entries(controls).map(([group, flat]) => (
            <section key={group} className="flex flex-col gap-3">
              <h3 className="text-xs font-medium text-muted-foreground">{group}</h3>
              {list(flat)}
            </section>
          ))
        : list(controls)}
    </div>
  )
}
