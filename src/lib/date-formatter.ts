import dayjs from "dayjs"
import isToday from "dayjs/plugin/isToday"
import isYesterday from "dayjs/plugin/isYesterday"

dayjs.extend(isToday)
dayjs.extend(isYesterday)

export const formatFullTime = (date: dayjs.Dayjs) => {
  if (date.isToday()) return "Today"
  else if (date.isYesterday()) return "Yesterday"
  return date.format("MMM D, YYYY") + " at " + date.format("h:mm:ss a")
}
