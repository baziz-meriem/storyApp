import { useEffect, useState } from 'react'
import { fetchMe } from '@/services/api'
import { useAuthStore } from '@/store/authStore'

export function useAuthBootstrap() {
  const [ready, setReady] = useState(() => useAuthStore.persist.hasHydrated())
  const token = useAuthStore((s) => s.token)
  const setUser = useAuthStore((s) => s.setUser)
  const logout = useAuthStore((s) => s.logout)

  useEffect(() => {
    const unsub = useAuthStore.persist.onFinishHydration(() => setReady(true))
    return unsub
  }, [])

  useEffect(() => {
    if (!ready || !token) return
    let cancelled = false
    fetchMe()
      .then((user) => {
        if (!cancelled) setUser(user)
      })
      .catch(() => {
        if (!cancelled) logout()
      })
    return () => {
      cancelled = true
    }
  }, [ready, token, setUser, logout])

  return ready
}
