import Image from "next/image"

import { Button } from "@/components/ui/button"

import { AuthProvider } from "@/features/auth/types"

export function AuthButtons({
  handleAuth,
  disabled,
}: {
  handleAuth: (provider: AuthProvider) => void
  disabled: boolean
}) {
  return (
    <div className="flex flex-col gap-3">
      <Button
        onClick={() => handleAuth("google")}
        disabled={disabled}
        type="button"
        variant="outline"
        className="w-full"
      >
        <Image src="/google.svg" alt="Google" width={16} height={16} />
        Continue with Google
      </Button>
      <Button
        onClick={() => handleAuth("github")}
        disabled={disabled}
        type="button"
        variant="outline"
        className="w-full"
      >
        <Image src="/github.svg" alt="Github" width={16} height={16} />
        Continue with Github
      </Button>
    </div>
  )
}
