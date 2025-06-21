import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

/**
 * Tooltip hint wrapper for UI elements.
 * Shows a label on hover/focus.
 */
interface HintProps {
  children: React.ReactNode
  label: string
  side?: "top" | "right" | "bottom" | "left"
  align?: "start" | "center" | "end"
}

export function Hint({
  children,
  label,
  side = "top",
  align = "center",
}: HintProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side} align={align}>
        {label}
      </TooltipContent>
    </Tooltip>
  )
}
