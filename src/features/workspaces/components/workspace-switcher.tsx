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

import { useWorkspaceModalStore } from "@/features/workspaces/store/useWorkspaceModalStore"

import { Doc } from "../../../../convex/_generated/dataModel"

interface WorkspaceSwitcherProps {
  workspace: Doc<"workspace">
  isAdmin: boolean
}

export function WorkspaceSwitcher({
  workspace,
  isAdmin,
}: WorkspaceSwitcherProps) {
  const { setIsOpen } = useWorkspaceModalStore()
  const fallbackName = workspace.name.charAt(0).toUpperCase()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="secondary">
          {fallbackName}
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
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage
                src={workspace.imageUrl}
                alt={workspace.name || "Workspace avatar"}
              />
              <AvatarFallback className="rounded-lg">
                {fallbackName}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{workspace.name}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        {isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setIsOpen(true)}>
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
