// title: With badge

import { Avatar, AvatarBadge, AvatarFallback } from "@/components/ui/avatar"

export default function Demo() {
  return (
    <Avatar size="lg">
      <AvatarFallback>AK</AvatarFallback>
      <AvatarBadge />
    </Avatar>
  )
}
