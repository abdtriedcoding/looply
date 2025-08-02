import { Doc } from "../../../convex/_generated/dataModel"

export interface ChannelHeaderProps {
  channel: Doc<"channel">
}

export type ChannelModalType = "createChannel" | "editChannel" | "deleteChannel"
