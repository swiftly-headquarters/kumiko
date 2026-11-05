import { AppSearch } from "@/components/blocks/dashboard-01/app-search"
import { AppSidebar } from "@/components/blocks/dashboard-01/app-sidebar"
import { orgs, user } from "@/components/blocks/dashboard-01/data"
import { NavUser } from "@/components/blocks/dashboard-01/nav-user"
import { OrgSwitcher } from "@/components/blocks/dashboard-01/org-switcher"
import { ThemeToggle } from "@/components/blocks/dashboard-01/theme-toggle"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="@container/header flex h-14 shrink-0 items-center gap-1.5 border-b px-3 @xl/header:gap-2 @xl/header:px-4">
          <SidebarTrigger render={<button />} className="-ml-1" />
          <OrgSwitcher orgs={orgs} />
          <div className="flex min-w-0 flex-1 justify-center @xl/header:px-2">
            <AppSearch />
          </div>
          <ThemeToggle />
          <NavUser user={user} />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
          </div>
          <div className="min-h-[60vh] flex-1 rounded-xl bg-muted/50" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
