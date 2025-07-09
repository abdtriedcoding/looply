"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

import { useAuthActions } from "@convex-dev/auth/react"
import { BadgeCheck, LogOut, Sparkles, Trash } from "lucide-react"

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

import { DeleteWorkspaceModal } from "@/features/workspaces/components/delete-workspace-modal"
import { EditWorkspaceModal } from "@/features/workspaces/components/edit-workspace-modal"
import { InviteWorkspaceModal } from "@/features/workspaces/components/invite-workspace-modal"

import { Doc } from "../../convex/_generated/dataModel"

interface NavUserMenuProps {
  workspace: Doc<"workspace">
  user: Doc<"users">
  isAdmin: boolean
}

export function NavUser({ workspace, user, isAdmin }: NavUserMenuProps) {
  const router = useRouter()
  const { signOut } = useAuthActions()

  const [isEditWorkspaceOpen, setEditWorkspaceOpen] = useState(false)
  const [isDeleteWorkspaceOpen, setDeleteWorkspaceOpen] = useState(false)
  const [isInviteWorkspaceOpen, setInviteWorkspaceOpen] = useState(false)

  function handleLogout() {
    signOut().then(() => router.push("/"))
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="info">
            {user.name
              ? user.name.charAt(0).toUpperCase()
              : user.email?.charAt(0).toUpperCase()}
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
                <AvatarImage
                  src={user.image}
                  alt={user.email || user.name || "User avatar"}
                />
                <AvatarFallback className="rounded-lg">
                  {user.name
                    ? user.name.charAt(0).toUpperCase()
                    : user.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                {user.name && (
                  <span className="truncate font-medium">{user.name}</span>
                )}
                {user.email && <span className="truncate">{user.email}</span>}
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setInviteWorkspaceOpen(true)}>
              <Sparkles className="mr-2 size-4" />
              Invite to workspace
            </DropdownMenuItem>
          </DropdownMenuGroup>
          {isAdmin && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setEditWorkspaceOpen(true)}>
                  <BadgeCheck className="mr-2 size-4" />
                  Edit Workspace
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDeleteWorkspaceOpen(true)}>
                  <Trash className="mr-2 size-4" />
                  Delete Workspace
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 size-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <EditWorkspaceModal
        open={isEditWorkspaceOpen}
        onOpenChange={setEditWorkspaceOpen}
        workspace={workspace}
      />
      <DeleteWorkspaceModal
        open={isDeleteWorkspaceOpen}
        onOpenChange={setDeleteWorkspaceOpen}
        workspace={workspace}
      />
      <InviteWorkspaceModal
        open={isInviteWorkspaceOpen}
        onOpenChange={setInviteWorkspaceOpen}
        workspace={workspace}
      />
    </>
  )
}
