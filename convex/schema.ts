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
})

export default schema
