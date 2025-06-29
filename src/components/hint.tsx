import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function Hint({
  children,
  label,
  side,
  align,
}: {
  children: React.ReactNode
  label: string
  side?: "top" | "right" | "bottom" | "left"
  align?: "start" | "center" | "end"
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side} align={align}>
        {label}
      </TooltipContent>
    </Tooltip>
  )
}
