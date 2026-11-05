import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Demo() {
  return (
    <Tabs
      defaultValue="general"
      orientation="vertical"
      className="w-full max-w-sm"
    >
      <TabsList>
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
      </TabsList>
      <TabsContent value="general">General settings.</TabsContent>
      <TabsContent value="billing">Billing settings.</TabsContent>
    </Tabs>
  )
}
