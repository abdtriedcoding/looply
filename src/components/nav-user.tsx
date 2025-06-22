"use client"

import { useRouter } from "next/navigation"

import { useAuthActions } from "@convex-dev/auth/react"
import { convexQuery } from "@convex-dev/react-query"
import { useQuery } from "@tanstack/react-query"
import {
  BadgeCheck,
  Loader2,
  LogOut,
  Settings,
  Sparkles,
  Trash,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { useDeleteWorkspaceModalStore } from "@/features/workspaces/store/useDeleteWorkspaceModal"
import { useEditWorkspaceModalStore } from "@/features/workspaces/store/useEditWorkspaceModal"
import { useInviteWorkspaceModalStore } from "@/features/workspaces/store/useInviteWorkspaceModal"

import { api } from "../../convex/_generated/api"
import { Doc } from "../../convex/_generated/dataModel"

interface NavUserMenuProps {
  workspace: Doc<"workspace"> | null
  isWorkspaceLoading: boolean
}

export function NavUser({ workspace, isWorkspaceLoading }: NavUserMenuProps) {
  const { data: user, isPending } = useQuery(
    convexQuery(api.currentuser.user, {})
  )
  const { signOut } = useAuthActions()
  const router = useRouter()
  const { setEditWorkspaceIsOpen, setEditWorkspaceData } =
    useEditWorkspaceModalStore()
  const { setDeleteWorkspaceIsOpen, setDeleteWorkspaceData } =
    useDeleteWorkspaceModalStore()
  const { setInviteWorkspaceIsOpen } = useInviteWorkspaceModalStore()

  if (isWorkspaceLoading || isPending)
    return (
      <Button size="icon" variant="info" aria-label="Loading user menu">
        <Loader2 className="size-4 animate-spin" />
      </Button>
    )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="info">
          {user?.name
            ? user.name.charAt(0).toUpperCase()
            : user?.email?.charAt(0).toUpperCase()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        side="right"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={user?.image} alt={user?.email} />
              <AvatarFallback className="rounded-lg">
                {user?.name
                  ? user.name.charAt(0).toUpperCase()
                  : user?.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              {user?.name && (
                <span className="truncate font-medium">{user.name}</span>
              )}
              {user?.email && <span className="truncate">{user.email}</span>}
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => setInviteWorkspaceIsOpen(true)}>
            <Sparkles className="mr-2 h-4 w-4" />
            Invite to workspace
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => {
              setEditWorkspaceIsOpen(true)
              setEditWorkspaceData(workspace)
            }}
          >
            <BadgeCheck className="mr-2 h-4 w-4" />
            Edit Workspace
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              if (!workspace) return
              setDeleteWorkspaceIsOpen(true)
              setDeleteWorkspaceData(workspace._id)
            }}
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete Workspace
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            Account Settings {/* TODO: Implement account settings */}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => signOut().then(() => router.push("/"))}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
