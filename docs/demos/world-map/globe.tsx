// title: Globe

"use client"

import { Globe, type MapProbe } from "@/components/ui/world-map"

const probes: MapProbe[] = [
  { id: "us-east", label: "us-east", lat: 39, lng: -77, status: "up" },
  { id: "eu-west", label: "eu-west", lat: 53.3, lng: -6.3, status: "degraded" },
  { id: "eu-central", label: "eu-central", lat: 50.1, lng: 8.7, status: "up" },
  { id: "ap-south", label: "ap-south", lat: 19.1, lng: 72.9, status: "down" },
  { id: "ap-northeast", label: "ap-northeast", lat: 35.7, lng: 139.7, status: "up" },
  { id: "sa-east", label: "sa-east", lat: -23.5, lng: -46.6, status: "up" },
]

const values = {
  "United States of America": 95,
  China: 90,
  India: 70,
  Brazil: 55,
  Russia: 45,
  Australia: 35,
}

export default function Demo() {
  return <Globe values={values} probes={probes} />
}
