// title: With action

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
            title: "File deleted",
            actionProps: { children: "Undo" },
          })
        }
      >
        Delete file
      </Button>
    </Toaster>
  )
}
