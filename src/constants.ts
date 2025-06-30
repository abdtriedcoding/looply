import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"
import { Bookmark, HashIcon, Home, ListTodo } from "lucide-react"

export const MESSAGE_COMPACT_TIME_WINDOW_MINUTES = 5 as const

export const COPY_STATUS_TIMEOUT = 2000

export const JOIN_CODE_LENGTH = 6

export const LOAD_MORE_BATCH_SIZE = 20

export const COMPACT_TIME_FORMAT = "hh:mm"
export const FULL_TIME_FORMAT = "h:mm a"

export const INTERSECTION_THRESHOLD = 1.0

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

export const CHAT_SIDEBAR_ITEMS = [
  {
    id: "saved",
    label: "Saved",
    icon: Bookmark,
    href: "/chat/saved",
  },
  {
    id: "channels",
    label: "Channels",
    icon: HashIcon,
    href: "/chat/channels",
  },
]

export const STORAGE_KEYS = {
  CHANNELS_SECTION: "sidebar_channels_open",
  CONVERSATIONS_SECTION: "sidebar_conversations_open",
} as const
