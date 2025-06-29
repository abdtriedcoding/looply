export const ADMIN = "admin"

export const MESSAGE_COMPACT_TIME_WINDOW_MINUTES = 5

export const ROLE = {
  ADMIN: "admin",
  MEMBER: "member",
} as const

export type ROLE = (typeof ROLE)[keyof typeof ROLE]
