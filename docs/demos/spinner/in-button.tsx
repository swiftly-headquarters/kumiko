// title: In a button

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

export default function Demo() {
  return (
    <Button disabled>
      <Spinner />
      Loading
    </Button>
  )
}
