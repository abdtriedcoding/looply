"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { convexQuery, useConvexMutation } from "@convex-dev/react-query"
import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "sonner"

import { FallbackScreen } from "@/components/fallback-screen"
import { LoadingScreen } from "@/components/loading-screen"
import { Button } from "@/components/ui/button"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

import { useWorkspaceId } from "@/hooks/useWorkspaceId"

import { JOIN_CODE_LENGTH, JOIN_CODE_PATTERN } from "@/constants"
import { handleConvexMutationError } from "@/lib/convex-mutation-error"

import { api } from "../../../../convex/_generated/api"

export default function JoinWorkspacePage() {
  const router = useRouter()
  const currentWorkspaceId = useWorkspaceId()
  const [isRedirectingToWorkspace, setIsRedirectingToWorkspace] =
    useState(false)

  const {
    data: targetWorkspace,
    isPending: isWorkspaceLoading,
    error: workspaceLoadingError,
  } = useQuery(
    convexQuery(api.workspaces.getWorkspaceInfo, {
      workspaceId: currentWorkspaceId,
    })
  )

  const {
    data: currentWorkspaceMember,
    isPending: isMembershipLoading,
    error: membershipLoadingError,
  } = useQuery(
    convexQuery(api.members.currentMember, { workspaceId: currentWorkspaceId })
  )

  const { mutate: joinWorkspace, isPending: isJoining } = useMutation({
    mutationFn: useConvexMutation(api.workspaces.joinWorkspace),
    onError: (err: Error) => {
      toast.error(handleConvexMutationError(err, "Failed to join workspace"))
    },
    onSuccess: () => {
      toast.success(`Joined workspace ${targetWorkspace?.name}`)
      router.replace(`/workspace/${currentWorkspaceId}`)
    },
  })

  const isCurrentMemberOfWorkspace =
    currentWorkspaceMember?.workspaceId === currentWorkspaceId

  useEffect(() => {
    if (isMembershipLoading) return

    if (isCurrentMemberOfWorkspace) {
      setIsRedirectingToWorkspace(true)
      router.replace(`/workspace/${currentWorkspaceId}`)
    }
  }, [
    currentWorkspaceMember,
    currentWorkspaceId,
    router,
    isMembershipLoading,
    isCurrentMemberOfWorkspace,
  ])

  const isLoading =
    isWorkspaceLoading || isMembershipLoading || isRedirectingToWorkspace

  if (isLoading) return <LoadingScreen />

  if (workspaceLoadingError) {
    return (
      <FallbackScreen
        title="Unable to Load Workspace"
        description="Something went wrong while loading the workspace. Please try again later."
        buttonLabel="Return Home"
        buttonLink="/"
      />
    )
  }

  if (membershipLoadingError) {
    return (
      <FallbackScreen
        title="Unable to Load Member"
        description="Something went wrong while loading your member details. Please try again later."
        buttonLabel="Return Home"
        buttonLink="/"
      />
    )
  }

  if (!targetWorkspace) {
    return (
      <FallbackScreen
        title="Workspace Not Found"
        description="The workspace you're trying to access either doesn't exist or might have been archived."
        buttonLabel="Return Home"
        buttonLink="/"
      />
    )
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-y-8 p-8">
      <div className="flex max-w-md flex-col items-center gap-y-4">
        <div className="flex flex-col items-center gap-y-2">
          <h1 className="text-2xl font-bold">
            Join workspace -{" "}
            <span className="text-primary">{targetWorkspace.name}</span>
          </h1>
          <p className="text-md text-muted-foreground">
            Enter the workspace code to join
          </p>
        </div>
        <InputOTP
          maxLength={JOIN_CODE_LENGTH}
          pattern={JOIN_CODE_PATTERN}
          onComplete={(code: string) =>
            joinWorkspace({ workspaceId: currentWorkspaceId, joinCode: code })
          }
          disabled={isJoining}
        >
          <InputOTPGroup>
            {Array.from({ length: JOIN_CODE_LENGTH }, (_, index) => (
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
