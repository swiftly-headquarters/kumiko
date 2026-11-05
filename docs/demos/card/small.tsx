import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function Demo() {
  return (
    <Card size="sm" className="w-full max-w-xs">
      <CardHeader>
        <CardTitle>Compact card</CardTitle>
        <CardDescription>Tighter spacing.</CardDescription>
      </CardHeader>
      <CardContent>Use size=&quot;sm&quot; for dense layouts.</CardContent>
    </Card>
  )
}
