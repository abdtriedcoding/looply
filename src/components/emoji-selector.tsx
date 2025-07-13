import { useTheme } from "next-themes"
import { ReactNode, useState } from "react"

import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface EmojiSelectorProps {
  children: ReactNode
  hint?: string
  onEmojiSelect: (emojiValue: string) => void
}

export function EmojiSelector({
  children,
  hint,
  onEmojiSelect,
}: EmojiSelectorProps) {
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [tooltipOpen, setTooltipOpen] = useState(false)

  const { resolvedTheme } = useTheme()
  const currentTheme = (resolvedTheme ?? "light") as keyof typeof themeMap

  const themeMap = {
    dark: Theme.DARK,
    light: Theme.LIGHT,
  }

  const theme = themeMap[currentTheme]

  const handleSelect = (emoji: EmojiClickData) => {
    onEmojiSelect(emoji.emoji)
    setPopoverOpen(false)
    setTimeout(() => {
      setTooltipOpen(false)
    }, 500)
  }

  return (
    <TooltipProvider>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <Tooltip
          open={tooltipOpen}
          onOpenChange={setTooltipOpen}
          delayDuration={50}
        >
          <PopoverTrigger asChild>
            <TooltipTrigger asChild>{children}</TooltipTrigger>
          </PopoverTrigger>
          <TooltipContent>{hint}</TooltipContent>
        </Tooltip>
        <PopoverContent
          className="w-full border-none p-0 shadow-none"
          align="start"
          side="bottom"
          sideOffset={-50}
        >
          <EmojiPicker onEmojiClick={handleSelect} height={350} theme={theme} />
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  )
}
