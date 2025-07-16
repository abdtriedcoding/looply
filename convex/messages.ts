import { getAuthUserId } from "@convex-dev/auth/server"
import { ConvexError, v } from "convex/values"

import { Id } from "./_generated/dataModel"
import { mutation, query, QueryCtx } from "./_generated/server"

const getMember = (ctx: QueryCtx, memberId: Id<"workspaceMember">) => {
  return ctx.db.get(memberId)
}

const getUser = (ctx: QueryCtx, userId: Id<"users">) => {
  return ctx.db.get(userId)
}

const getFile = (ctx: QueryCtx, file: Id<"_storage">) => {
  return ctx.storage.getUrl(file)
}

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

export const getMessages = query({
  args: {
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

    const messages = await ctx.db
      .query("message")
      .withIndex("by_channel_id", (q) => q.eq("channelId", args.channelId))
      .order("desc")
      .collect()

    const messagesWithUsers = await Promise.all(
      messages.map(async (message) => {
        const member = await getMember(ctx, message.memberId)
        if (!member) return null
        const user = await getUser(ctx, member.userId)
        if (!user) return null
        const images = await Promise.all(
          message.files?.map((file) => getFile(ctx, file)) || []
        )
        return { ...message, member, user, images }
      })
    )

    return messagesWithUsers.filter((message) => message !== null)
  },
})
