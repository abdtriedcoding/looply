import { useCallback, useEffect, useRef } from "react"

import { INTERSECTION_THRESHOLD } from "@/constants"

export function useInfiniteScrollTrigger(
  canLoadMore: boolean,
  isLoadingMore: boolean,
  onLoadMore: () => void
) {
  const observerRef = useRef<IntersectionObserver | null>(null)

  const elementRef = useCallback(
    (element: HTMLDivElement | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }

      if (element) {
        observerRef.current = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting && canLoadMore && !isLoadingMore) {
              onLoadMore()
            }
          },
          { threshold: INTERSECTION_THRESHOLD }
        )
        observerRef.current.observe(element)
      }
    },
    [canLoadMore, isLoadingMore, onLoadMore]
  )

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  return elementRef
}
