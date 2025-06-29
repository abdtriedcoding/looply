"use client"

import { Modals } from "@/components/modals"
import { Sidebar } from "@/components/sidebar"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

import { ProfilePannel } from "@/features/members/components/profile-pannel"
import { usePannelStore } from "@/features/members/store/usePannel"
import { WorkspaceSidebar } from "@/features/workspaces/components/workspace-sidebar"

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { memberProfileId } = usePannelStore()
  return (
    <div className="flex h-screen">
      <Sidebar />
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={20} minSize={15} maxSize={25}>
          <WorkspaceSidebar />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={memberProfileId ? 55 : 80} minSize={40}>
          <Modals />
          {children}
        </ResizablePanel>
        {memberProfileId && (
          <>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={25} minSize={20} maxSize={30}>
              <ProfilePannel memberId={memberProfileId} />
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </div>
  )
}
