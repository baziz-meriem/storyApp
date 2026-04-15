import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Shell } from '@/components/Shell'
import { Button } from '@/components/Button'
import { InlineAlert } from '@/components/InlineAlert'
import { Spinner } from '@/components/Spinner'
import { SortableBlanketGrid } from '@/components/SortableBlanketGrid'
import { PatchEditorModal } from '@/components/PatchEditorModal'
import { useDebouncedCallback } from '@/hooks/useDebouncedCallback'
import { getProject, updateProject } from '@/services/api'
import { getErrorMessage } from '@/utils/apiError'
import { createDefaultGrid } from '@/types/project'
import type { Patch, Project } from '@/types/project'

export function ProjectEditorPage() {
  const { id } = useParams<{ id: string }>()
  const [project, setProject] = useState<Project | null>(null)
  const [patches, setPatches] = useState<Patch[]>(createDefaultGrid())
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [selected, setSelected] = useState<number | null>(null)
  const titleRef = useRef(title)
  titleRef.current = title

  const load = useCallback(() => {
    if (!id) return
    setLoading(true)
    setLoadError(null)
    getProject(id)
      .then((p) => {
        setProject(p)
        setTitle(p.title)
        setPatches(p.blanketConfig?.length === 16 ? p.blanketConfig : createDefaultGrid())
      })
      .catch((e) => {
        setLoadError(getErrorMessage(e, 'We could not open this blanket.'))
      })
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    load()
  }, [load])

  const persist = useCallback(
    async (nextTitle: string, nextPatches: Patch[]) => {
      if (!id) return
      setSaveState('saving')
      try {
        const updated = await updateProject(id, { title: nextTitle, blanketConfig: nextPatches })
        setProject(updated)
        setLoadError(null)
        setSaveState('saved')
        window.setTimeout(() => setSaveState('idle'), 2500)
      } catch (e) {
        setSaveState('error')
        setLoadError(getErrorMessage(e, 'Save failed. Check your connection and try “Save now”.'))
      }
    },
    [id]
  )

  const debouncedPersist = useDebouncedCallback(persist, 1400)

  function updatePatches(updater: (prev: Patch[]) => Patch[]) {
    setPatches((prev) => {
      const next = updater(prev)
      if (id) debouncedPersist(titleRef.current, next)
      return next
    })
  }

  function onTitleBlur() {
    if (!id || !project || title === project.title) return
    persist(titleRef.current, patches)
  }

  function onPatchSave(p: Patch) {
    updatePatches((prev) => {
      const copy = [...prev]
      copy[p.index] = p
      return copy
    })
  }

  function onReorder(next: Patch[]) {
    updatePatches(() => next)
  }

  const selectedPatch = selected !== null ? patches[selected] ?? null : null

  if (loading) {
    return (
      <Shell>
        <Spinner label="Opening your blanket…" />
      </Shell>
    )
  }

  if (loadError && !project) {
    return (
      <Shell>
        <InlineAlert variant="error" title="We could not load this blanket">
          {loadError}
        </InlineAlert>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button type="button" onClick={() => load()}>
            Try again
          </Button>
          <Link
            to="/app"
            className="inline-flex min-h-[42px] items-center justify-center rounded-2xl border-2 border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
          >
            Back to studio
          </Link>
        </div>
      </Shell>
    )
  }

  if (!project || !id) {
    return (
      <Shell>
        <p className="text-sm text-slate-600">This blanket could not be found.</p>
        <Link to="/app" className="mt-4 inline-block text-sm font-semibold text-violet-700 underline">
          Back to studio
        </Link>
      </Shell>
    )
  }

  return (
    <Shell>
      {loadError && project ? (
        <div className="mb-6">
          <InlineAlert variant="error">{loadError}</InlineAlert>
        </div>
      ) : null}

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <Link
            to="/app"
            className="inline-flex text-sm font-semibold text-violet-700 underline-offset-4 hover:underline"
          >
            ← Back to studio
          </Link>
          <label htmlFor="blanket-title" className="mt-4 block font-display text-sm font-medium text-slate-600">
            Blanket name
          </label>
          <input
            id="blanket-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={onTitleBlur}
            className="mt-1 block w-full max-w-xl border-b-2 border-transparent bg-transparent pb-1 font-display text-2xl font-semibold tracking-tight text-slate-900 outline-none placeholder:text-slate-400 focus:border-violet-300"
            placeholder="Give your blanket a name"
            autoComplete="off"
          />
          <p className="mt-3 text-xs leading-relaxed text-slate-500">
            <span className="font-medium text-slate-600">Share:</span>{' '}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-slate-800">{project.inviteCode}</code>{' '}
            ·{' '}
            <Link
              to={`/invite/${project.inviteCode}`}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-violet-700 underline-offset-2 hover:underline"
            >
              Preview what others see
            </Link>
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-stretch gap-2 sm:items-end">
          <div
            role="status"
            aria-live="polite"
            className="inline-flex min-h-[40px] items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-xs font-medium text-slate-700 shadow-sm"
          >
            {saveState === 'saving' && 'Saving…'}
            {saveState === 'saved' && 'All changes saved'}
            {saveState === 'error' && 'Save failed'}
            {saveState === 'idle' && 'Changes save automatically'}
          </div>
          <Button
            variant="ghost"
            type="button"
            className="!text-xs"
            onClick={() => {
              setLoadError(null)
              void persist(title, patches)
            }}
          >
            Save now
          </Button>
        </div>
      </div>

      <p className="mb-6 max-w-2xl text-sm leading-relaxed text-slate-600">
        <strong className="font-semibold text-slate-800">How to edit:</strong> drag the{' '}
        <span className="whitespace-nowrap">⋮⋮</span> handle to reorder patches. Tap any square to add
        text, upload a picture, or paste an image link.
      </p>

      <SortableBlanketGrid patches={patches} onPatchSelect={(i) => setSelected(i)} onReorder={onReorder} />

      <PatchEditorModal
        open={selected !== null}
        patch={selectedPatch}
        onClose={() => setSelected(null)}
        onSave={onPatchSave}
      />
    </Shell>
  )
}
