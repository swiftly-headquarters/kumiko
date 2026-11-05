// title: Multiple open
// note: Base UI accordion values are arrays.

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function Demo() {
  return (
    <Accordion multiple defaultValue={["a", "b"]} className="w-full max-w-md">
      <AccordionItem value="a">
        <AccordionTrigger>First section</AccordionTrigger>
        <AccordionContent>Several sections can stay open.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger>Second section</AccordionTrigger>
        <AccordionContent>Opening one does not close another.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="c">
        <AccordionTrigger>Third section</AccordionTrigger>
        <AccordionContent>More content here.</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
