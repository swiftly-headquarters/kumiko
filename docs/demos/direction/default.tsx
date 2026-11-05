import { DirectionProvider, useDirection } from "@/components/ui/direction"

function Child() {
  const direction = useDirection()
  return <p>{direction}</p>
}

export default function Demo() {
  return (
    <DirectionProvider direction="rtl">
      <Child />
    </DirectionProvider>
  )
}
