import { getAuthUserId } from "@convex-dev/auth/server"
import { ConvexError, v } from "convex/values"

import { mutation, query } from "./_generated/server"

export const createConversation = mutation({
  args: {
    workspaceId: v.id("workspace"),
    memberId: v.id("workspaceMember"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new ConvexError("Not authenticated")

    const currentMember = await ctx.db
      .query("workspaceMember")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique()

    const otherMember = await ctx.db.get(args.memberId)

    if (!currentMember || !otherMember) {
      throw new Error("Member not found")
    }

    const existingConversation = await ctx.db
      .query("conversation")
      .filter((q) => q.eq(q.field("workspaceId"), args.workspaceId))
      .filter((q) =>
        q.or(
          q.and(
            q.eq(q.field("memberOneId"), currentMember._id),
            q.eq(q.field("memberTwoId"), otherMember._id)
          ),
          q.and(
            q.eq(q.field("memberOneId"), otherMember._id),
            q.eq(q.field("memberTwoId"), currentMember._id)
          )
        )
      )
      .unique()

    if (existingConversation) {
      return existingConversation._id
    }

    const conversationId = await ctx.db.insert("conversation", {
      workspaceId: args.workspaceId,
      memberOneId: currentMember._id,
      memberTwoId: otherMember._id,
    })

    return conversationId
  },
})

export const getAllConversations = query({
  args: {
    workspaceId: v.id("workspace"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (userId === null) {
      return []
    }

    const currentMember = await ctx.db
      .query("workspaceMember")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique()
    if (!currentMember) {
      return []
    }

    const conversations = await ctx.db
      .query("conversation")
      .withIndex("by_workspace_id", (q) =>
        q.eq("workspaceId", args.workspaceId)
      )
      .filter((q) =>
        q.or(
          q.eq(q.field("memberOneId"), currentMember._id),
          q.eq(q.field("memberTwoId"), currentMember._id)
        )
      )
      .order("desc")
      .collect()

    if (!conversations) {
      return []
    }

    const conversationsWithUser = await Promise.all(
      conversations.map(async (conversation) => {
        const otherMemberId =
          conversation.memberOneId === currentMember._id
            ? conversation.memberTwoId
            : conversation.memberOneId

        const otherMember = await ctx.db.get(otherMemberId)
        if (!otherMember) return null

        const otherMemberUser = await ctx.db.get(otherMember.userId)
        if (!otherMemberUser) return null

        return {
          ...conversation,
          otherMemberUser,
        }
      })
    )

    return conversationsWithUser.filter((c) => c !== null)
  },
})
