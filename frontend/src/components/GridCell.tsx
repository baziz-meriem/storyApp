import { motion } from 'framer-motion'
import type { Patch } from '@/types/project'
import { resolveMediaUrl } from '@/utils/mediaUrl'

type Props = {
  patch: Patch
  onSelect: () => void
  readOnly?: boolean
}

const pastel = [
  'from-rose-100/80 to-orange-50',
  'from-violet-100/80 to-fuchsia-50',
  'from-emerald-100/80 to-teal-50',
  'from-sky-100/80 to-indigo-50',
  'from-amber-100/80 to-yellow-50',
  'from-pink-100/80 to-rose-50',
  'from-cyan-100/80 to-blue-50',
  'from-lime-100/80 to-emerald-50',
]

export function GridCell({ patch, onSelect, readOnly }: Props) {
  const accent = pastel[patch.index % pastel.length]
  const isImage = patch.type === 'image' && patch.content
  const isText = patch.type === 'text' && patch.content
  const imgSrc = isImage ? resolveMediaUrl(patch.content) : ''

  return (
    <motion.button
      type="button"
      disabled={readOnly}
      onClick={onSelect}
      whileHover={readOnly ? undefined : { scale: 1.02 }}
      whileTap={readOnly ? undefined : { scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 420, damping: 28 }}
      className={`group relative aspect-square w-full overflow-hidden rounded-2xl border border-white/70 bg-gradient-to-br ${accent} p-2 text-left shadow-sm ring-1 ring-black/5 transition hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 disabled:cursor-default`}
    >
      {isImage && imgSrc ? (
        <img
          src={imgSrc}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
      ) : null}
      <div
        className={`relative z-[1] flex h-full flex-col justify-between gap-1 ${
          isImage ? 'bg-gradient-to-t from-black/55 via-black/10 to-transparent p-2 text-white' : ''
        }`}
      >
        <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-600/80">
          Patch {patch.index + 1}
        </span>
        {isText ? (
          <p className="line-clamp-4 text-xs font-medium leading-snug text-slate-800">{patch.content}</p>
        ) : null}
        {!isText && !isImage ? (
          <p className="text-xs italic text-slate-500">Tap to weave this square…</p>
        ) : null}
        {patch.storySnippet ? (
          <p
            className={`line-clamp-2 text-[11px] leading-snug ${
              isImage ? 'text-white/90' : 'text-slate-600'
            }`}
          >
            {patch.storySnippet}
          </p>
        ) : null}
      </div>
    </motion.button>
  )
}
