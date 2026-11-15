// title: Controlled
// note: The value is free-form text; suggestions are only hints.

"use client"

import { useState } from "react"
import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
} from "@/components/ui/autocomplete"

const fruits = ["Apple", "Apricot", "Banana", "Blueberry", "Cherry", "Grape", "Mango"]

export default function Demo() {
  const [value, setValue] = useState("")
  return (
    <div className="flex w-64 flex-col gap-2">
      <Autocomplete items={fruits} value={value} onValueChange={setValue}>
        <AutocompleteInput placeholder="Type a fruit…" showClear />
        <AutocompleteContent>
          <AutocompleteList>
            {(item: string) => (
              <AutocompleteItem key={item} value={item}>
                {item}
              </AutocompleteItem>
            )}
          </AutocompleteList>
        </AutocompleteContent>
      </Autocomplete>
      <p className="text-sm text-muted-foreground">Value: {value || "—"}</p>
    </div>
  )
}
