import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Shell } from '@/components/Shell'
import { Button } from '@/components/Button'
import { InlineAlert } from '@/components/InlineAlert'
import { register } from '@/services/api'
import { getErrorMessage } from '@/utils/apiError'
import { useAuthStore } from '@/store/authStore'

export function RegisterPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const { token, user } = await register(email, password, name || undefined)
      setAuth(token, user)
      navigate('/app')
    } catch (err) {
      setError(getErrorMessage(err, 'Could not create your account. Try a different email.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Shell>
      <div className="mx-auto max-w-md">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-slate-900">Create your account</h1>
        <p className="mt-2 text-sm text-slate-600">Free to start. You will use this email to sign in later.</p>
        <form
          onSubmit={onSubmit}
          className="mt-8 space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          noValidate
        >
          {error ? <InlineAlert variant="error">{error}</InlineAlert> : null}
          <div>
            <label htmlFor="register-name" className="block text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Name <span className="font-normal normal-case text-slate-400">(optional)</span>
            </label>
            <input
              id="register-name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="How should we greet you?"
              className="mt-1 w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
            />
          </div>
          <div>
            <label htmlFor="register-email" className="block text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Email
            </label>
            <input
              id="register-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={error ? true : undefined}
              className="mt-1 w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
            />
          </div>
          <div>
            <label htmlFor="register-password" className="block text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Password
            </label>
            <input
              id="register-password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-describedby="password-hint"
              aria-invalid={error ? true : undefined}
              className="mt-1 w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
            />
            <p id="password-hint" className="mt-1.5 text-xs text-slate-500">
              Use at least 8 characters. Avoid common words if you can.
            </p>
          </div>
          <Button type="submit" disabled={loading} className="w-full !py-3">
            {loading ? 'Creating your account…' : 'Create account'}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-violet-700 underline-offset-4 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </Shell>
  )
}
