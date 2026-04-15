import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useAuthBootstrap } from '@/hooks/useAuthBootstrap'
import { Spinner } from '@/components/Spinner'

type Props = { children: ReactNode }

export function ProtectedRoute({ children }: Props) {
  const ready = useAuthBootstrap()
  const token = useAuthStore((s) => s.token)
  const user = useAuthStore((s) => s.user)
  const location = useLocation()

  if (!ready) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-2 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,#f3ecff_0%,#faf8f5_45%,#f5f0eb_100%)] px-4">
        <Spinner label="Loading…" />
        <p className="text-center text-xs text-slate-500">Preparing your studio</p>
      </div>
    )
  }

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (!user) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-2 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,#f3ecff_0%,#faf8f5_45%,#f5f0eb_100%)] px-4">
        <Spinner label="Signing you in…" />
        <p className="text-center text-xs text-slate-500">Checking your account</p>
      </div>
    )
  }

  return <>{children}</>
}
