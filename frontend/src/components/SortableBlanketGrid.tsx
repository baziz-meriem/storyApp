import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { motion } from 'framer-motion'
import type { Patch } from '@/types/project'
import { resolveMediaUrl } from '@/utils/mediaUrl'

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

function GripIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm10-12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
    </svg>
  )
}

type CellProps = {
  id: string
  patch: Patch
  onSelect: () => void
}

function SortablePatchCell({ id, patch, onSelect }: CellProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 20 : undefined,
    opacity: isDragging ? 0.92 : 1,
  }

  const accent = pastel[patch.index % pastel.length]
  const isImage = patch.type === 'image' && patch.content
  const isText = patch.type === 'text' && patch.content
  const imgSrc = isImage ? resolveMediaUrl(patch.content) : ''

  return (
    <div ref={setNodeRef} style={style} className="relative touch-manipulation">
      <button
        type="button"
        className="absolute left-1 top-1 z-20 flex h-8 w-8 cursor-grab items-center justify-center rounded-lg border border-slate-300/90 bg-white/95 text-slate-600 shadow-sm active:cursor-grabbing hover:bg-white"
        aria-label="Drag to reorder patch"
        {...listeners}
        {...attributes}
      >
        <GripIcon />
      </button>
      <motion.button
        type="button"
        onClick={onSelect}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 420, damping: 28 }}
        className={`group relative aspect-square w-full overflow-hidden rounded-2xl border border-white/70 bg-gradient-to-br ${accent} p-2 pl-9 text-left shadow-sm ring-1 ring-black/5 transition hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500`}
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
          <span
            className={`text-[10px] font-semibold uppercase tracking-widest ${
              isImage ? 'text-white/90' : 'text-slate-600/90'
            }`}
          >
            Patch {patch.index + 1}
          </span>
          {isText ? (
            <p
              className={`line-clamp-4 text-xs font-medium leading-snug ${
                isImage ? 'text-white' : 'text-slate-800'
              }`}
            >
              {patch.content}
            </p>
          ) : null}
          {!isText && !isImage ? (
            <p className="text-xs italic text-slate-500">Tap to edit · drag handle to move</p>
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
    </div>
  )
}

type Props = {
  patches: Patch[]
  onPatchSelect: (index: number) => void
  onReorder: (patches: Patch[]) => void
}

const SLOT_IDS = Array.from({ length: 16 }, (_, i) => String(i))

export function SortableBlanketGrid({ patches, onPatchSelect, onReorder }: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = Number(active.id)
    const newIndex = Number(over.id)
    if (Number.isNaN(oldIndex) || Number.isNaN(newIndex)) return
    const moved = arrayMove(patches, oldIndex, newIndex)
    const reindexed = moved.map((p, i) => ({ ...p, index: i }))
    onReorder(reindexed)
  }

  return (
    <section aria-labelledby="blanket-editor-heading" className="outline-none">
      <h2 id="blanket-editor-heading" className="sr-only">
        Blanket editor: sixteen draggable patches. Use the grip to reorder, or tap a patch to edit.
      </h2>
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={SLOT_IDS} strategy={rectSortingStrategy}>
        <div className="mx-auto grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {patches.map((patch, i) => (
            <SortablePatchCell
              key={String(i)}
              id={String(i)}
              patch={patch}
              onSelect={() => onPatchSelect(i)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
    </section>
  )
}
