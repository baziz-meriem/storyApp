import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shell } from '@/components/Shell'
import { Button, buttonVariants } from '@/components/Button'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { InlineAlert } from '@/components/InlineAlert'
import { Spinner } from '@/components/Spinner'
import {
  createCheckoutSession,
  createProject,
  deleteProject,
  fetchMe,
  listProjects,
} from '@/services/api'
import { getErrorMessage } from '@/utils/apiError'
import { useAuthStore } from '@/store/authStore'
import type { Project } from '@/types/project'

export function DashboardPage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const setUser = useAuthStore((s) => s.setUser)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const loadProjects = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const p = await listProjects()
      setProjects(p)
    } catch (e) {
      setError(getErrorMessage(e, 'We could not load your blankets. Check your connection and try again.'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadProjects()
  }, [loadProjects])

  async function handleNew() {
    setCreating(true)
    setError(null)
    try {
      const title = `Untitled blanket ${projects.length + 1}`
      const p = await createProject(title)
      setProjects((prev) => [p, ...prev])
      navigate(`/app/projects/${p.id}`)
    } catch (e) {
      setError(getErrorMessage(e, 'We could not create a new blanket. Please try again.'))
    } finally {
      setCreating(false)
    }
  }

  async function confirmDelete() {
    if (!deleteId) return
    setError(null)
    try {
      await deleteProject(deleteId)
      setProjects((prev) => prev.filter((p) => p.id !== deleteId))
      setDeleteId(null)
    } catch (e) {
      setError(getErrorMessage(e, 'We could not delete this blanket.'))
      setDeleteId(null)
    }
  }

  async function handlePremium() {
    setCheckoutLoading(true)
    setError(null)
    try {
      const origin = window.location.origin
      const { url } = await createCheckoutSession(
        `${origin}/app?checkout=success`,
        `${origin}/app?checkout=cancel`
      )
      if (url) window.location.href = url
      else setError('Payments are not set up yet. You can still use all editor features.')
    } catch (e) {
      setError(getErrorMessage(e, 'Checkout is not available right now.'))
    } finally {
      setCheckoutLoading(false)
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('checkout') !== 'success') return
    fetchMe()
      .then((u) => setUser(u))
      .catch(() => {})
    window.history.replaceState({}, '', '/app')
  }, [setUser])

  async function copyInvite(code: string) {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/invite/${code}`)
      setCopiedCode(code)
      window.setTimeout(() => setCopiedCode(null), 2500)
    } catch {
      setError('Could not copy. Select the link or code and copy it manually.')
    }
  }

  const deleteTitle = deleteId ? projects.find((p) => p.id === deleteId)?.title ?? 'this blanket' : ''

  return (
    <Shell>
      <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-slate-900">Your studio</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600">
            Each row is one blanket: 16 squares you can fill, reorder, and share with a read-only link.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {!user?.premiumUnlocked ? (
            <Button variant="ghost" disabled={checkoutLoading} onClick={handlePremium}>
              {checkoutLoading ? 'Opening checkout…' : 'Unlock premium'}
            </Button>
          ) : (
            <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-2 text-xs font-medium text-emerald-900">
              Premium unlocked
            </span>
          )}
          <Button onClick={handleNew} disabled={creating}>
            {creating ? 'Creating…' : 'New blanket'}
          </Button>
        </div>
      </div>

      {error ? (
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-start">
          <InlineAlert variant="error" className="flex-1">
            {error}
          </InlineAlert>
          <Button
            variant="ghost"
            className="shrink-0"
            onClick={() => {
              setError(null)
              void loadProjects()
            }}
          >
            Try again
          </Button>
        </div>
      ) : null}

      {loading ? (
        <div className="mt-10">
          <Spinner label="Loading your blankets…" />
        </div>
      ) : projects.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 rounded-3xl border-2 border-dashed border-slate-200 bg-white/60 p-10 text-center shadow-sm sm:p-14"
        >
          <h2 className="font-display text-lg font-semibold text-slate-900">Nothing here yet</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-600">
            Create a blanket to open the 16-patch editor. You can add text, photos, and reorder squares anytime.
          </p>
          <Button className="mt-8" onClick={handleNew} disabled={creating}>
            {creating ? 'Creating…' : 'Create your first blanket'}
          </Button>
        </motion.div>
      ) : (
        <ul className="mt-10 grid gap-4 sm:grid-cols-2" aria-label="Your blankets">
          {projects.map((p, i) => (
            <motion.li
              key={p.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="group rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-sm backdrop-blur-md transition hover:border-violet-200 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Link
                    to={`/app/projects/${p.id}`}
                    className="font-display text-lg font-semibold text-slate-900 transition group-hover:text-violet-700"
                  >
                    {p.title}
                  </Link>
                  <p className="mt-1 text-xs text-slate-500">
                    Last updated {new Date(p.updatedAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setDeleteId(p.id)}
                  className="shrink-0 rounded-lg px-2 py-1.5 text-xs font-medium text-rose-600 underline-offset-2 hover:bg-rose-50 hover:underline"
                >
                  Delete
                </button>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-500">Share link:</span>
                <code className="max-w-[min(100%,12rem)] truncate rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-800">
                  /invite/{p.inviteCode}
                </code>
                <button
                  type="button"
                  onClick={() => void copyInvite(p.inviteCode)}
                  className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  {copiedCode === p.inviteCode ? 'Copied!' : 'Copy link'}
                </button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  to={`/app/projects/${p.id}`}
                  className={`inline-flex min-h-[40px] items-center justify-center rounded-2xl px-5 py-2 text-xs font-semibold transition ${buttonVariants.primary}`}
                >
                  Open editor
                </Link>
                <Link
                  to={`/invite/${p.inviteCode}`}
                  target="_blank"
                  rel="noreferrer"
                  className={`inline-flex min-h-[40px] items-center justify-center rounded-2xl px-5 py-2 text-xs font-semibold transition ${buttonVariants.ghost}`}
                >
                  Preview in new tab
                </Link>
              </div>
            </motion.li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={deleteId !== null}
        title="Delete this blanket?"
        description={`“${deleteTitle}” will be removed permanently. This cannot be undone.`}
        confirmLabel="Delete blanket"
        cancelLabel="Keep it"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </Shell>
  )
}
