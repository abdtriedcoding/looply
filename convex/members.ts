import { getAuthUserId } from "@convex-dev/auth/server"
import { v } from "convex/values"

import { query } from "./_generated/server"

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
