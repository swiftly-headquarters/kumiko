import {
  DM_Sans,
  Figtree,
  Geist,
  IBM_Plex_Sans,
  Inter,
  Lora,
  Manrope,
  Outfit,
  Plus_Jakarta_Sans,
  Space_Grotesk,
} from "next/font/google"

const outfit = Outfit({ subsets: ["latin"], preload: false })
const inter = Inter({ subsets: ["latin"], preload: false })
const geist = Geist({ subsets: ["latin"], preload: false })
const dmSans = DM_Sans({ subsets: ["latin"], preload: false })
const figtree = Figtree({ subsets: ["latin"], preload: false })
const manrope = Manrope({ subsets: ["latin"], preload: false })
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], preload: false })
const grotesk = Space_Grotesk({ subsets: ["latin"], preload: false })
const plex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  preload: false,
})
const lora = Lora({ subsets: ["latin"], preload: false })

export const fonts = [
  { name: "Outfit", family: outfit.style.fontFamily },
  { name: "Inter", family: inter.style.fontFamily },
  { name: "Geist", family: geist.style.fontFamily },
  { name: "DM Sans", family: dmSans.style.fontFamily },
  { name: "Figtree", family: figtree.style.fontFamily },
  { name: "Manrope", family: manrope.style.fontFamily },
  { name: "Plus Jakarta Sans", family: jakarta.style.fontFamily },
  { name: "Space Grotesk", family: grotesk.style.fontFamily },
  { name: "IBM Plex Sans", family: plex.style.fontFamily },
  { name: "Lora", family: lora.style.fontFamily },
]
