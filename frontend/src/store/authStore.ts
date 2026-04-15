import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types/project'

interface AuthState {
  token: string | null
  user: User | null
  setAuth: (token: string, user: User) => void
  setUser: (user: User) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (token, user) => set({ token, user }),
      setUser: (user) => set({ user }),
      logout: () => set({ token: null, user: null }),
    }),
    {
      name: 'little-stories-auth',
      partialize: (s) => ({ token: s.token, user: s.user }),
    }
  )
)
