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

import { handleConvexMutationError } from "@/lib/convex-mutation-error"

import { api } from "../../../../convex/_generated/api"

export default function JoinWorkspacePage() {
  const router = useRouter()
  const workspaceId = useWorkspaceId()

  const { data: workspace, isPending: isWorkspaceLoading } = useQuery(
    convexQuery(api.workspaces.getWorkspaceInfo, { workspaceId })
  )

  const { mutateAsync: joinWorkspace, isPending: isJoining } = useMutation({
    mutationFn: useConvexMutation(api.workspaces.joinWorkspace),
    onError: (err: Error) => {
      toast.error(handleConvexMutationError(err, "Failed to join workspace"))
    },
    onSuccess: () => {
      toast.success(`Joined workspace ${workspace?.name}`)
      router.replace(`/workbench/${workspaceId}`)
    },
  })

  if (isWorkspaceLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2
          className="size-6 animate-spin"
          aria-label="Loading workspace"
        />
      </div>
    )
  }

  if (!workspace) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-y-4">
          <h1 className="text-destructive text-xl font-bold">
            Workspace Not Found
          </h1>
          <p className="text-md text-muted-foreground">
            The workspace you are trying to join does not exist or you are not
            authenticated.
          </p>
          <Button asChild variant="secondary" aria-label="Back to Home">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-y-8 rounded-lg p-8 shadow-sm">
      <div className="flex max-w-md flex-col items-center justify-center gap-y-4">
        <div className="flex flex-col items-center justify-center gap-y-2">
          <h1 className="text-2xl font-bold">
            Join workspace -{" "}
            <span className="text-primary">{workspace.name}</span>
          </h1>
          <p className="text-md text-muted-foreground">
            Enter the workspace code to join
          </p>
        </div>
        <InputOTP
          maxLength={6}
          pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
          onComplete={(code: string) =>
            joinWorkspace({ workspaceId, joinCode: code })
          }
          disabled={isJoining}
          aria-label="Workspace join code"
        >
          <InputOTPGroup>
            {Array.from({ length: 6 }, (_, index) => (
              <InputOTPSlot key={index} index={index} />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </div>
      <Button
        size="lg"
        asChild
        variant="secondary"
        disabled={isJoining}
        aria-label="Back to Home"
      >
        <Link href="/">Back to Home</Link>
      </Button>
    </div>
  )
}
