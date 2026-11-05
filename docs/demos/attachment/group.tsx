// note: AttachmentGroup scrolls horizontally with vertical items.

import {
  Attachment,
  AttachmentContent,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment"
import { FileIcon, FileTextIcon, ImageIcon, MusicIcon } from "lucide-react"

const items = [
  { name: "photo.png", icon: ImageIcon },
  { name: "brief.pdf", icon: FileTextIcon },
  { name: "voice.mp3", icon: MusicIcon },
  { name: "data.json", icon: FileIcon },
  { name: "slides.key", icon: FileIcon },
]

export default function Demo() {
  return (
    <AttachmentGroup className="max-w-sm">
      {items.map(({ name, icon: Icon }) => (
        <Attachment key={name} orientation="vertical">
          <AttachmentMedia>
            <Icon />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>{name}</AttachmentTitle>
          </AttachmentContent>
        </Attachment>
      ))}
    </AttachmentGroup>
  )
}
