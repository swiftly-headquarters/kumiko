// title: Single selection, outline, joined
// note: Without multiple only one item is on at a time. spacing={0} joins the items.

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export default function Demo() {
  return (
    <ToggleGroup variant="outline" spacing={0} defaultValue={["week"]}>
      <ToggleGroupItem value="day">Day</ToggleGroupItem>
      <ToggleGroupItem value="week">Week</ToggleGroupItem>
      <ToggleGroupItem value="month">Month</ToggleGroupItem>
    </ToggleGroup>
  )
}
