import { authTables } from "@convex-dev/auth/server"
import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

const schema = defineSchema({
  ...authTables,
  workspace: defineTable({
    name: v.string(),
    imageUrl: v.optional(v.string()),
    joinCode: v.string(),
    userId: v.id("users"),
  }),
  workspaceMember: defineTable({
    workspaceId: v.id("workspace"),
    userId: v.id("users"),
    role: v.union(v.literal("admin"), v.literal("member")),
  })
    .index("by_user_id", ["userId"])
    .index("by_workspace_id", ["workspaceId"])
    .index("by_workspace_id_user_id", ["workspaceId", "userId"]),
  channel: defineTable({
    workspaceId: v.id("workspace"),
    name: v.string(),
    description: v.optional(v.string()),
  }).index("by_workspace_id", ["workspaceId"]),
  message: defineTable({
    text: v.optional(v.string()),
    files: v.optional(v.array(v.id("_storage"))),
    memberId: v.id("workspaceMember"),
    workspaceId: v.id("workspace"),
    channelId: v.optional(v.id("channel")),
    conversationId: v.optional(v.id("conversation")),
    updatedAt: v.optional(v.number()),
  })
    .index("by_channel_id", ["channelId"])
    .index("by_conversation_id", ["conversationId"])
    .index("by_member_id", ["memberId"])
    .index("by_channel_id_conversation_id", ["channelId", "conversationId"]),
  reaction: defineTable({
    emoji: v.string(),
    messageId: v.id("message"),
    memberId: v.id("workspaceMember"),
    workspaceId: v.id("workspace"),
  })
    .index("by_message_id", ["messageId"])
    .index("by_workspace_id", ["workspaceId"])
    .index("by_member_id", ["memberId"]),
  conversation: defineTable({
    workspaceId: v.id("workspace"),
    memberOneId: v.id("workspaceMember"),
    memberTwoId: v.id("workspaceMember"),
  }).index("by_workspace_id", ["workspaceId"]),
})

export default schema
