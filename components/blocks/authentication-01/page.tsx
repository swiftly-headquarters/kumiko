"use client"

import { useState } from "react"
import {
  EyeIcon,
  EyeOffIcon,
  FingerprintIcon,
  KeyRoundIcon,
} from "lucide-react"

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
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"

export default function Page() {
  const [show, setShow] = useState(false)
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6">
      <a href="#" className="flex items-center gap-2 text-lg font-semibold">
        <Logo className="size-7" />
        SwiftlyLabs
      </a>
      <div className="flex w-full max-w-sm flex-col gap-6 rounded-xl border bg-card p-6 shadow-xs">
        <header className="flex flex-col gap-1 text-center">
          <h1 className="text-xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to your account to continue.
          </p>
        </header>
        <form
          className="flex flex-col gap-6"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline" type="button" aria-label="Google">
              <GoogleIcon />
            </Button>
            <Button variant="outline" type="button" aria-label="Microsoft">
              <MicrosoftIcon />
            </Button>
            <Button variant="outline" type="button" aria-label="GitHub">
              <GithubIcon />
            </Button>
          </div>
          <Button variant="outline" type="button">
            <KeyRoundIcon />
            Continue with SSO
          </Button>
          <FieldGroup>
            <FieldSeparator>Or continue with email</FieldSeparator>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
                required
              />
            </Field>
            <Field>
              <div className="flex items-center">
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <a
                  href="#"
                  className="ml-auto text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <InputGroup>
                <InputGroupInput
                  id="password"
                  type={show ? "text" : "password"}
                  autoComplete="current-password"
                  required
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    size="icon-xs"
                    aria-label={show ? "Hide password" : "Show password"}
                    onClick={() => setShow((s) => !s)}
                  >
                    {show ? <EyeOffIcon /> : <EyeIcon />}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </Field>
            <Field orientation="horizontal">
              <Checkbox id="remember" />
              <FieldLabel htmlFor="remember" className="font-normal">
                Keep me signed in
              </FieldLabel>
            </Field>
            <Button type="submit">Sign in</Button>
            <Button variant="ghost" type="button">
              <FingerprintIcon />
              Use a passkey
            </Button>
          </FieldGroup>
        </form>
      </div>
      <p className="max-w-sm text-center text-xs text-balance text-muted-foreground">
        No account?{" "}
        <a
          href="#"
          className="underline underline-offset-4 hover:text-foreground"
        >
          Sign up
        </a>
        . By continuing you agree to the{" "}
        <a
          href="#"
          className="underline underline-offset-4 hover:text-foreground"
        >
          Terms
        </a>{" "}
        and{" "}
        <a
          href="#"
          className="underline underline-offset-4 hover:text-foreground"
        >
          Privacy Policy
        </a>
        .
      </p>
    </div>
  )
}
