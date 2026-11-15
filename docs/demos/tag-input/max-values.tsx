// title: Maximum values

import { TagInput } from "@/components/ui/tag-input"

export default function Demo() {
  return (
    <TagInput
      className="w-96"
      label="Access groups"
      description="A maximum of three groups."
      placeholder="Type a group name"
      defaultValue={["alpha"]}
      maxValues={3}
    />
  )
}
