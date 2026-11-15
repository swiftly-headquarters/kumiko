// title: Grouped

import {
  Autocomplete,
  AutocompleteCollection,
  AutocompleteContent,
  AutocompleteGroup,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteLabel,
  AutocompleteList,
} from "@/components/ui/autocomplete"

const regions = [
  { value: "Europe", items: ["Frankfurt", "London", "Paris"] },
  { value: "Americas", items: ["Montreal", "Sao Paulo", "Virginia"] },
  { value: "Asia", items: ["Singapore", "Tokyo"] },
]

export default function Demo() {
  return (
    <Autocomplete items={regions}>
      <AutocompleteInput placeholder="Select region…" className="w-64" showTrigger />
      <AutocompleteContent>
        <AutocompleteList>
          {(group: (typeof regions)[number]) => (
            <AutocompleteGroup key={group.value} items={group.items}>
              <AutocompleteLabel>{group.value}</AutocompleteLabel>
              <AutocompleteCollection>
                {(item: string) => (
                  <AutocompleteItem key={item} value={item}>
                    {item}
                  </AutocompleteItem>
                )}
              </AutocompleteCollection>
            </AutocompleteGroup>
          )}
        </AutocompleteList>
      </AutocompleteContent>
    </Autocomplete>
  )
}
