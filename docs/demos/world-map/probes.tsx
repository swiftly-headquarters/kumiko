// title: Status probes

"use client"

import { WorldMap, type MapProbe } from "@/components/ui/world-map"

const probes: MapProbe[] = [
  { id: "us-east", label: "us-east", lat: 39, lng: -77, status: "up" },
  { id: "us-west", label: "us-west", lat: 37.4, lng: -122, status: "up" },
  { id: "eu-west", label: "eu-west", lat: 53.3, lng: -6.3, status: "degraded" },
  { id: "eu-central", label: "eu-central", lat: 50.1, lng: 8.7, status: "up" },
  { id: "ap-south", label: "ap-south", lat: 19.1, lng: 72.9, status: "down" },
  { id: "ap-northeast", label: "ap-northeast", lat: 35.7, lng: 139.7, status: "up" },
  { id: "sa-east", label: "sa-east", lat: -23.5, lng: -46.6, status: "up" },
]

export default function Demo() {
  return <WorldMap probes={probes} className="max-w-3xl" />
}
