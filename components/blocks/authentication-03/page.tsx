"use client"

import { useState } from "react"
import {
  ArrowLeftIcon,
  Building2Icon,
  FingerprintIcon,
  MailIcon,
  ShieldCheckIcon,
} from "lucide-react"

import { Logo } from "@/components/docs/logo"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

type Step = "email" | "sso" | "code"

export default function Page() {
  const [step, setStep] = useState<Step>("email")
  const [email, setEmail] = useState("")
  const domain = email.split("@")[1]

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6">
      <a href="#" className="flex items-center gap-2 text-lg font-semibold">
        <Logo className="size-7" />
        SwiftlyLabs
      </a>
      <div className="flex w-full max-w-sm flex-col gap-6 rounded-xl border bg-card p-6 shadow-xs">
        {step === "email" && (
          <form
            className="flex flex-col gap-5"
            onSubmit={(e) => {
              e.preventDefault()
              setStep("sso")
            }}
          >
            <header className="flex flex-col gap-1 text-center">
              <h1 className="text-xl font-semibold tracking-tight">
                Sign in to your workspace
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your work email. We find the right way in.
              </p>
            </header>
            <Field>
              <FieldLabel htmlFor="sso-email">Work email</FieldLabel>
              <Input
                id="sso-email"
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Field>
            <Button type="submit">Continue</Button>
            <FieldSeparator>Or</FieldSeparator>
            <div className="flex flex-col gap-2">
              <Button variant="outline" type="button">
                <FingerprintIcon />
                Sign in with a passkey
              </Button>
              <Button
                variant="outline"
                type="button"
                disabled={!email}
                onClick={() => setStep("code")}
              >
                <MailIcon />
                Email me a code
              </Button>
            </div>
          </form>
        )}

        {step === "sso" && (
          <div className="flex flex-col gap-5">
            <header className="flex flex-col items-center gap-3 text-center">
              <span className="flex size-12 items-center justify-center rounded-xl border bg-muted">
                <Building2Icon className="size-6" />
              </span>
              <div className="flex flex-col gap-1">
                <h1 className="text-xl font-semibold tracking-tight">
                  {domain} uses single sign-on
                </h1>
                <p className="text-sm text-muted-foreground">
                  You are redirected to your identity provider to finish signing
                  in.
                </p>
              </div>
            </header>
            <Button>
              <ShieldCheckIcon />
              Continue with SSO
            </Button>
            <Button variant="ghost" onClick={() => setStep("email")}>
              <ArrowLeftIcon />
              Use a different email
            </Button>
          </div>
        )}

        {step === "code" && (
          <form
            className="flex flex-col gap-5"
            onSubmit={(e) => e.preventDefault()}
          >
            <header className="flex flex-col gap-1 text-center">
              <h1 className="text-xl font-semibold tracking-tight">
                Check your email
              </h1>
              <p className="text-sm text-muted-foreground">
                We sent a 6-digit code to{" "}
                <span className="font-medium text-foreground">{email}</span>.
              </p>
            </header>
            <Field className="items-center">
              <FieldLabel htmlFor="otp" className="sr-only">
                Verification code
              </FieldLabel>
              <InputOTP id="otp" maxLength={6} autoFocus>
                <InputOTPGroup>
                  {Array.from({ length: 6 }, (_, i) => (
                    <InputOTPSlot key={i} index={i} />
                  ))}
                </InputOTPGroup>
              </InputOTP>
              <FieldDescription>
                Did not get it?{" "}
                <a href="#" className="underline underline-offset-4">
                  Resend code
                </a>
              </FieldDescription>
            </Field>
            <Button type="submit">Verify</Button>
            <Button
              variant="ghost"
              type="button"
              onClick={() => setStep("email")}
            >
              <ArrowLeftIcon />
              Back
            </Button>
          </form>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        Protected by single sign-on, passkeys and audit logs.
      </p>
    </div>
  )
}
