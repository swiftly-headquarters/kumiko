// title: Several slides per view
// note: Set a basis class on each CarouselItem.

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export default function Demo() {
  return (
    <Carousel opts={{ align: "start" }} className="mx-12 w-full max-w-sm">
      <CarouselContent>
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <CarouselItem key={n} className="basis-1/3">
            <div className="flex aspect-square items-center justify-center rounded-lg border text-2xl font-semibold">
              {n}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
