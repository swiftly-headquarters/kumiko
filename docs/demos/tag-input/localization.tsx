// title: Localization
// note: Use labels to translate generated text.

import { TagInput } from "@/components/ui/tag-input"

export default function Demo() {
  return (
    <TagInput
      className="w-96"
      label="Etiquetas"
      placeholder="Agregar una etiqueta"
      defaultValue={["uno"]}
      maxValues={3}
      labels={{
        removeValue: (v) => `Eliminar ${v}`,
        maxValuesReached: (n) => `Maximo de ${n} etiquetas.`,
      }}
    />
  )
}
