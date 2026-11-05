import { BellIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"

export default function Demo() {
  return (
    <Item variant="outline">
      <ItemMedia variant="icon">
        <BellIcon />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Notifications</ItemTitle>
        <ItemDescription>Manage how you are notified.</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button size="sm">Open</Button>
      </ItemActions>
    </Item>
  )
}
