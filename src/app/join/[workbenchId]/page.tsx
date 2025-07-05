"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

import { convexQuery, useConvexMutation } from "@convex-dev/react-query"
import { useMutation, useQuery } from "@tanstack/react-query"
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

import { useWorkspaceId } from "@/hooks/useWorkspaceId"

import { api } from "../../../../convex/_generated/api"

export default function JoinWorkspace() {
  const workspaceId = useWorkspaceId()

  const router = useRouter()

  const { data, isPending } = useQuery(
    convexQuery(api.workspaces.getWorkspaceById, { id: workspaceId })
  )

  const { mutateAsync, isPending: isJoining } = useMutation({
    mutationFn: useConvexMutation(api.workspaces.joinWorkspace),
  })

  if (isPending)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    )

  const handleComplete = async (code: string) => {
    if (code !== data?.joinCode) {
      toast.error("Invalid join code")
      return
    }

    try {
      const result = await mutateAsync({ id: workspaceId, joinCode: code })
      if (result && typeof result === "object" && "error" in result) {
        toast.error(result.error)
        return
      }
      toast.success(`Joined workspace ${data?.name}`)
      router.push(`/workbench/${workspaceId}`)
    } catch {
      toast.error("Failed to join workspace")
    }
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-y-8 rounded-lg p-8 shadow-sm">
      <div className="flex max-w-md flex-col items-center justify-center gap-y-4">
        <div className="flex flex-col items-center justify-center gap-y-2">
          <h1 className="text-2xl font-bold">
            Join workspace - <span className="text-primary">{data?.name}</span>
          </h1>
          <p className="text-md text-muted-foreground">
            Enter the workspace code to join
          </p>
        </div>
        <InputOTP
          maxLength={6}
          pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
          onComplete={handleComplete}
          disabled={isJoining}
        >
          <InputOTPGroup>
            {Array.from({ length: 6 }, (_, index) => (
              <InputOTPSlot key={index} index={index} />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </div>
      <Button size="lg" asChild variant="secondary" disabled={isJoining}>
        <Link href="/">Back to Home</Link>
      </Button>
    </div>
  )
}
