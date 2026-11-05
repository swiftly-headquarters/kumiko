// title: Month and year dropdowns
// note: captionLayout="dropdown" replaces the caption with month and year selects.

"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"

export default function Demo() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  return (
    <Calendar
      mode="single"
      captionLayout="dropdown"
      selected={date}
      onSelect={setDate}
      className="rounded-lg border"
    />
  )
}
