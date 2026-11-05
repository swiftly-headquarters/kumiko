"use client"

import { Button } from "@/components/ui/button"
import { Toaster, createToastManager } from "@/components/ui/toast"

const manager = createToastManager()

export default function Demo() {
  return (
    <Toaster toastManager={manager}>
      <Button
        variant="outline"
        onClick={() =>
          manager.add({
            title: "Event created",
            description: "Sunday, December 03 at 9:00 AM",
          })
        }
      >
        Show toast
      </Button>
    </Toaster>
  )
}
