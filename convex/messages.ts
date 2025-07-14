import { getAuthUserId } from "@convex-dev/auth/server"
import { ConvexError, v } from "convex/values"

import { mutation } from "./_generated/server"

export const createMessage = mutation({
  args: {
    text: v.optional(v.string()),
    files: v.optional(v.array(v.id("_storage"))),
    workspaceId: v.id("workspace"),
    channelId: v.optional(v.id("channel")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new ConvexError("Not authenticated")

    const member = await ctx.db
      .query("workspaceMember")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique()
    if (!member) throw new ConvexError("Unauthorized")

    const messageId = await ctx.db.insert("message", {
      text: args.text,
      files: args.files,
      channelId: args.channelId,
      workspaceId: args.workspaceId,
      memberId: member._id,
    })

    return messageId
  },
})
