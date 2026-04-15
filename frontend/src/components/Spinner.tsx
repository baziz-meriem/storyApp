type Props = {
  label: string
  className?: string
}

/** Accessible loading indicator (label is announced to screen readers). */
export function Spinner({ label, className = '' }: Props) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex items-center gap-3 text-slate-600 ${className}`}
    >
      <span
        className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-violet-200 border-t-violet-600"
        aria-hidden
      />
      <span className="text-sm">{label}</span>
    </div>
  )
}
