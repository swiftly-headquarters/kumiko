"use client"

import {
  ArrowDownRightIcon,
  ArrowUpRightIcon,
  BellIcon,
  DownloadIcon,
  SearchIcon,
} from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { Logo } from "@/components/docs/logo"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const stats = [
  { label: "Visitors", value: "48,210", delta: 12.4 },
  { label: "Page views", value: "182,940", delta: 8.1 },
  { label: "Bounce rate", value: "38.2%", delta: -2.6 },
  { label: "Avg. session", value: "4m 12s", delta: -1.3 },
]

const traffic = [
  { day: "Mon", visitors: 4200, returning: 1800 },
  { day: "Tue", visitors: 5100, returning: 2200 },
  { day: "Wed", visitors: 4800, returning: 2400 },
  { day: "Thu", visitors: 6300, returning: 2900 },
  { day: "Fri", visitors: 7100, returning: 3300 },
  { day: "Sat", visitors: 5600, returning: 3100 },
  { day: "Sun", visitors: 5200, returning: 2800 },
]

const config = {
  visitors: { label: "Visitors", color: "var(--brand)" },
  returning: { label: "Returning", color: "var(--chart-3)" },
} satisfies ChartConfig

const pages = [
  { path: "/", views: 48200, share: 100 },
  { path: "/pricing", views: 31400, share: 65 },
  { path: "/docs/getting-started", views: 24900, share: 52 },
  { path: "/blog/launch", views: 17300, share: 36 },
  { path: "/login", views: 11800, share: 24 },
]

const signups = [
  {
    name: "Olivia Martin",
    email: "olivia@acme.io",
    plan: "Team",
    source: "Search",
  },
  {
    name: "Jackson Lee",
    email: "jackson@northwind.com",
    plan: "Starter",
    source: "Referral",
  },
  {
    name: "Isabella Nguyen",
    email: "isabella@globex.dev",
    plan: "Enterprise",
    source: "Direct",
  },
  {
    name: "William Kim",
    email: "will@initech.co",
    plan: "Team",
    source: "Social",
  },
]

const nav = ["Overview", "Reports", "Audience", "Funnels", "Settings"]

export default function Page() {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="flex h-14 items-center gap-4 px-4 md:px-6">
          <a href="#" className="flex items-center gap-2 font-semibold">
            <Logo className="size-6" />
            <span className="hidden sm:inline">SwiftlyLabs</span>
          </a>
          <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
            {nav.map((n, i) => (
              <a
                key={n}
                href="#"
                aria-current={i === 0 ? "page" : undefined}
                className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground aria-[current=page]:bg-muted aria-[current=page]:text-foreground"
              >
                {n}
              </a>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <InputGroup className="hidden w-56 lg:flex">
              <InputGroupAddon>
                <SearchIcon />
              </InputGroupAddon>
              <InputGroupInput placeholder="Search..." aria-label="Search" />
            </InputGroup>
            <Button variant="ghost" size="icon" aria-label="Notifications">
              <BellIcon />
            </Button>
            <Avatar className="size-8">
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-4 md:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
            <p className="text-sm text-muted-foreground">
              How people find and use your product.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select defaultValue="Last 7 days">
              <SelectTrigger aria-label="Range" className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Last 7 days", "Last 30 days", "Last 90 days"].map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline">
              <DownloadIcon />
              Export
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((s) => {
            const up = s.delta > 0
            return (
              <Card key={s.label}>
                <CardHeader>
                  <CardDescription>{s.label}</CardDescription>
                  <CardTitle className="text-2xl tabular-nums">
                    {s.value}
                  </CardTitle>
                  <CardAction>
                    <Badge variant="outline" className="gap-1">
                      {up ? <ArrowUpRightIcon /> : <ArrowDownRightIcon />}
                      {Math.abs(s.delta)}%
                    </Badge>
                  </CardAction>
                </CardHeader>
              </Card>
            )
          })}
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Traffic</CardTitle>
              <CardDescription>Visitors per day this week</CardDescription>
              <CardAction>
                <Tabs defaultValue="visitors">
                  <TabsList>
                    <TabsTrigger value="visitors">Visitors</TabsTrigger>
                    <TabsTrigger value="returning">Returning</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardAction>
            </CardHeader>
            <CardContent>
              <ChartContainer config={config} className="h-64 w-full">
                <AreaChart data={traffic}>
                  <defs>
                    <linearGradient
                      id="fill-visitors"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="var(--color-visitors)"
                        stopOpacity={0.35}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-visitors)"
                        stopOpacity={0.02}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="day"
                    interval={0}
                    padding={{ left: 16, right: 16 }}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent indicator="line" />}
                  />
                  <Area
                    dataKey="returning"
                    type="monotone"
                    stroke="var(--color-returning)"
                    fill="var(--color-returning)"
                    fillOpacity={0.1}
                  />
                  <Area
                    dataKey="visitors"
                    type="monotone"
                    stroke="var(--color-visitors)"
                    fill="url(#fill-visitors)"
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top pages</CardTitle>
              <CardDescription>Most visited this week</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {pages.map((p) => (
                <div key={p.path} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between gap-2 text-sm">
                    <span className="truncate font-mono text-xs">{p.path}</span>
                    <span className="text-muted-foreground tabular-nums">
                      {p.views.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={p.share} className="h-1.5" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent sign-ups</CardTitle>
            <CardDescription>New accounts from the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Email</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead className="text-right">Source</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {signups.map((s) => (
                  <TableRow key={s.email}>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell className="hidden text-muted-foreground sm:table-cell">
                      {s.email}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{s.plan}</Badge>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {s.source}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
