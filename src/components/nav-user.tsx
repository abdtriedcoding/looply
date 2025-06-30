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
import { WorkspaceModalType } from "@/features/workspaces/types"

import { Doc } from "../../convex/_generated/dataModel"

interface NavUserMenuProps {
  workspace: Doc<"workspace">
  user: Doc<"users">
  isAdmin: boolean
}

export function NavUser({ workspace, user, isAdmin }: NavUserMenuProps) {
  const router = useRouter()
  const { signOut } = useAuthActions()
  const [activeModal, setActiveModal] = useState<WorkspaceModalType | null>(
    null
  )

  const handleLogout = async () => {
    try {
      await signOut()
      router.push("/")
    } catch (err) {
      console.error("Logout failed:", err)
    }
  }

  const userInitial = user.name?.[0] || user.email?.[0] || "U"

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="info">
            {userInitial}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="min-w-56 rounded-lg"
          align="end"
          side="right"
        >
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={user.image}
                  alt={user.name || user.email || "User"}
                />
                <AvatarFallback className="rounded-lg">
                  {userInitial}
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
            <DropdownMenuItem onClick={() => setActiveModal("inviteWorkspace")}>
              <Sparkles className="mr-2 size-4" />
              Invite to workspace
            </DropdownMenuItem>
          </DropdownMenuGroup>

          {isAdmin && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => setActiveModal("editWorkspace")}
                >
                  <BadgeCheck className="mr-2 size-4" />
                  Edit Workspace
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setActiveModal("deleteWorkspace")}
                >
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
        open={activeModal === "editWorkspace"}
        onOpenChange={(open) =>
          open ? setActiveModal("editWorkspace") : setActiveModal(null)
        }
        workspace={workspace}
      />
      <DeleteWorkspaceModal
        open={activeModal === "deleteWorkspace"}
        onOpenChange={(open) =>
          open ? setActiveModal("deleteWorkspace") : setActiveModal(null)
        }
        workspace={workspace}
      />
      <InviteWorkspaceModal
        open={activeModal === "inviteWorkspace"}
        onOpenChange={(open) =>
          open ? setActiveModal("inviteWorkspace") : setActiveModal(null)
        }
        workspace={workspace}
      />
    </>
  )
}
