"use client"

import { useAuthActions } from "@convex-dev/auth/react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"

export default function Home() {
  const { signOut } = useAuthActions()
  const router = useRouter()

  return (
    <div className="flex h-screen items-center justify-center">
      <Button
        variant="default"
        size="lg"
        onClick={async () => {
          await signOut()
          router.push("/login")
        }}
      >
        Sign out
      </Button>
    </div>
  )
}
