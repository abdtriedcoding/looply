"use client"

import { useAuthActions } from "@convex-dev/auth/react"
import Link from "next/link"
import { useTransition } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { AuthButtons } from "@/features/auth/components/auth-buttons"
import { AuthProvider } from "@/features/auth/types"

export function LoginForm() {
  const [isPending, startTransition] = useTransition()

  const { signIn } = useAuthActions()
  const handleAuth = (provider: AuthProvider) => {
    startTransition(async () => {
      await signIn(provider)
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Sign in to Looply</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="grid gap-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <Button asChild type="submit" className="w-full">
                  <Link href="/password">Continue</Link>
                </Button>
              </div>

              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Or continue with
                </span>
              </div>

              <AuthButtons handleAuth={handleAuth} disabled={isPending} />

              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/sign-up" className="underline underline-offset-4">
                  Sign up
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
