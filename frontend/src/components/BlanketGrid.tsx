import { GridCell } from '@/components/GridCell'
import type { Patch } from '@/types/project'

type Props = {
  patches: Patch[]
  onPatchSelect: (index: number) => void
  readOnly?: boolean
}

export function BlanketGrid({ patches, onPatchSelect, readOnly }: Props) {
  return (
    <section aria-labelledby="blanket-view-heading">
      <h2 id="blanket-view-heading" className="sr-only">
        {readOnly ? 'Shared blanket: sixteen patches, view only.' : 'Blanket patches'}
      </h2>
    <div className="mx-auto grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
      {patches.map((p) => (
        <GridCell
          key={p.index}
          patch={p}
          readOnly={readOnly}
          onSelect={() => onPatchSelect(p.index)}
        />
      ))}
    </div>
    </section>
  )
}
