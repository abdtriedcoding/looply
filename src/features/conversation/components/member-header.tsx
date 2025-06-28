import { ChevronDown, Hash } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Doc } from "../../../../convex/_generated/dataModel"

export const MemberHeader = ({
  member,
}: {
  member: Doc<"workspaceMember"> & { user: Doc<"users"> }
}) => {
  return (
    <>
      <div className="flex h-[49px] items-center justify-between border-b px-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2">
              <Button variant="ghost">
                <Hash className="text-muted-foreground size-4" />
                {member?.user.name}
                <ChevronDown className="ml-auto h-4 w-4 shrink-0 opacity-70" />
              </Button>
              <p className="text-muted-foreground text-sm">
                {member?.user.email}
              </p>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="rounded-lg shadow-lg"
            side="bottom"
            align="start"
          >
            <>
              <DropdownMenuItem>Remove member</DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
            <DropdownMenuItem className="text-destructive focus:bg-destructive/10 cursor-pointer">
              Leave conversation
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  )
}
