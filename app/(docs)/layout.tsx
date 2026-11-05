import { Navbar } from "@/components/docs/navbar"
import { DocsNavProvider, Sidebar } from "@/components/docs/sidebar"

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DocsNavProvider>
      <Navbar menu />
      <div className="mx-auto grid max-w-[90rem] grid-cols-1 px-4 md:grid-cols-[15rem_minmax(0,1fr)] md:px-6">
        <Sidebar />
        <main className="min-w-0 pb-24">{children}</main>
      </div>
    </DocsNavProvider>
  )
}
