import { useEffect, useState } from "react"

export function usePersistedState(key: string, defaultValue: boolean) {
  const [state, setState] = useState(defaultValue)

  useEffect(() => {
    const stored = localStorage.getItem(key)
    if (stored !== null) {
      setState(JSON.parse(stored))
    }
  }, [key])

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state))
  }, [key, state])

  return [state, setState] as const
}
