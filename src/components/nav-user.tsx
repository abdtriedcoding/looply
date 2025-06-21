"use client"

import { useAuthActions } from "@convex-dev/auth/react"
import { convexQuery } from "@convex-dev/react-query"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

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

import { useEditWorkspaceModalStore } from "@/features/workspaces/store/useEditWorkspaceModal"

import { api } from "../../convex/_generated/api"
import { Doc } from "../../convex/_generated/dataModel"

export function NavUser({
  workspace,
  isWorkspaceLoading,
}: {
  workspace: Doc<"workspace"> | null
  isWorkspaceLoading: boolean
}) {
  const { data, isPending } = useQuery(convexQuery(api.currentuser.user, {}))
  const { signOut } = useAuthActions()
  const router = useRouter()
  const { setIsOpen, setData } = useEditWorkspaceModalStore()

  if (isWorkspaceLoading || isPending)
    return (
      <Button size="icon" variant="info">
        <Loader2 className="size-4 animate-spin" />
      </Button>
    )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="info">
          {data?.name
            ? data?.name?.charAt(0).toUpperCase()
            : data?.email?.charAt(0).toUpperCase()}
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
              <AvatarImage src={data?.image} alt={data?.email} />
              <AvatarFallback className="rounded-lg">
                {data?.name
                  ? data?.name?.charAt(0).toUpperCase()
                  : data?.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              {data?.name && (
                <span className="truncate font-medium">{data?.name}</span>
              )}
              {data?.email && <span className="truncate">{data?.email}</span>}
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Sparkles className="mr-2 h-4 w-4" />
            Invite to workspace
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => {
              setIsOpen(true)
              setData(workspace)
            }}
          >
            <BadgeCheck className="mr-2 h-4 w-4" />
            Edit Workspace
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Trash className="mr-2 h-4 w-4" />
            Delete Workspace
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            Account Settings
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
