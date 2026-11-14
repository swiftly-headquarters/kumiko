"use client"

import { useState } from "react"
import { CheckIcon, QuoteIcon } from "lucide-react"

import {
  GithubIcon,
  GoogleIcon,
  MicrosoftIcon,
} from "@/components/blocks/auth-icons"
import { Logo } from "@/components/docs/logo"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"

const rules = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "A number", test: (p: string) => /\d/.test(p) },
  { label: "An uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
]

export default function Page() {
  const [password, setPassword] = useState("")
  const passed = rules.filter((r) => r.test(password)).length
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <aside className="text-brand-foreground relative hidden flex-col justify-between overflow-hidden bg-brand p-10 lg:flex">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -bottom-24 size-96 rounded-full bg-white/10 blur-3xl"
        />
        <a
          href="#"
          className="relative flex items-center gap-2 text-lg font-semibold"
        >
          <Logo className="size-7" />
          SwiftlyLabs
        </a>
        <figure className="relative flex max-w-md flex-col gap-4">
          <QuoteIcon className="size-8 opacity-60" />
          <blockquote className="text-2xl leading-snug font-medium text-balance">
            We moved our whole fleet onto SwiftlyLabs in a weekend. Sign-in
            through our identity provider just worked.
          </blockquote>
          <figcaption className="text-sm opacity-80">
            Alex Moreau, Head of Platform at Northwind
          </figcaption>
        </figure>
      </aside>
      <main className="flex items-center justify-center p-6 md:p-10">
        <form
          className="flex w-full max-w-sm flex-col gap-6"
          onSubmit={(e) => e.preventDefault()}
        >
          <header className="flex flex-col gap-1">
            <a
              href="#"
              className="mb-4 flex items-center gap-2 font-semibold lg:hidden"
            >
              <Logo className="size-6" />
              SwiftlyLabs
            </a>
            <h1 className="text-2xl font-semibold tracking-tight">
              Create your account
            </h1>
            <p className="text-sm text-muted-foreground">
              Free for 14 days. No credit card required.
            </p>
          </header>
          <div className="flex flex-col gap-2">
            <Button variant="outline" type="button">
              <GoogleIcon />
              Sign up with Google
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" type="button">
                <MicrosoftIcon />
                Microsoft
              </Button>
              <Button variant="outline" type="button">
                <GithubIcon />
                GitHub
              </Button>
            </div>
          </div>
          <FieldGroup>
            <FieldSeparator>Or with email</FieldSeparator>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="first">First name</FieldLabel>
                <Input id="first" autoComplete="given-name" required />
              </Field>
              <Field>
                <FieldLabel htmlFor="last">Last name</FieldLabel>
                <Input id="last" autoComplete="family-name" required />
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="work-email">Work email</FieldLabel>
              <Input
                id="work-email"
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
                required
              />
              <FieldDescription>
                Teams with single sign-on are redirected to their provider.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="new-password">Password</FieldLabel>
              <Input
                id="new-password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Progress value={(passed / rules.length) * 100} className="h-1" />
              <ul className="grid gap-1 text-xs text-muted-foreground">
                {rules.map((r) => {
                  const ok = r.test(password)
                  return (
                    <li
                      key={r.label}
                      className={
                        ok
                          ? "flex items-center gap-1.5 text-foreground"
                          : "flex items-center gap-1.5"
                      }
                    >
                      <CheckIcon
                        className={
                          ok ? "size-3.5 text-brand" : "size-3.5 opacity-30"
                        }
                      />
                      {r.label}
                    </li>
                  )
                })}
              </ul>
            </Field>
            <Field orientation="horizontal">
              <Checkbox id="terms" required />
              <FieldLabel htmlFor="terms" className="font-normal">
                I agree to the Terms and Privacy Policy
              </FieldLabel>
            </Field>
            <Button type="submit" disabled={passed < rules.length}>
              Create account
            </Button>
          </FieldGroup>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <a
              href="#"
              className="underline underline-offset-4 hover:text-foreground"
            >
              Sign in
            </a>
          </p>
        </form>
      </main>
    </div>
  )
}
