"use client"

import {
  type ClipboardEvent,
  type KeyboardEvent,
  type ReactNode,
  useId,
  useRef,
  useState,
} from "react"
import { AnimatePresence, motion } from "motion/react"
import { XIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { spring, useAnimated } from "@/lib/motion"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"

type TagInputLabels = {
  input: string
  removeValue: (value: string) => string
  invalidValue: (value: string) => string
  maxValuesReached: (maxValues: number) => string
}

const defaultLabels: TagInputLabels = {
  input: "Add value",
  removeValue: (value) => `Remove ${value}`,
  invalidValue: (value) => `${value} is not valid.`,
  maxValuesReached: (max) => `Maximum of ${max} values.`,
}

type TagInputProps = {
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
  /** Return false to reject a value. */
  validateValue?: (value: string) => boolean
  maxValues?: number
  labels?: Partial<TagInputLabels>
  label?: ReactNode
  description?: ReactNode
  /** Overrides the built-in invalid / max-values message. */
  error?: string
  placeholder?: string
  name?: string
  id?: string
  disabled?: boolean
  required?: boolean
  className?: string
}

// Creatable multi-value input. Enter, comma, Tab or blur commit the draft;
// pasted comma/newline separated text is split into tags; duplicates ignored.
function TagInput({
  value: valueProp,
  defaultValue = [],
  onValueChange,
  validateValue,
  maxValues,
  labels: labelsProp,
  label,
  description,
  error,
  placeholder,
  name,
  id,
  disabled,
  required,
  className,
}: TagInputProps) {
  const labels = { ...defaultLabels, ...labelsProp }
  const animated = useAnimated()
  const autoId = useId()
  const inputId = id ?? autoId
  const inputRef = useRef<HTMLInputElement>(null)
  const [inner, setInner] = useState(defaultValue)
  const [draft, setDraft] = useState("")
  const [feedback, setFeedback] = useState<string>()
  const values = valueProp ?? inner
  const full = maxValues !== undefined && values.length >= maxValues

  const setValues = (next: string[]) => {
    setInner(next)
    onValueChange?.(next)
  }

  // Adds every non-empty, unique, valid entry; reports the first rejection.
  const commit = (entries: string[]) => {
    const next = [...values]
    let message: string | undefined
    for (const raw of entries) {
      const entry = raw.trim()
      if (!entry || next.includes(entry)) continue
      if (maxValues !== undefined && next.length >= maxValues) {
        message = labels.maxValuesReached(maxValues)
        break
      }
      if (validateValue && !validateValue(entry)) {
        message ??= labels.invalidValue(entry)
        continue
      }
      next.push(entry)
    }
    if (next.length !== values.length) setValues(next)
    setFeedback(message)
    return !message
  }

  const commitDraft = () => {
    if (!draft.trim()) return setDraft("")
    // Keep rejected text in the input so it can be fixed.
    if (commit([draft])) setDraft("")
  }

  const remove = (tag: string) => {
    setValues(values.filter((v) => v !== tag))
    setFeedback(undefined)
    inputRef.current?.focus()
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      commitDraft()
    } else if (e.key === "Tab" && draft.trim()) {
      e.preventDefault()
      commitDraft()
    } else if (e.key === "Backspace" && !draft && values.length) {
      remove(values[values.length - 1])
    }
  }

  const onPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData("text")
    if (!/[,\n]/.test(text)) return
    e.preventDefault()
    commit(text.split(/[,\n]/))
  }

  const message = error ?? feedback
  const invalid = Boolean(message)

  return (
    <Field
      data-disabled={disabled || undefined}
      data-invalid={invalid || undefined}
      className={className}
    >
      {label && (
        <FieldLabel htmlFor={inputId}>
          {label}
          {required && <span className="text-destructive">*</span>}
        </FieldLabel>
      )}
      <div
        data-slot="tag-input"
        onClick={() => inputRef.current?.focus()}
        className={cn(
          "flex min-h-9 w-full cursor-text flex-wrap items-center gap-1 rounded-lg border border-input bg-background bg-clip-padding p-1 text-sm transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 has-aria-invalid:border-destructive has-aria-invalid:ring-3 has-aria-invalid:ring-destructive/20 has-disabled:pointer-events-none has-disabled:opacity-50 dark:bg-input/30 dark:has-aria-invalid:border-destructive/50 dark:has-aria-invalid:ring-destructive/40"
        )}
      >
        <AnimatePresence initial={false}>
          {values.map((tag) => (
            <motion.span
              key={tag}
              layout={animated}
              data-slot="tag-input-tag"
              initial={animated ? { opacity: 0, scale: 0.9 } : false}
              animate={{ opacity: 1, scale: 1 }}
              exit={animated ? { opacity: 0, scale: 0.9 } : undefined}
              transition={spring}
              className="flex h-5.25 w-fit items-center gap-1 rounded-sm bg-muted pr-0 pl-1.5 text-xs font-medium whitespace-nowrap text-foreground"
            >
              {tag}
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                disabled={disabled}
                aria-label={labels.removeValue(tag)}
                onClick={(e) => {
                  e.stopPropagation()
                  remove(tag)
                }}
                className="-ml-1 opacity-50 hover:opacity-100"
              >
                <XIcon className="pointer-events-none" />
              </Button>
            </motion.span>
          ))}
        </AnimatePresence>
        <input
          ref={inputRef}
          id={inputId}
          data-slot="tag-input-control"
          aria-label={label ? undefined : labels.input}
          aria-invalid={invalid || undefined}
          aria-describedby={invalid ? `${inputId}-error` : undefined}
          autoComplete="off"
          disabled={disabled}
          readOnly={full}
          value={draft}
          placeholder={placeholder}
          onChange={(e) => {
            setDraft(e.target.value)
            setFeedback(undefined)
          }}
          onKeyDown={onKeyDown}
          onPaste={onPaste}
          onBlur={commitDraft}
          className="h-7 basis-full bg-transparent px-2 outline-none placeholder:text-muted-foreground"
        />
        {name && values.map((v) => <input key={v} type="hidden" name={name} value={v} />)}
      </div>
      {description && <FieldDescription>{description}</FieldDescription>}
      <FieldError id={`${inputId}-error`}>{message}</FieldError>
    </Field>
  )
}

export { TagInput, type TagInputLabels, type TagInputProps }
