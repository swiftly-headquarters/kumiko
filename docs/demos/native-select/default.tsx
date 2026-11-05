import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"

export default function Demo() {
  return (
    <NativeSelect defaultValue="" className="w-48">
      <NativeSelectOption value="" disabled>
        Select status
      </NativeSelectOption>
      <NativeSelectOption value="todo">Todo</NativeSelectOption>
      <NativeSelectOption value="in-progress">In progress</NativeSelectOption>
      <NativeSelectOption value="done">Done</NativeSelectOption>
    </NativeSelect>
  )
}
