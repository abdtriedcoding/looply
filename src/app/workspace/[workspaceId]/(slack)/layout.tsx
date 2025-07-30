"use client"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

import { ProfilePannel } from "@/features/members/components/profile-pannel"
import { useProfilePannelStore } from "@/features/members/store/useProfilePannel"
import { ThreadPannel } from "@/features/messages/components/thread-panel"
import { useThreadStore } from "@/features/messages/store/useThread"
import { WorkspaceSidebar } from "@/features/workspaces/components/workspace-sidebar"

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { memberProfileId } = useProfilePannelStore()
  const { messageId } = useThreadStore()
  const showPanel = memberProfileId || messageId

  return (
    <div className="flex h-screen flex-1">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={20} minSize={15} maxSize={25}>
          <WorkspaceSidebar />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={showPanel ? 55 : 80} minSize={40}>
          {children}
        </ResizablePanel>
        {showPanel && (
          <>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={25} minSize={20} maxSize={30}>
              {memberProfileId && <ProfilePannel memberId={memberProfileId} />}
              {messageId && <ThreadPannel messageId={messageId} />}
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </div>
  )
}
