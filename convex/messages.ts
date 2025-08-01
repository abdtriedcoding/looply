import { getAuthUserId } from "@convex-dev/auth/server"
import { paginationOptsValidator } from "convex/server"
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
    conversationId: v.optional(v.id("conversation")),
    parentMessageId: v.optional(v.id("message")),
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
      conversationId: args.conversationId,
      parentMessageId: args.parentMessageId,
      memberId: member._id,
    })

    return messageId
  },
})

export const getMessages = query({
  args: {
    workspaceId: v.id("workspace"),
    channelId: v.optional(v.id("channel")),
    conversationId: v.optional(v.id("conversation")),
    parentMessageId: v.optional(v.id("message")),
    paginationOpts: paginationOptsValidator,
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
      .withIndex("by_channel_id_conversation_id_parent_message_id", (q) =>
        q
          .eq("channelId", args.channelId)
          .eq("conversationId", args.conversationId)
          .eq("parentMessageId", args.parentMessageId)
      )
      .order("desc")
      .paginate(args.paginationOpts)

    const page = await Promise.all(
      messages.page.map(async (message) => {
        const member = await getMember(ctx, message.memberId)
        if (!member) return null

        const user = await getUser(ctx, member.userId)
        if (!user) return null

        let images: string[] = []
        if (message.files) {
          images = (
            await Promise.all(message.files?.map((file) => getFile(ctx, file)))
          ).filter((url): url is string => url !== null)
        }

        const reactions = await ctx.db
          .query("reaction")
          .withIndex("by_message_id", (q) => q.eq("messageId", message._id))
          .collect()

        const dedupedReactions = reactions.reduce(
          (acc, reaction) => {
            const existing = acc.find((r) => r.emoji === reaction.emoji)
            if (existing) {
              existing.memberIds = Array.from(
                new Set([...existing.memberIds, reaction.memberId])
              )
              existing.count++
            } else {
              acc.push({
                ...reaction,
                count: 1,
                memberIds: [reaction.memberId],
              })
            }
            return acc
          },
          [] as (Doc<"reaction"> & {
            count: number
            memberIds: Id<"workspaceMember">[]
          })[]
        )

        const reactionsWithoutMemberId = dedupedReactions.map(
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

    return {
      ...messages,
      page: page.filter((msg) => msg !== null),
    }
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

export const getMessageById = query({
  args: {
    messageId: v.id("message"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) return null

    const message = await ctx.db.get(args.messageId)
    if (!message) return null

    const currentMember = await ctx.db
      .query("workspaceMember")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", message.workspaceId).eq("userId", userId)
      )
      .unique()
    if (!currentMember) return null

    const member = await ctx.db.get(message.memberId)
    if (!member) return null

    const user = await ctx.db.get(member.userId)
    if (!user) return null

    const images = (
      await Promise.all(
        message.files?.map((file) => ctx.storage.getUrl(file)) ?? []
      )
    ).filter((url): url is string => url !== null)

    const reactions = await ctx.db
      .query("reaction")
      .withIndex("by_message_id", (q) => q.eq("messageId", message._id))
      .collect()

    const dedupedReactions = reactions.reduce(
      (acc, reaction) => {
        const existing = acc.find((r) => r.emoji === reaction.emoji)
        if (existing) {
          existing.memberIds = Array.from(
            new Set([...existing.memberIds, reaction.memberId])
          )
          existing.count++
        } else {
          acc.push({
            ...reaction,
            count: 1,
            memberIds: [reaction.memberId],
          })
        }
        return acc
      },
      [] as (Doc<"reaction"> & {
        count: number
        memberIds: Id<"workspaceMember">[]
      })[]
    )

    const reactionsWithoutMemberId = dedupedReactions.map(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ({ memberId, ...rest }) => rest
    )

    return {
      ...message,
      member,
      user,
      images,
      reactions: reactionsWithoutMemberId,
    }
  },
})
