import { getAuthUserId } from "@convex-dev/auth/server"
import { ConvexError, v } from "convex/values"

import { ROLE } from "@/constants"

import { mutation, query } from "./_generated/server"

export const currentMember = query({
  args: {
    workspaceId: v.id("workspace"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (userId === null) {
      return null
    }

    const member = await ctx.db
      .query("workspaceMember")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique()
    if (!member) {
      return null
    }

    return member
  },
})

export const getAllMembers = query({
  args: {
    workspaceId: v.id("workspace"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (userId === null) {
      return null
    }
    const workspace = await ctx.db.get(args.workspaceId)
    if (!workspace) {
      return null
    }
    const member = await ctx.db
      .query("workspaceMember")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique()
    if (!member) {
      return null
    }
    const members = await ctx.db
      .query("workspaceMember")
      .withIndex("by_workspace_id", (q) =>
        q.eq("workspaceId", args.workspaceId)
      )
      .collect()

    if (!members) {
      return []
    }

    const users = await Promise.all(
      members.map(async (member) => {
        const user = await ctx.db.get(member.userId)
        if (!user) return null
        return {
          ...member,
          user,
        }
      })
    )
    return users.filter((user) => user !== null)
  },
})

export const getMemberById = query({
  args: {
    workspaceId: v.id("workspace"),
    memberId: v.id("workspaceMember"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (userId === null) {
      return null
    }

    const currentMember = await ctx.db
      .query("workspaceMember")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique()

    if (!currentMember) return null

    const user = await ctx.db.get(currentMember.userId)
    if (!user) return null
    return {
      ...currentMember,
      user,
    }
  },
})

export const updateMemberRole = mutation({
  args: {
    memberId: v.id("workspaceMember"),
    role: v.union(v.literal("admin"), v.literal("member")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (userId === null) {
      throw new ConvexError("Not authenticated")
    }

    const member = await ctx.db.get(args.memberId)
    if (!member) {
      throw new ConvexError("Member not found")
    }

    const currentMember = await ctx.db
      .query("workspaceMember")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", member.workspaceId).eq("userId", userId)
      )
      .unique()

    if (!currentMember || currentMember.role !== ROLE.ADMIN) {
      throw new ConvexError("Unauthorized")
    }

    await ctx.db.patch(args.memberId, {
      ...member,
      role: args.role,
    })

    return args.memberId
  },
})

export const removeMember = mutation({
  args: {
    memberId: v.id("workspaceMember"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)

    if (userId === null) {
      throw new Error("Unauthorized")
    }

    const member = await ctx.db.get(args.memberId)

    if (!member) {
      throw new Error("Member not found")
    }

    const currentMember = await ctx.db
      .query("workspaceMember")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", member.workspaceId).eq("userId", userId)
      )
      .unique()

    if (!currentMember) {
      throw new Error("Unauthorized")
    }

    if (member.role === "admin") {
      throw new Error("Admin cannot be removed")
    }

    if (currentMember._id === args.memberId && currentMember.role === "admin") {
      throw new Error("Cannot remove yourself if you are an admin")
    }

    const [messages, reactions, conversations] = await Promise.all([
      ctx.db
        .query("message")
        .withIndex("by_member_id", (q) => q.eq("memberId", member._id))
        .collect(),
      ctx.db
        .query("reaction")
        .withIndex("by_member_id", (q) => q.eq("memberId", member._id))
        .collect(),
      ctx.db
        .query("conversation")
        .filter((q) =>
          q.or(
            q.eq(q.field("memberOneId"), member._id),
            q.eq(q.field("memberTwoId"), member._id)
          )
        )
        .collect(),
    ])
    for (const message of messages) {
      await ctx.db.delete(message._id)
    }
    for (const reaction of reactions) {
      await ctx.db.delete(reaction._id)
    }
    for (const conversation of conversations) {
      await ctx.db.delete(conversation._id)
    }

    await ctx.db.delete(args.memberId)

    return args.memberId
  },
})
