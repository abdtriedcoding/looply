import Link from "next/link"

import { TriangleAlert } from "lucide-react"

import { Button } from "@/components/ui/button"

export function FallbackScreen({
  title,
  description,
  buttonLabel,
  buttonLink,
}: {
  title: string
  description: string
  buttonLabel: string
  buttonLink: string
}) {
  return (
    <div className="bg-background flex h-screen items-center justify-center">
      <div className="mx-auto flex max-w-lg flex-col items-center gap-6 p-4">
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <TriangleAlert className="h-8 w-8 text-rose-500" />
            <h1 className="text-2xl font-bold">{title}</h1>
          </div>
          <p className="text-md text-muted-foreground text-center leading-relaxed">
            {description}
          </p>
        </div>
        <Button asChild variant="secondary" size="lg">
          <Link href={buttonLink}>{buttonLabel}</Link>
        </Button>
      </div>
    </div>
  )
}
