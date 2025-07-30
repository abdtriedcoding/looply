import { Loader2 } from "lucide-react"

export function LoadingScreen() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="size-5 animate-spin" />
    </div>
  )
}
