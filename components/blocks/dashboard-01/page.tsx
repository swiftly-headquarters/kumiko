import { AppSearch } from "@/components/blocks/dashboard-01/app-search"
import { AppSidebar } from "@/components/blocks/dashboard-01/app-sidebar"
import { user } from "@/components/blocks/dashboard-01/data"
import { NavUser } from "@/components/blocks/dashboard-01/nav-user"
import { ThemeToggle } from "@/components/blocks/dashboard-01/theme-toggle"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"

const stats = ["Nodes", "Apps", "Requests"]

export default function Page() {
  return (
    <SidebarProvider peekable>
      <AppSidebar />
      <SidebarInset>
        <header className="@container/header flex h-14 shrink-0 items-center gap-1.5 border-b px-3 @xl/header:gap-2 @xl/header:px-4">
          <SidebarTrigger render={<button />} className="-ml-1" />
          <Separator orientation="vertical" className="mx-1 h-5 self-center!" />
          <h1 className="hidden text-sm font-medium @3xl/header:block">
            Overview
          </h1>
          <div className="flex min-w-0 flex-1 justify-center @xl/header:px-2">
            <AppSearch />
          </div>
          <ThemeToggle />
          <NavUser user={user} />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            {stats.map((s) => (
              <Card key={s}>
                <CardHeader>
                  <CardDescription>{s}</CardDescription>
                  <Skeleton className="h-8 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-3 w-36" />
                </CardContent>
              </Card>
            ))}
          </div>
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Recent activity</CardTitle>
              <CardDescription>
                Deploys, restarts and access changes
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="size-9 shrink-0 rounded-full" />
                  <div className="flex flex-1 flex-col gap-2">
                    <Skeleton className="h-3.5 w-2/5" />
                    <Skeleton className="h-3 w-3/5" />
                  </div>
                  <Skeleton className="h-3 w-12" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
