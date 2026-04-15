import { useCallback, useEffect, useState } from 'react'
import { Modal } from '@/components/Modal'
import { Button } from '@/components/Button'
import { uploadImage } from '@/services/api'
import type { Patch, PatchType } from '@/types/project'

type Props = {
  open: boolean
  patch: Patch | null
  onClose: () => void
  onSave: (patch: Patch) => void
}

type ImageMode = 'upload' | 'url'

export function PatchEditorModal({ open, patch, onClose, onSave }: Props) {
  const [type, setType] = useState<PatchType>('empty')
  const [content, setContent] = useState('')
  const [storySnippet, setStorySnippet] = useState('')
  const [imageMode, setImageMode] = useState<ImageMode>('upload')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  useEffect(() => {
    if (!patch) return
    setType(patch.type)
    setContent(patch.content)
    setStorySnippet(patch.storySnippet ?? '')
    setUploadError(null)
    if (patch.type === 'image' && patch.content.startsWith('/uploads/')) {
      setImageMode('upload')
    } else if (patch.type === 'image' && patch.content.startsWith('http')) {
      setImageMode('url')
    }
  }, [patch])

  const handleFile = useCallback(
    async (file: File | null) => {
      if (!file || !patch) return
      setUploadError(null)
      setUploading(true)
      try {
        const { url } = await uploadImage(file)
        setContent(url)
        setType('image')
        setImageMode('upload')
      } catch (e) {
        setUploadError(e instanceof Error ? e.message : 'Upload failed')
      } finally {
        setUploading(false)
      }
    },
    [patch]
  )

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      const file = e.dataTransfer.files?.[0]
      if (file?.type.startsWith('image/')) void handleFile(file)
    },
    [handleFile]
  )

  if (!patch) return null

  function save() {
    if (!patch) return
    if (type === 'image' && !content.trim()) {
      setUploadError('Add an image (upload or URL) before saving.')
      return
    }
    const next: Patch = {
      index: patch.index,
      type,
      content: type === 'empty' ? '' : content,
      style: patch.style,
      storySnippet,
    }
    onSave(next)
    onClose()
  }

  return (
    <Modal open={open} title={`Patch ${patch.index + 1}`} onClose={onClose}>
      <div className="space-y-4 text-left">
        <label className="block">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Type</span>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as PatchType)}
            className="mt-1 w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
          >
            <option value="empty">Empty · breathing room</option>
            <option value="text">Text</option>
            <option value="image">Image</option>
          </select>
        </label>

        {type === 'image' ? (
          <div className="space-y-3">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setImageMode('upload')}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                  imageMode === 'upload'
                    ? 'bg-violet-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Upload file
              </button>
              <button
                type="button"
                onClick={() => setImageMode('url')}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                  imageMode === 'url'
                    ? 'bg-violet-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Image URL
              </button>
            </div>

            {imageMode === 'upload' ? (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={onDrop}
                className="rounded-2xl border-2 border-dashed border-violet-300/80 bg-violet-50/50 px-4 py-8 text-center"
              >
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
                  className="hidden"
                  id="patch-image-upload"
                  onChange={(e) => void handleFile(e.target.files?.[0] ?? null)}
                />
                <label htmlFor="patch-image-upload" className="cursor-pointer text-sm text-slate-700">
                  <span className="font-semibold text-violet-700">Choose a file</span> or drag an image
                  here
                </label>
                <p className="mt-2 text-xs text-slate-500">JPEG, PNG, GIF, WebP, SVG · max 5MB</p>
                {uploading ? <p className="mt-3 text-sm text-violet-600">Uploading…</p> : null}
                {uploadError ? <p className="mt-3 text-sm text-rose-600">{uploadError}</p> : null}
                {content && content.startsWith('/uploads/') ? (
                  <p className="mt-3 truncate text-xs text-slate-500">Saved as {content}</p>
                ) : null}
              </div>
            ) : (
              <label className="block">
                <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Image URL
                </span>
                <input
                  type="url"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="https://"
                  className="mt-1 w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
                />
              </label>
            )}
          </div>
        ) : null}

        {type === 'text' ? (
          <label className="block">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Words</span>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              className="mt-1 w-full resize-none rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
            />
          </label>
        ) : null}

        <label className="block">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Story snippet (optional)
          </span>
          <textarea
            value={storySnippet}
            onChange={(e) => setStorySnippet(e.target.value)}
            rows={3}
            placeholder="A whisper of context for this square…"
            className="mt-1 w-full resize-none rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
          />
        </label>
        <div className="flex flex-wrap justify-end gap-2 pt-2">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={save} disabled={uploading}>
            Save patch
          </Button>
        </div>
      </div>
    </Modal>
  )
}
