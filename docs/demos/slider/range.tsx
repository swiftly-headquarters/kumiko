// note: Pass an array with two values to render two thumbs.

import { Slider } from "@/components/ui/slider"

export default function Demo() {
  return <Slider defaultValue={[25, 75]} max={100} step={1} className="w-60" />
}
