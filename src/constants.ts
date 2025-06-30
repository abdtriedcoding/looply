import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"
import { Home, ListTodo } from "lucide-react"

export const MESSAGE_COMPACT_TIME_WINDOW_MINUTES = 5 as const

export const COPY_STATUS_TIMEOUT = 2000

export const JOIN_CODE_LENGTH = 6

export const JOIN_CODE_PATTERN = REGEXP_ONLY_DIGITS_AND_CHARS

export const ROLE = {
  ADMIN: "admin",
  MEMBER: "member",
} as const

export type ROLE = (typeof ROLE)[keyof typeof ROLE]

export const SIDEBAR_ITEMS = [
  { icon: Home, label: "Home", href: "/" },
  { icon: ListTodo, label: "Board", href: "/board" },
]
