import { getAuthUserId } from "@convex-dev/auth/server"

import { v } from "convex/values"

import { createWorkspaceSchema } from "../src/features/workspaces/components/create-workspace-modal"
import { generateWorkspaceCode } from "../src/lib/generate-join-code"
import { mutation, query } from "./_generated/server"

export const getWorkspaces = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (userId === null) {
      return []
    }

    const workspaces = await ctx.db
      .query("workspace")
      .filter((q) => q.eq(q.field("userId"), userId))
      .order("desc")
      .collect()
    return workspaces
  },
})

export const createWorkspace = mutation({
  args: {
    name: v.string(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) return

    const result = createWorkspaceSchema.safeParse(args)

    if (!result.success) return

    const workspaceId = await ctx.db.insert("workspace", {
      name: args.name,
      imageUrl: args.imageUrl,
      userId,
      joinCode: generateWorkspaceCode(),
    })
    return workspaceId
  },
})

export const getWorkspaceById = query({
  args: {
    id: v.id("workspace"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (userId === null) {
      return null
    }

    const workspace = await ctx.db.get(args.id)
    return workspace
  },
})

export const updateWorkspace = mutation({
  args: {
    id: v.id("workspace"),
    name: v.string(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) return

    const result = createWorkspaceSchema.safeParse(args)

    if (!result.success) return

    const workspaceId = await ctx.db.patch(args.id, {
      name: args.name,
      imageUrl: args.imageUrl,
    })
    return workspaceId
  },
})

export const deleteWorkspace = mutation({
  args: {
    id: v.id("workspace"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) return

    const workspaceId = await ctx.db.delete(args.id)
    return workspaceId
  },
})
