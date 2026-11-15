// title: Searchable select
// note: ComboboxTriggerValue shows the selection; the search input lives inside the popup.

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTriggerValue,
} from "@/components/ui/combobox"

const frameworks = ["Next.js", "SvelteKit", "Nuxt", "Remix", "Astro"]

export default function Demo() {
  return (
    <Combobox items={frameworks}>
      <ComboboxTriggerValue className="w-64" placeholder="Select a framework" />
      <ComboboxContent>
        <ComboboxInput placeholder="Search" showTrigger={false} />
        <ComboboxEmpty>No framework found.</ComboboxEmpty>
        <ComboboxList>
          {(item: string) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
