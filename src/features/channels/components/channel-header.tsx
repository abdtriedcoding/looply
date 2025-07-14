import { useState } from "react"

import { ChevronDown, Hash } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { DeleteChannelModal } from "@/features/channels/components/delete-channel-modal"
import { EditChannelModal } from "@/features/channels/components/edit-channel-modal"

import { Doc } from "../../../../convex/_generated/dataModel"

export const ChannelHeader = ({ channel }: { channel: Doc<"channel"> }) => {
  const [isEditChannelOpen, setEditChannelOpen] = useState(false)
  const [isDeleteChannelOpen, setDeleteChannelOpen] = useState(false)

  return (
    <>
      <div className="flex h-[49px] items-center justify-between border-b px-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2">
              <Button variant="ghost">
                <Hash className="text-muted-foreground size-4" />
                {channel?.name}
                <ChevronDown className="ml-auto h-4 w-4 shrink-0 opacity-70" />
              </Button>
              <p className="text-muted-foreground text-sm">
                {channel?.description}
              </p>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="rounded-lg shadow-lg"
            side="bottom"
            align="start"
          >
            <>
              <DropdownMenuItem onClick={() => setEditChannelOpen(true)}>
                Edit channel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDeleteChannelOpen(true)}>
                Delete channel
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
            <DropdownMenuItem className="text-destructive focus:bg-destructive/10 cursor-pointer">
              Leave channel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <EditChannelModal
        open={isEditChannelOpen}
        onOpenChange={setEditChannelOpen}
        channel={channel}
      />
      <DeleteChannelModal
        open={isDeleteChannelOpen}
        onOpenChange={setDeleteChannelOpen}
        channel={channel}
      />
    </>
  )
}
