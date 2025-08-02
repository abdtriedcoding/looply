import { getAuthUserId } from "@convex-dev/auth/server"
import { getAllOrThrow } from "convex-helpers/server/relationships"
import { ConvexError, v } from "convex/values"

import {
  createWorkspaceArgsSchema,
  deleteWorkspaceArgsSchema,
  updateWorkspaceArgsSchema,
} from "@/features/workspaces/validation/workspace-schemas"

import { generateWorkspaceCode } from "@/lib/generate-join-code"

import { mutation, query } from "./_generated/server"

export const getWorkspaces = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (userId === null) {
      return []
    }

    const members = await ctx.db
      .query("workspaceMember")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .collect()
    if (!members) {
      return []
    }

    const workspaceIds = members.map((member) => member.workspaceId)

    const workspaces = await getAllOrThrow(ctx.db, workspaceIds)
    return workspaces
  },
})

export const createWorkspace = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const result = createWorkspaceArgsSchema.safeParse(args)
    if (!result.success) throw new ConvexError("Invalid arguments")

    const userId = await getAuthUserId(ctx)
    if (!userId) throw new ConvexError("Not authenticated")

    const workspaceId = await ctx.db.insert("workspace", {
      name: args.name,
      userId,
      joinCode: generateWorkspaceCode(),
    })

    const workspaceMemberId = await ctx.db.insert("workspaceMember", {
      workspaceId,
      userId,
      role: "admin",
    })

    await ctx.db.insert("channel", {
      name: "general",
      workspaceId,
    })

    await ctx.db.insert("conversation", {
      workspaceId,
      memberOneId: workspaceMemberId,
      memberTwoId: workspaceMemberId,
    })

    return workspaceId
  },
})

export const getWorkspaceById = query({
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

    const workspace = await ctx.db.get(args.workspaceId)

    if (!workspace) {
      return null
    }

    return {
      ...workspace,
      // If the message is an "image" its `body` is an `Id<"_storage">`
      ...(workspace.imageUrl
        ? { url: await ctx.storage.getUrl(workspace.imageUrl) }
        : {}),
    }
  },
})

export const getWorkspaceInfo = query({
  args: {
    workspaceId: v.id("workspace"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (userId === null) {
      return null
    }

    const workspace = await ctx.db.get(args.workspaceId)
    return workspace
  },
})

export const updateWorkspace = mutation({
  args: {
    workspaceId: v.id("workspace"),
    name: v.string(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const result = updateWorkspaceArgsSchema.safeParse(args)
    if (!result.success) throw new ConvexError("Invalid arguments")

    const userId = await getAuthUserId(ctx)
    if (!userId) throw new ConvexError("Not authenticated")

    const member = await ctx.db
      .query("workspaceMember")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique()
    if (!member || member.role !== "admin")
      throw new ConvexError("Unauthorized")

    const workspace = await ctx.db.get(args.workspaceId)
    if (!workspace) throw new ConvexError("Workspace not found")

    await ctx.db.patch(args.workspaceId, {
      name: args.name,
      imageUrl: args.imageUrl,
    })
    return args.workspaceId
  },
})

export const deleteWorkspace = mutation({
  args: {
    workspaceId: v.id("workspace"),
  },
  handler: async (ctx, args) => {
    const result = deleteWorkspaceArgsSchema.safeParse(args)
    if (!result.success) throw new ConvexError("Invalid arguments")

    const userId = await getAuthUserId(ctx)
    if (!userId) throw new ConvexError("Not authenticated")

    const member = await ctx.db
      .query("workspaceMember")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique()
    if (!member || member.role !== "admin")
      throw new ConvexError("Unauthorized")

    const workspace = await ctx.db.get(args.workspaceId)
    if (!workspace) throw new ConvexError("Workspace not found")

    await ctx.db.delete(args.workspaceId)
    return args.workspaceId
  },
})

export const updateWorkspaceJoinCode = mutation({
  args: {
    workspaceId: v.id("workspace"),
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
    if (!member || member.role !== "admin")
      throw new ConvexError("Unauthorized")

    const workspace = await ctx.db.get(args.workspaceId)
    if (!workspace) throw new ConvexError("Workspace not found")

    await ctx.db.patch(args.workspaceId, {
      joinCode: generateWorkspaceCode(),
    })
    return args.workspaceId
  },
})

export const joinWorkspace = mutation({
  args: {
    workspaceId: v.id("workspace"),
    joinCode: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new ConvexError("Not authenticated")

    const workspace = await ctx.db.get(args.workspaceId)
    if (!workspace) throw new ConvexError("Workspace not found")

    if (workspace.joinCode !== args.joinCode)
      throw new ConvexError("Invalid join code")

    const isAlreadyMember = await ctx.db
      .query("workspaceMember")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique()

    if (isAlreadyMember) throw new ConvexError("Already a member")

    const workspaceId = await ctx.db.insert("workspaceMember", {
      workspaceId: args.workspaceId,
      userId,
      role: "member",
    })
    return workspaceId
  },
})
