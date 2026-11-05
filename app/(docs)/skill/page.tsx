import type { Metadata } from "next"
import { CheckIcon, XIcon } from "lucide-react"

import { CodeView } from "@/components/docs/code-view"
import { Rise } from "@/components/docs/rise"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = { title: "Design skill" }

type Rule = {
  title: string
  body: string
  good: React.ReactNode
  bad: React.ReactNode
}

const mono = "rounded-md bg-accent px-1.5 py-0.5 font-mono text-[0.9em]"

const sections: { id: string; label: string; rules: Rule[] }[] = [
  {
    id: "typography",
    label: "Typography",
    rules: [
      {
        title: "Set content text at 14px",
        body: "Body text, buttons, data and every interactive element use text-sm. Larger sizes are for headings only.",
        good: (
          <div className="flex flex-col gap-1">
            <p className="text-lg font-semibold">API tokens</p>
            <p className="text-sm">Production token expires in 30 days.</p>
          </div>
        ),
        bad: (
          <div className="flex flex-col gap-1">
            <p className="text-lg font-semibold">API tokens</p>
            <p className="text-lg">Production token expires in 30 days.</p>
          </div>
        ),
      },
      {
        title: "Write headings in sentence case",
        body: "Capitalize the first word and proper nouns only. No title case, no uppercase headings.",
        good: <p className="text-lg font-semibold">Recent requests</p>,
        bad: <p className="text-lg font-semibold">Recent Requests</p>,
      },
      {
        title: "Avoid font-bold",
        body: "Use font-semibold for headings and font-medium for emphasis inside a sentence.",
        good: (
          <p className="text-sm">
            Review the <span className="font-medium">required</span> step.
          </p>
        ),
        bad: (
          <p className="text-sm">
            Review the <span className="font-bold">required</span> step.
          </p>
        ),
      },
      {
        title: "Shrink inline monospaced text",
        body: "Code inside a sentence is 0.9em, so it does not look larger than the text around it.",
        good: (
          <p className="text-sm">
            Edit <code className={mono}>notify.config.json</code> to continue.
          </p>
        ),
        bad: (
          <p className="text-sm">
            Edit{" "}
            <code className="rounded-md bg-accent px-1.5 py-0.5 font-mono text-base">
              notify.config.json
            </code>{" "}
            to continue.
          </p>
        ),
      },
    ],
  },
  {
    id: "color",
    label: "Color & surfaces",
    rules: [
      {
        title: "Use theme tokens, not raw colors",
        body: "bg-background, text-foreground, text-muted-foreground, bg-accent and border follow the theme and dark mode. Raw palette colors do not.",
        good: (
          <p className="rounded-md border bg-accent px-3 py-2 text-sm text-foreground">
            Saved
          </p>
        ),
        bad: (
          <p className="rounded-md border border-neutral-300 bg-neutral-200 px-3 py-2 text-sm text-black">
            Saved
          </p>
        ),
      },
      {
        title: "Mute secondary text",
        body: "Descriptions, hints and metadata use text-muted-foreground. Do not lower opacity on foreground text.",
        good: (
          <div className="flex flex-col">
            <p className="text-sm font-medium">Billing</p>
            <p className="text-sm text-muted-foreground">Invoices and plans</p>
          </div>
        ),
        bad: (
          <div className="flex flex-col">
            <p className="text-sm font-medium">Billing</p>
            <p className="text-sm opacity-50">Invoices and plans</p>
          </div>
        ),
      },
      {
        title: "Use borders for resting surfaces",
        body: "Cards and panels rest on a 1px border. Reserve shadows for hover lift and floating overlays.",
        good: <div className="rounded-xl border p-4 text-sm">Resting card</div>,
        bad: (
          <div className="rounded-xl p-4 text-sm shadow-xl">Resting card</div>
        ),
      },
    ],
  },
  {
    id: "shape",
    label: "Shape & focus",
    rules: [
      {
        title: "Take radius from the scale",
        body: "Controls use rounded-md, panels use rounded-xl. Do not use arbitrary pixel radii.",
        good: (
          <Button variant="outline" size="sm">
            Cancel
          </Button>
        ),
        bad: (
          <button
            type="button"
            className="h-8 rounded-[3px] border px-3 text-sm"
          >
            Cancel
          </button>
        ),
      },
      {
        title: "Keep a visible focus ring",
        body: "Every interactive element shows focus-visible:ring. Never remove an outline without a replacement.",
        good: (
          <button
            type="button"
            className="h-8 rounded-md border px-3 text-sm ring-3 ring-ring/50"
          >
            Focused
          </button>
        ),
        bad: (
          <button
            type="button"
            className="h-8 rounded-md border px-3 text-sm outline-none"
          >
            Focused
          </button>
        ),
      },
    ],
  },
  {
    id: "motion",
    label: "Motion & interaction",
    rules: [
      {
        title: "Animate transform, opacity and shadow",
        body: "Keep transitions between 150ms and 300ms with ease-out. Do not animate width, height or margin.",
        good: (
          <div className="rounded-xl border p-4 text-sm transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-lg">
            Hover me
          </div>
        ),
        bad: (
          <div className="rounded-xl border p-4 text-sm transition-[margin] duration-1000 hover:mt-2">
            Hover me
          </div>
        ),
      },
      {
        title: "Respect reduced motion",
        body: "Pair every transform with motion-reduce:transition-none and motion-reduce:hover:translate-y-0. Motion components follow the user setting.",
        good: (
          <div className="rounded-xl border p-4 text-sm transition-transform duration-300 hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
            Hover me
          </div>
        ),
        bad: (
          <div className="rounded-xl border p-4 text-sm transition-transform duration-300 hover:-translate-y-1">
            Hover me
          </div>
        ),
      },
    ],
  },
]

// Same rules as plain markdown, to paste into an agent prompt or skill file.
const markdown = [
  "# Kumiko design rules",
  "",
  "Follow these rules when building or reviewing Kumiko interfaces.",
  "",
  ...sections.flatMap((s) => [
    `## ${s.label}`,
    ...s.rules.map((r) => `- **${r.title}.** ${r.body}`),
    "",
  ]),
].join("\n")

function Example({
  ok,
  children,
}: {
  ok: boolean
  children: React.ReactNode
}) {
  const Icon = ok ? CheckIcon : XIcon
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <p
        className={
          ok
            ? "flex items-center gap-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400"
            : "flex items-center gap-1.5 text-sm font-medium text-red-600 dark:text-red-400"
        }
      >
        <Icon className="size-4" />
        {ok ? "Correct example" : "Example to avoid"}
      </p>
      <div className="flex min-h-24 items-center rounded-xl border bg-muted/40 p-4">
        {children}
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <div className="flex max-w-3xl flex-col gap-10 py-8 md:pl-6">
      <Rise className="flex flex-col gap-3">
        <h1 className="text-4xl font-semibold tracking-tight">Design skill</h1>
        <p className="text-lg text-muted-foreground">
          The SwiftlyLabs design rules Kumiko follows. Use them to build or
          review an interface so it matches the components.
        </p>
      </Rise>

      <Tabs defaultValue="typography" className="gap-6">
        {/* Full width; labels wrap on narrow screens instead of overflowing. */}
        <TabsList className="w-full group-data-horizontal/tabs:h-auto group-data-horizontal/tabs:min-h-8">
          {sections.map((s) => (
            <TabsTrigger
              key={s.id}
              value={s.id}
              className="min-w-0 px-2 py-1 text-center whitespace-normal"
            >
              {s.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {sections.map((s) => (
          <TabsContent key={s.id} value={s.id}>
            {/* TabsContent wraps children in a motion.div, so layout goes here. */}
            <div className="flex flex-col gap-10">
              {s.rules.map((r) => (
                <section key={r.title} className="flex flex-col gap-3">
                  <h2 className="text-xl font-semibold">{r.title}</h2>
                  <p className="text-sm text-muted-foreground">{r.body}</p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Example ok>{r.good}</Example>
                    <Example ok={false}>{r.bad}</Example>
                  </div>
                </section>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <section className="flex flex-col gap-3">
        <h2 className="text-2xl font-semibold tracking-tight">
          Use the rules with an agent
        </h2>
        <p className="text-sm text-muted-foreground">
          Copy the rules below into your agent instructions or a skill file.
          Then ask it to check any new or changed interface against them.
        </p>
        <CodeView code={markdown} language="markdown" />
      </section>
    </div>
  )
}
