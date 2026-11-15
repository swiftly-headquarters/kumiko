"use client"

import { useState } from "react"
import { TagInput } from "@/components/ui/tag-input"

export default function Demo() {
  const [recipients, setRecipients] = useState(["ava@example.com"])
  return (
    <TagInput
      className="w-96"
      label="Recipients"
      description="Paste comma- or newline-separated email addresses."
      placeholder="name@example.com"
      value={recipients}
      onValueChange={setRecipients}
      validateValue={(v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)}
    />
  )
}
