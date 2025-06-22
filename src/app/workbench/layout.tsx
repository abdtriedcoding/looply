import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

import { WorkspaceSidebar } from "@/features/workspaces/components/workspace-sidebar"

import { Modals } from "@/components/modals"
import { Sidebar } from "@/components/sidebar"

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={25} minSize={20} maxSize={30}>
          <WorkspaceSidebar />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={75}>
          <Modals />
          {children}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
