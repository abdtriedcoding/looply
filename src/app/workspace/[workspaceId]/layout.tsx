import { Sidebar } from "@/components/sidebar"

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen w-full">
      <Sidebar />
      {children}
    </div>
  )
}
