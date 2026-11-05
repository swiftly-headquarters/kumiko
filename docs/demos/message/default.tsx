import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageHeader,
} from "@/components/ui/message"

export default function Demo() {
  return (
    <Message className="max-w-md">
      <MessageAvatar>
        <Avatar>
          <AvatarFallback>AN</AvatarFallback>
        </Avatar>
      </MessageAvatar>
      <MessageContent>
        <MessageHeader>Ana</MessageHeader>
        <Bubble variant="secondary">
          <BubbleContent>
            Can you review the PR before lunch? It is a small one.
          </BubbleContent>
        </Bubble>
        <MessageFooter>10:42</MessageFooter>
      </MessageContent>
    </Message>
  )
}
