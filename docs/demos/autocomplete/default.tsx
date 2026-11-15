import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
} from "@/components/ui/autocomplete"

const fruits = ["Apple", "Apricot", "Banana", "Blueberry", "Cherry", "Grape", "Mango"]

export default function Demo() {
  return (
    <Autocomplete items={fruits}>
      <AutocompleteInput placeholder="Search fruits…" className="w-64" />
      <AutocompleteContent>
        <AutocompleteEmpty>No suggestions.</AutocompleteEmpty>
        <AutocompleteList>
          {(item: string) => (
            <AutocompleteItem key={item} value={item}>
              {item}
            </AutocompleteItem>
          )}
        </AutocompleteList>
      </AutocompleteContent>
    </Autocomplete>
  )
}
