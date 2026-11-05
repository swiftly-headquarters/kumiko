import { Rise } from "@/components/docs/rise"

export function Section({
  id,
  title,
  note,
  children,
}: {
  id: string
  title: string
  note?: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <Rise scroll className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold tracking-tight">
          <a href={`#${id}`} className="hover:underline">
            {title}
          </a>
        </h2>
        {note && <p className="text-sm text-muted-foreground">{note}</p>}
        {children}
      </Rise>
    </section>
  )
}
