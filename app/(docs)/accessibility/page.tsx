import type { Metadata } from "next"

import { Rise } from "@/components/docs/rise"

export const metadata: Metadata = { title: "Accessibility" }

const code =
  "rounded-md bg-accent px-1.5 py-0.5 font-mono text-[0.9em] text-foreground"

export default function Page() {
  return (
    <div className="flex max-w-3xl flex-col gap-10 py-8 md:pl-6">
      <Rise className="flex flex-col gap-3">
        <h1 className="text-4xl font-semibold tracking-tight">Accessibility</h1>
        <p className="text-lg text-muted-foreground">
          What Kumiko handles for you, and what your app still needs to get
          right.
        </p>
      </Rise>

      <section className="flex flex-col gap-3">
        <h2 className="text-2xl font-semibold tracking-tight">
          Keyboard navigation
        </h2>
        <p className="text-muted-foreground">
          Components are built on Base UI, which follows the WAI-ARIA Authoring
          Practices. Keyboard support works without extra setup. Many components
          respond to arrow keys, Home, End, Enter and Esc.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-2xl font-semibold tracking-tight">Focus</h2>
        <p className="text-muted-foreground">
          Components move focus after user actions, such as moving focus into a
          dialog when it opens and back to the trigger when it closes. Some
          expose <code className={code}>initialFocus</code> and{" "}
          <code className={code}>finalFocus</code> to change that.
        </p>
        <p className="text-muted-foreground">
          Focus indicators are styled in each component with{" "}
          <code className={code}>focus-visible:ring</code>. If you override
          styles, keep a visible focus indicator.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-2xl font-semibold tracking-tight">Color contrast</h2>
        <p className="text-muted-foreground">
          Foreground text needs enough contrast against its background. The
          default theme uses semantic tokens such as{" "}
          <code className={code}>text-foreground</code> and{" "}
          <code className={code}>text-muted-foreground</code>. Check any custom
          color pair you add.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-2xl font-semibold tracking-tight">Labels</h2>
        <p className="text-muted-foreground">
          Form controls such as <code className={code}>Field</code>,{" "}
          <code className={code}>Input</code> and{" "}
          <code className={code}>Checkbox</code> are wired to their labels
          automatically. A native <code className={code}>&lt;label&gt;</code>{" "}
          also works.
        </p>
        <p className="text-muted-foreground">
          Custom controls need an accessible name through{" "}
          <code className={code}>aria-label</code> or{" "}
          <code className={code}>aria-labelledby</code>.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-2xl font-semibold tracking-tight">Motion</h2>
        <p className="text-muted-foreground">
          Entrance and hover animations turn off when the user prefers reduced
          motion. Use the <code className={code}>animated</code> prop, or the{" "}
          <code className={code}>Animations</code> wrapper, to turn animation off
          for one component or a whole section.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-2xl font-semibold tracking-tight">
          Reporting issues
        </h2>
        <p className="text-muted-foreground">
          If you find an accessibility problem, open an issue with the component
          name, the steps to reproduce it, and the assistive technology or input
          method you used.
        </p>
      </section>
    </div>
  )
}
