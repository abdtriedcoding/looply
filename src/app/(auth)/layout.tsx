import { AuthHeader } from "@/features/auth/components/auth-header"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-md flex-col gap-6">
        <AuthHeader />
        {children}
      </div>
    </section>
  )
}
