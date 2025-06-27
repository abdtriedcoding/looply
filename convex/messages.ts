import { getAuthUserId } from "@convex-dev/auth/server"
import { ConvexError, v } from "convex/values"

import { Doc, Id } from "./_generated/dataModel"
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

        const reactions = await ctx.db
          .query("reaction")
          .withIndex("by_message_id", (q) => q.eq("messageId", message._id))
          .collect()

        const reactionsWithCounts = reactions.map((reaction) => ({
          ...reaction,
          count: reactions.filter((r) => r.emoji === reaction.emoji).length,
        }))

        const dedupedReactions = reactionsWithCounts.reduce(
          (acc, reaction) => {
            const existingReaction = acc.find((r) => r.emoji === reaction.emoji)

            if (existingReaction) {
              existingReaction.memberIds = Array.from(
                new Set([...existingReaction.memberIds, reaction.memberId])
              )
            } else {
              acc.push({ ...reaction, memberIds: [reaction.memberId] })
            }
            return acc
          },
          [] as (Doc<"reaction"> & {
            count: number
            memberIds: Id<"workspaceMember">[]
          })[]
        )

        const reactionsWithoutMemberId = dedupedReactions.map(
          ({ memberId, ...rest }) => rest
        )

        return {
          ...message,
          member,
          user,
          images,
          reactions: reactionsWithoutMemberId,
        }
      })
    )

    return messagesWithUsers.filter((message) => message !== null)
  },
})

export const toogleReaction = mutation({
  args: {
    emoji: v.string(),
    messageId: v.id("message"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new ConvexError("Not authenticated")

    const message = await ctx.db.get(args.messageId)
    if (!message) throw new ConvexError("Message not found")

    const member = await ctx.db
      .query("workspaceMember")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", message.workspaceId).eq("userId", userId)
      )
      .unique()
    if (!member) throw new ConvexError("Unauthorized")

    const existingMessageReactionFromUser = await ctx.db
      .query("reaction")
      .filter((q) =>
        q.and(
          q.eq(q.field("messageId"), args.messageId),
          q.eq(q.field("memberId"), member._id),
          q.eq(q.field("emoji"), args.emoji)
        )
      )
      .first()
    if (!existingMessageReactionFromUser) {
      await ctx.db.insert("reaction", {
        emoji: args.emoji,
        memberId: member._id,
        messageId: args.messageId,
        workspaceId: message.workspaceId,
      })
    } else {
      await ctx.db.delete(existingMessageReactionFromUser._id)
    }

    return existingMessageReactionFromUser
  },
})

export const deleteMessage = mutation({
  args: {
    messageId: v.id("message"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new ConvexError("Not authenticated")

    const message = await ctx.db.get(args.messageId)
    if (!message) throw new ConvexError("Message not found")

    const member = await ctx.db
      .query("workspaceMember")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", message.workspaceId).eq("userId", userId)
      )
      .unique()
    if (!member || member._id !== message.memberId)
      throw new ConvexError("Unauthorized")

    await ctx.db.delete(args.messageId)
    return args.messageId
  },
})

export const updateMessage = mutation({
  args: {
    messageId: v.id("message"),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new ConvexError("Not authenticated")

    const message = await ctx.db.get(args.messageId)
    if (!message) throw new ConvexError("Message not found")

    const member = await ctx.db
      .query("workspaceMember")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", message.workspaceId).eq("userId", userId)
      )
      .unique()
    if (!member || member._id !== message.memberId)
      throw new ConvexError("Unauthorized")

    await ctx.db.patch(args.messageId, {
      text: args.text,
      updatedAt: Date.now(),
    })
    return args.messageId
  },
})
