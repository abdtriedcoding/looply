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
import { ChannelHeaderProps, ChannelModalType } from "@/features/channels/types"

export const ChannelHeader = ({ channel }: ChannelHeaderProps) => {
  const [activeModal, setActiveModal] = useState<ChannelModalType | null>(null)

  return (
    <>
      <div className="flex h-[49px] items-center gap-4 border-b px-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Hash className="text-muted-foreground size-4" />
              {channel.name}
              <ChevronDown className="ml-auto h-4 w-4 shrink-0 opacity-70" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="rounded-lg shadow-lg"
            side="bottom"
            align="start"
          >
            <>
              <DropdownMenuItem onClick={() => setActiveModal("editChannel")}>
                Edit channel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveModal("deleteChannel")}>
                Delete channel
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
            <DropdownMenuItem className="text-destructive focus:bg-destructive/10 cursor-pointer">
              Leave channel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {channel.description && (
          <p className="text-muted-foreground text-sm">{channel.description}</p>
        )}
      </div>
      <EditChannelModal
        open={activeModal === "editChannel"}
        onOpenChange={(open) =>
          open ? setActiveModal("editChannel") : setActiveModal(null)
        }
        channel={channel}
      />
      <DeleteChannelModal
        open={activeModal === "deleteChannel"}
        onOpenChange={(open) =>
          open ? setActiveModal("deleteChannel") : setActiveModal(null)
        }
        channel={channel}
      />
    </>
  )
}
