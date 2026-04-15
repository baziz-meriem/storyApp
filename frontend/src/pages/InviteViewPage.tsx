import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shell } from '@/components/Shell'
import { BlanketGrid } from '@/components/BlanketGrid'
import { InlineAlert } from '@/components/InlineAlert'
import { Spinner } from '@/components/Spinner'
import { getInviteProject } from '@/services/api'
import { getErrorMessage } from '@/utils/apiError'
import { createDefaultGrid } from '@/types/project'
import type { PublicProject } from '@/types/project'

export function InviteViewPage() {
  const { code } = useParams<{ code: string }>()
  const [project, setProject] = useState<PublicProject | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!code) return
    let cancelled = false
    getInviteProject(code)
      .then((p) => {
        if (!cancelled) setProject(p)
      })
      .catch((e) => {
        if (!cancelled)
          setError(
            getErrorMessage(
              e,
              'This link may be wrong, expired, or the blanket was removed. Ask the owner for a new link.'
            )
          )
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [code])

  if (loading) {
    return (
      <Shell>
        <div className="flex min-h-[40vh] items-center justify-center">
          <Spinner label="Loading shared blanket…" />
        </div>
      </Shell>
    )
  }

  if (error || !project) {
    return (
      <Shell>
        <div className="mx-auto max-w-md text-center">
          <InlineAlert variant="error" title="We can’t show this blanket">
            {error}
          </InlineAlert>
          <p className="mt-6 text-sm text-slate-600">
            If you expected to see something here, double-check the link or ask whoever shared it with you.
          </p>
          <Link
            to="/"
            className="mt-6 inline-block text-sm font-semibold text-violet-700 underline-offset-4 hover:underline"
          >
            Go to home
          </Link>
        </div>
      </Shell>
    )
  }

  const patches =
    project.blanketConfig?.length === 16 ? project.blanketConfig : createDefaultGrid()

  return (
    <Shell>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-3xl text-center"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-600">Shared blanket</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          {project.title}
        </h1>
        <p className="mt-3 text-sm text-slate-600">
          Shared by {project.ownerName || 'someone'}{' '}
          {project.ownerEmail ? <span className="text-slate-500">({project.ownerEmail})</span> : null}
        </p>
        <p className="mx-auto mt-4 max-w-lg text-sm text-slate-500">
          This is a read-only view. Patches cannot be edited from this link.
        </p>
      </motion.div>

      <div className="mt-12">
        <BlanketGrid patches={patches} onPatchSelect={() => {}} readOnly />
      </div>

      <p className="mt-12 text-center text-xs text-slate-500">
        Made with Little Stories ·{' '}
        <Link to="/" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          Create your own
        </Link>
      </p>
    </Shell>
  )
}
