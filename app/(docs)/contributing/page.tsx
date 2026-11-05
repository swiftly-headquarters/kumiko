import type { Metadata } from "next"

import { Rise } from "@/components/docs/rise"

export const metadata: Metadata = { title: "Contributing" }

const code =
  "rounded-md bg-accent px-1.5 py-0.5 font-mono text-[0.9em] text-foreground"
const block =
  "overflow-x-auto rounded-lg bg-accent p-4 font-mono text-sm leading-relaxed"

export default function Page() {
  return (
    <div className="flex max-w-3xl flex-col gap-10 py-8 md:pl-6">
      <Rise className="flex flex-col gap-3">
        <h1 className="text-4xl font-semibold tracking-tight">Contributing</h1>
        <p className="text-lg text-muted-foreground">
          How to change Kumiko: set up, add a component or docs page, validate,
          and open a pull request.
        </p>
      </Rise>

      <section className="flex flex-col gap-3">
        <h2 className="text-2xl font-semibold tracking-tight">
          Before you start
        </h2>
        <p className="text-muted-foreground">
          For anything bigger than a small fix, open an issue first and agree on
          scope and API before writing code. Small fixes and docs tweaks can go
          straight to a pull request.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-2xl font-semibold tracking-tight">1. Setup</h2>
        <pre className={block}>
          <code>{`npm install\nnpm run dev`}</code>
        </pre>
        <p className="text-muted-foreground">
          The docs site runs on <code className={code}>localhost:3000</code>.
          Re-run <code className={code}>npm install</code> after a rebase that
          changes <code className={code}>package.json</code>.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-2xl font-semibold tracking-tight">
          2. Pick the change type
        </h2>
        <ul className="flex list-disc flex-col gap-2 pl-5 text-muted-foreground">
          <li>
            <strong className="text-foreground">Component:</strong>{" "}
            <code className={code}>components/ui/</code>
          </li>
          <li>
            <strong className="text-foreground">Block:</strong>{" "}
            <code className={code}>components/blocks/</code>
          </li>
          <li>
            <strong className="text-foreground">Docs only:</strong> demos,
            props tables and pages under <code className={code}>docs/</code>,{" "}
            <code className={code}>app/</code> and{" "}
            <code className={code}>lib/docs/</code>
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-2xl font-semibold tracking-tight">
          3. Add a component
        </h2>
        <ol className="flex list-decimal flex-col gap-2 pl-5 text-muted-foreground">
          <li>
            Write the component in <code className={code}>components/ui/</code>{" "}
            on Base UI and Motion. Use <code className={code}>cn()</code> for
            class names and the theme tokens (<code className={code}>bg-primary</code>
            , <code className={code}>text-muted-foreground</code>) instead of raw
            colors.
          </li>
          <li>
            Add a demo at{" "}
            <code className={code}>docs/demos/&lt;slug&gt;/default.tsx</code>.
            Start the file with a{" "}
            <code className={code}>{"// title:"}</code> line.
          </li>
          <li>
            Add props in <code className={code}>docs/props/&lt;slug&gt;.json</code>.
          </li>
          <li>
            Add an entry to <code className={code}>lib/docs/components.ts</code>{" "}
            and set <code className={code}>visual</code> to match whether the
            demo renders a preview.
          </li>
          <li>
            Add the item to <code className={code}>registry.json</code>, then run{" "}
            <code className={code}>npm run registry:build</code>. This writes{" "}
            <code className={code}>public/r/*.json</code>. Commit the generated
            files with your change.
          </li>
        </ol>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-2xl font-semibold tracking-tight">
          4. Validate before opening a pull request
        </h2>
        <pre className={block}>
          <code>{`npm run lint\nnpm run typecheck\nnpm run format`}</code>
        </pre>
        <p className="text-muted-foreground">
          Check the change in the browser at the widths it affects, including
          mobile. Confirm keyboard use and focus, and check that the component
          still works with reduced motion on.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-2xl font-semibold tracking-tight">
          5. Open the pull request
        </h2>
        <ul className="flex list-disc flex-col gap-2 pl-5 text-muted-foreground">
          <li>Branch from <code className={code}>main</code>.</li>
          <li>
            Describe what changed, why, and how you tested it. Add screenshots
            for visual changes.
          </li>
          <li>
            After review starts, add follow-up commits rather than force-pushing
            rewritten history.
          </li>
        </ul>
      </section>
    </div>
  )
}
