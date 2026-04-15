import { useEffect, useRef } from 'react'

export function useDebouncedCallback<T extends (...args: Parameters<T>) => void>(
  fn: T,
  delayMs: number
): T {
  const t = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const fnRef = useRef(fn)
  fnRef.current = fn

  useEffect(() => () => clearTimeout(t.current), [])

  return ((...args: Parameters<T>) => {
    clearTimeout(t.current)
    t.current = setTimeout(() => fnRef.current(...args), delayMs)
  }) as T
}
