import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Shell } from '@/components/Shell'
import { Button } from '@/components/Button'
import { InlineAlert } from '@/components/InlineAlert'
import { login } from '@/services/api'
import { getErrorMessage } from '@/utils/apiError'
import { useAuthStore } from '@/store/authStore'

export function LoginPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const { token, user } = await login(email, password)
      setAuth(token, user)
      navigate('/app')
    } catch (err) {
      setError(getErrorMessage(err, 'Could not sign you in. Check your email and password.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Shell>
      <div className="mx-auto max-w-md">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-slate-900">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-600">Sign in to open your studio and continue your blankets.</p>
        <form
          onSubmit={onSubmit}
          className="mt-8 space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          noValidate
        >
          {error ? <InlineAlert variant="error">{error}</InlineAlert> : null}
          <div>
            <label htmlFor="login-email" className="block text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={error ? true : undefined}
              className="mt-1 w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
            />
          </div>
          <div>
            <label htmlFor="login-password" className="block text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={error ? true : undefined}
              className="mt-1 w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full !py-3">
            {loading ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">
          New here?{' '}
          <Link to="/register" className="font-semibold text-violet-700 underline-offset-4 hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </Shell>
  )
}
