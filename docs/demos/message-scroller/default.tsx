// note: Scroll up to reveal the jump-to-latest button.

import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Message, MessageContent } from "@/components/ui/message"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"

const messages = Array.from({ length: 20 }, (_, i) => ({
  id: `m${i}`,
  mine: i % 2 === 1,
  text: i % 2 === 1 ? `Reply number ${i + 1}` : `Question number ${i + 1}`,
}))

export default function Demo() {
  return (
    <MessageScrollerProvider>
      <MessageScroller className="h-72 max-w-md rounded-lg border">
        <MessageScrollerViewport className="p-4">
          <MessageScrollerContent>
            {messages.map((m) => (
              <MessageScrollerItem key={m.id} messageId={m.id}>
                <Message align={m.mine ? "end" : "start"}>
                  <MessageContent>
                    <Bubble
                      align={m.mine ? "end" : "start"}
                      variant={m.mine ? "default" : "secondary"}
                    >
                      <BubbleContent>{m.text}</BubbleContent>
                    </Bubble>
                  </MessageContent>
                </Message>
              </MessageScrollerItem>
            ))}
          </MessageScrollerContent>
        </MessageScrollerViewport>
        <MessageScrollerButton />
      </MessageScroller>
    </MessageScrollerProvider>
  )
}
