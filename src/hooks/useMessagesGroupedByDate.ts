import { useMemo } from "react"

import dayjs from "dayjs"

import { MessageListProps } from "@/features/messages/types"

export const useMessagesGroupedByDate = (
  allMessages: MessageListProps["messages"]
) => {
  return useMemo(() => {
    const messagesByDate = allMessages.reduce(
      (groups, message) => {
        const dateKey = dayjs(message._creationTime).format("YYYY-MM-DD")
        if (!groups[dateKey]) groups[dateKey] = []
        groups[dateKey].push(message)
        return groups
      },
      {} as Record<string, typeof allMessages>
    )

    return Object.entries(messagesByDate).map(([date, messagesForDate]) => ({
      date,
      messages: messagesForDate,
    }))
  }, [allMessages])
}
