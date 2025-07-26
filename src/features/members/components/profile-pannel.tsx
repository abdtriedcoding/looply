import Link from "next/link"

import { convexQuery, useConvexMutation } from "@convex-dev/react-query"
import { useMutation, useQuery } from "@tanstack/react-query"
import {
  ChevronDownIcon,
  Loader2,
  MailIcon,
  TriangleAlert,
  XIcon,
} from "lucide-react"
import { toast } from "sonner"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"

import { useWorkspaceId } from "@/hooks/useWorkspaceId"

import { ROLE } from "@/constants"
import { handleConvexMutationError } from "@/lib/convex-mutation-error"

import { api } from "../../../../convex/_generated/api"
import { Id } from "../../../../convex/_generated/dataModel"
import { useProfilePannelStore } from "../store/useProfilePannel"

export const ProfilePannel = ({
  memberId,
}: {
  memberId: Id<"workspaceMember">
}) => {
  const { closeProfile } = useProfilePannelStore()

  const workspaceId = useWorkspaceId()

  const { mutate: updateMemberRole, isPending: isUpdating } = useMutation({
    mutationFn: useConvexMutation(api.members.updateMemberRole),
    onError: (err: Error) => {
      toast.error(
        handleConvexMutationError(err, "Failed to update member role")
      )
    },
    onSuccess: () => {
      toast.success(`Member role updated`)
    },
  })

  const { mutate: removeMember, isPending: isRemoving } = useMutation({
    mutationFn: useConvexMutation(api.members.removeMember),
    onError: (err: Error) => {
      toast.error(handleConvexMutationError(err, "Failed to remove member"))
    },
    onSuccess: () => {
      toast.success(`Member removed`)
      closeProfile()
    },
  })

  const {
    data: member,
    error: memberError,
    isLoading: memberPending,
  } = useQuery(
    convexQuery(api.members.getMemberById, { workspaceId, memberId })
  )

  const { data: currentMember } = useQuery(
    convexQuery(api.members.currentMember, { workspaceId })
  )

  if (memberPending) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <Loader2 className="size-5 animate-spin" />
      </div>
    )
  }

  if (memberError || !member) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2">
        <Button size="icon" variant="destructive">
          <TriangleAlert className="size-5" />
        </Button>
        <span className="text-muted-foreground text-sm font-medium">
          Member not found
        </span>
      </div>
    )
  }

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex h-[49px] items-center justify-between border-b px-4">
        <p className="text-lg font-bold">Profile</p>
        <Button onClick={closeProfile} size="iconSmall" variant="secondary">
          <XIcon className="size-5" />
        </Button>
      </div>
      <div className="flex flex-col items-center justify-center p-4">
        <Avatar className="h-52 w-full rounded-lg">
          <AvatarImage src={member?.user.image} className="object-cover" />
          <AvatarFallback className="h-52 w-full rounded-lg text-6xl">
            {member?.user.name?.charAt(0).toUpperCase() ||
              member?.user.email?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="flex flex-col px-4">
        <p className="text-lg font-bold">{member?.user.name}</p>
        {currentMember?.role === "admin" && currentMember?._id !== memberId && (
          <div className="flex w-full flex-col items-center gap-2 pt-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="info"
                  className="w-full capitalize"
                  disabled={isUpdating}
                >
                  {member?.role} <ChevronDownIcon className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                <DropdownMenuRadioGroup
                  value={member?.role}
                  onValueChange={(role) =>
                    updateMemberRole({
                      memberId,
                      role: role as ROLE,
                    })
                  }
                >
                  <DropdownMenuRadioItem value={ROLE.ADMIN}>
                    Admin
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value={ROLE.MEMBER}>
                    Member
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              className="w-full"
              variant="destructive"
              disabled={isRemoving}
              onClick={() => removeMember({ memberId })}
            >
              Remove
            </Button>
          </div>
        )}
      </div>
      <Separator className="mt-4" />
      <div className="flex flex-col p-4">
        <p className="mb-4 text-base font-bold">Contact Information</p>
        <div className="flex items-center gap-2">
          <div className="bg-muted flex size-9 items-center justify-center rounded-md">
            <MailIcon className="size-4" />
          </div>
          <div className="flex flex-col">
            <p className="text-muted-foreground text-[13px] font-semibold">
              Email Address
            </p>
            <Link
              href={`mailto:${member.user.email}`}
              className="text-sm text-[#1264a3] hover:underline"
            >
              {member.user.email}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
