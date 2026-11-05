// title: Aligned to the end

import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Message, MessageContent, MessageFooter } from "@/components/ui/message"

export default function Demo() {
  return (
    <Message align="end" className="max-w-md">
      <MessageContent>
        <Bubble align="end">
          <BubbleContent>Sure, looking at it now.</BubbleContent>
        </Bubble>
        <MessageFooter>Delivered</MessageFooter>
      </MessageContent>
    </Message>
  )
}
