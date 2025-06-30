"use client"

import { Plus } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { useCreateWorkspaceModal } from "@/features/workspaces/store/use-createworkspace-modal"

import { Doc } from "../../../../convex/_generated/dataModel"

interface WorkspaceSwitcherProps {
  workspace: Doc<"workspace">
  isAdmin: boolean
}

export function WorkspaceSwitcher({
  workspace,
  isAdmin,
}: WorkspaceSwitcherProps) {
  const { openWorkspaceModal } = useCreateWorkspaceModal()

  const workspaceName = workspace.name
  const workspaceImageUrl = workspace?.imageUrl
  const workspaceAvatarFallback = workspaceName.charAt(0).toUpperCase() || "W"

  const handleCreateWorkspace = () => {
    openWorkspaceModal()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="destructive">
          {workspaceAvatarFallback}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="min-w-56 rounded-lg"
        align="start"
        side="right"
        sideOffset={4}
      >
        <DropdownMenuLabel className="text-muted-foreground text-xs">
          Active Workspace
        </DropdownMenuLabel>
        <DropdownMenuLabel>
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 rounded-md">
              <AvatarImage
                src={workspaceImageUrl}
                alt={workspaceName || "Workspace avatar"}
              />
              <AvatarFallback className="bg-destructive dark:bg-destructive/60 size-7 rounded-md text-white">
                {workspaceAvatarFallback}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{workspaceName}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        {isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleCreateWorkspace}>
              <div className="flex items-center gap-2">
                <Button variant="secondary" size="iconSmall">
                  <Plus className="text-muted-foreground size-4" />
                </Button>
                Add workspace
              </div>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
