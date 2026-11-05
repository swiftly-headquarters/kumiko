import {
  Bubble,
  BubbleContent,
  BubbleGroup,
  BubbleReactions,
} from "@/components/ui/bubble"

export default function Demo() {
  return (
    <BubbleGroup className="w-full max-w-md pt-3 pb-3">
      <Bubble variant="secondary">
        <BubbleContent>Deploy finished without errors.</BubbleContent>
        <BubbleReactions>+1 (2)</BubbleReactions>
      </Bubble>
      <Bubble align="end">
        <BubbleContent>Nice work, team.</BubbleContent>
        <BubbleReactions side="top" align="start">
          +1
        </BubbleReactions>
      </Bubble>
    </BubbleGroup>
  )
}
