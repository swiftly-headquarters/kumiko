// title: Choropleth

"use client"

import { WorldMap } from "@/components/ui/world-map"

const values = {
  "United States of America": 95,
  Brazil: 60,
  Canada: 55,
  Germany: 70,
  France: 62,
  India: 80,
  China: 88,
  Australia: 40,
  "South Africa": 30,
  Russia: 45,
}

export default function Demo() {
  return <WorldMap values={values} className="max-w-3xl" />
}
