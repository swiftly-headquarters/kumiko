import { Bubble, BubbleContent, BubbleGroup } from "@/components/ui/bubble"

export default function Demo() {
  return (
    <BubbleGroup className="w-full max-w-md">
      <Bubble variant="secondary">
        <BubbleContent>Hey, is the build green?</BubbleContent>
      </Bubble>
      <Bubble align="end">
        <BubbleContent>Yes, just merged it.</BubbleContent>
      </Bubble>
      <Bubble variant="secondary">
        <BubbleContent>Great, shipping it now.</BubbleContent>
      </Bubble>
    </BubbleGroup>
  )
}
