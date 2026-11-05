// note: success, info, warning, error and loading each get an icon.

"use client"

import { Button } from "@/components/ui/button"
import { Toaster, createToastManager } from "@/components/ui/toast"

const manager = createToastManager()

const types = ["success", "info", "warning", "error"] as const

export default function Demo() {
  return (
    <Toaster toastManager={manager}>
      <div className="flex flex-wrap gap-2">
        {types.map((type) => (
          <Button
            key={type}
            variant="outline"
            className="capitalize"
            onClick={() =>
              manager.add({
                type,
                title: `${type[0].toUpperCase()}${type.slice(1)}`,
                description: `This is a ${type} toast.`,
              })
            }
          >
            {type}
          </Button>
        ))}
      </div>
    </Toaster>
  )
}
