import { MessageSquareIcon, PaperclipIcon, PlusIcon } from "lucide-react"

import { Logo } from "@/components/docs/logo"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Task = {
  title: string
  tag: string
  progress?: number
  comments: number
  files: number
  people: string[]
}

const columns: { name: string; tasks: Task[] }[] = [
  {
    name: "Backlog",
    tasks: [
      {
        title: "Audit log export",
        tag: "Feature",
        comments: 3,
        files: 0,
        people: ["AM"],
      },
      {
        title: "Rate limit headers",
        tag: "API",
        comments: 1,
        files: 1,
        people: ["JL", "KS"],
      },
    ],
  },
  {
    name: "In progress",
    tasks: [
      {
        title: "SSO provider setup flow",
        tag: "Auth",
        progress: 60,
        comments: 8,
        files: 2,
        people: ["OM", "WK"],
      },
      {
        title: "Dark mode for dashboards",
        tag: "Design",
        progress: 85,
        comments: 5,
        files: 4,
        people: ["IN"],
      },
      {
        title: "Webhook retries",
        tag: "API",
        progress: 30,
        comments: 2,
        files: 0,
        people: ["JL"],
      },
    ],
  },
  {
    name: "In review",
    tasks: [
      {
        title: "Passkey sign-in",
        tag: "Auth",
        progress: 100,
        comments: 12,
        files: 3,
        people: ["AM", "OM"],
      },
    ],
  },
  {
    name: "Done",
    tasks: [
      {
        title: "Team invitations",
        tag: "Feature",
        comments: 6,
        files: 1,
        people: ["KS"],
      },
      {
        title: "Billing portal",
        tag: "Billing",
        comments: 4,
        files: 2,
        people: ["WK", "IN"],
      },
    ],
  },
]

export default function Page() {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="flex h-14 shrink-0 items-center gap-3 border-b px-4 md:px-6">
        <a href="#" className="flex items-center gap-2 font-semibold">
          <Logo className="size-6" />
          <span className="hidden sm:inline">SwiftlyLabs</span>
        </a>
        <Separator orientation="vertical" className="h-5" />
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
          Projects / <span className="text-foreground">Platform v2</span>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <div className="hidden -space-x-1 sm:flex">
            {["AM", "JL", "OM", "KS"].map((p) => (
              <Avatar key={p} className="size-7 ring-2 ring-background">
                <AvatarFallback className="text-[10px]">{p}</AvatarFallback>
              </Avatar>
            ))}
          </div>
          <Button size="sm">
            <PlusIcon />
            New task
          </Button>
        </div>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 md:px-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Platform v2</h1>
          <p className="text-sm text-muted-foreground">
            Sprint 14 · ends Friday · 9 of 24 tasks done
          </p>
        </div>
        <Tabs defaultValue="board">
          <TabsList>
            <TabsTrigger value="board">Board</TabsTrigger>
            <TabsTrigger value="list">List</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <main className="grid flex-1 gap-4 overflow-x-auto px-4 pb-6 md:grid-cols-2 md:px-6 xl:grid-cols-4">
        {columns.map((c) => (
          <section
            key={c.name}
            aria-label={c.name}
            className="flex min-w-64 flex-col gap-3 rounded-xl border p-3"
          >
            <h2 className="flex items-center gap-2 px-1 text-sm font-medium">
              {c.name}
              <Badge variant="secondary">{c.tasks.length}</Badge>
            </h2>
            {c.tasks.map((t) => (
              <article
                key={t.title}
                className="flex flex-col gap-3 rounded-lg border bg-card p-3 shadow-xs"
              >
                <Badge variant="outline" className="w-fit">
                  {t.tag}
                </Badge>
                <h3 className="text-sm leading-snug font-medium">{t.title}</h3>
                {t.progress !== undefined && (
                  <Progress value={t.progress} className="h-1.5" />
                )}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <MessageSquareIcon className="size-3.5" />
                      {t.comments}
                    </span>
                    <span className="flex items-center gap-1">
                      <PaperclipIcon className="size-3.5" />
                      {t.files}
                    </span>
                  </div>
                  <div className="flex -space-x-1">
                    {t.people.map((p) => (
                      <Avatar key={p} className="size-6 ring-2 ring-card">
                        <AvatarFallback className="text-[9px]">
                          {p}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </section>
        ))}
      </main>
    </div>
  )
}
