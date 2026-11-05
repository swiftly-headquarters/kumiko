// title: Bubbles

"use client"

import { WorldMap, type MapBubble } from "@/components/ui/world-map"

const bubbles: MapBubble[] = [
  { id: "nyc", label: "New York", lat: 40.7, lng: -74, value: 820 },
  { id: "lon", label: "London", lat: 51.5, lng: -0.1, value: 640 },
  { id: "tok", label: "Tokyo", lat: 35.7, lng: 139.7, value: 900 },
  { id: "syd", label: "Sydney", lat: -33.9, lng: 151.2, value: 310 },
  { id: "sao", label: "São Paulo", lat: -23.5, lng: -46.6, value: 450 },
  { id: "mum", label: "Mumbai", lat: 19.1, lng: 72.9, value: 560 },
  { id: "lag", label: "Lagos", lat: 6.5, lng: 3.4, value: 220 },
]

export default function Demo() {
  return <WorldMap bubbles={bubbles} className="max-w-3xl" />
}
