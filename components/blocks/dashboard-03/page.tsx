"use client"

import {
  ChartColumnIcon,
  CreditCardIcon,
  DollarSignIcon,
  LayoutDashboardIcon,
  PackageIcon,
  SearchIcon,
  SettingsIcon,
  ShoppingBagIcon,
  UsersIcon,
} from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import { Logo } from "@/components/docs/logo"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Card,
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
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const nav = [
  { title: "Dashboard", icon: LayoutDashboardIcon, active: true },
  { title: "Orders", icon: ShoppingBagIcon },
  { title: "Products", icon: PackageIcon },
  { title: "Customers", icon: UsersIcon },
  { title: "Analytics", icon: ChartColumnIcon },
  { title: "Payments", icon: CreditCardIcon },
  { title: "Settings", icon: SettingsIcon },
]

const kpis = [
  {
    icon: DollarSignIcon,
    label: "Revenue",
    value: "$84,320",
    note: "+18% from last month",
  },
  {
    icon: ShoppingBagIcon,
    label: "Orders",
    value: "1,284",
    note: "+6% from last month",
  },
  { icon: UsersIcon, label: "Customers", value: "892", note: "+41 this week" },
  {
    icon: CreditCardIcon,
    label: "Refunds",
    value: "$1,240",
    note: "-9% from last month",
  },
]

const revenue = [
  { month: "Jun", revenue: 42 },
  { month: "Jul", revenue: 51 },
  { month: "Aug", revenue: 48 },
  { month: "Sep", revenue: 63 },
  { month: "Oct", revenue: 71 },
  { month: "Nov", revenue: 84 },
]

const config = {
  revenue: { label: "Revenue ($k)", color: "var(--brand)" },
} satisfies ChartConfig

type Status = "Paid" | "Pending" | "Refunded"

const orders: {
  id: string
  customer: string
  total: string
  status: Status
}[] = [
  { id: "#4821", customer: "Liam Johnson", total: "$250.00", status: "Paid" },
  {
    id: "#4820",
    customer: "Noah Williams",
    total: "$150.00",
    status: "Pending",
  },
  { id: "#4819", customer: "Emma Brown", total: "$350.00", status: "Paid" },
  { id: "#4818", customer: "Ava Davis", total: "$450.00", status: "Refunded" },
  { id: "#4817", customer: "Mia Garcia", total: "$550.00", status: "Paid" },
]

const variant: Record<Status, "default" | "secondary" | "outline"> = {
  Paid: "default",
  Pending: "secondary",
  Refunded: "outline",
}

export default function Page() {
  return (
    <SidebarProvider peekable>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                className="group-data-[collapsible=icon]:p-[5px]!"
                render={<a href="#" />}
              >
                <Logo className="size-6! shrink-0" />
                <span className="truncate text-base font-semibold">
                  Storefront
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              {nav.map((n) => (
                <SidebarMenuItem key={n.title}>
                  <SidebarMenuButton
                    tooltip={n.title}
                    isActive={n.active}
                    render={<a href="#" />}
                  >
                    <n.icon />
                    <span>{n.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger render={<button />} className="-ml-1" />
          <InputGroup className="max-w-sm">
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Search orders, customers..."
              aria-label="Search"
            />
          </InputGroup>
          <Avatar className="ml-auto size-8">
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {kpis.map((k) => (
              <Card key={k.label}>
                <CardHeader>
                  <CardDescription className="flex items-center justify-between">
                    {k.label}
                    <k.icon className="size-4" />
                  </CardDescription>
                  <CardTitle className="text-2xl tabular-nums">
                    {k.value}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">{k.note}</p>
                </CardHeader>
              </Card>
            ))}
          </div>
          <div className="grid gap-4 xl:grid-cols-5">
            <Card className="xl:col-span-3">
              <CardHeader>
                <CardTitle>Revenue</CardTitle>
                <CardDescription>Last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={config} className="h-60 w-full">
                  <BarChart data={revenue}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="month"
                      interval={0}
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey="revenue"
                      fill="var(--color-revenue)"
                      radius={4}
                    />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
            <Card className="xl:col-span-2">
              <CardHeader>
                <CardTitle>Recent orders</CardTitle>
                <Tabs defaultValue="all">
                  <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="paid">Paid</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((o) => (
                      <TableRow key={o.id}>
                        <TableCell>
                          <div className="font-medium">{o.customer}</div>
                          <div className="text-xs text-muted-foreground">
                            {o.id}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={variant[o.status]}>{o.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {o.total}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
