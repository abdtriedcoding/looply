import { z } from "zod"

import { Id } from "../../../../convex/_generated/dataModel"

const nameSchema = z.string().min(2).max(50)
const descriptionSchema = z.string().optional()

// --- Frontend form schemas ---
export const createChannelFormSchema = z.object({
  name: nameSchema,
  description: descriptionSchema,
})

export const editChannelFormSchema = z.object({
  name: nameSchema,
  description: descriptionSchema,
})

// --- Backend args schemas ---
export const createChannelArgsSchema = createChannelFormSchema

export const updateChannelArgsSchema = z.object({
  id: z.custom<Id<"channel">>(),
  name: nameSchema,
  description: descriptionSchema,
})

export const deleteChannelArgsSchema = z.object({
  id: z.custom<Id<"channel">>(),
})
