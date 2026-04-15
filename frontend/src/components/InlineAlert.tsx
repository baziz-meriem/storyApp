import type { ReactNode } from 'react'

type Variant = 'error' | 'success' | 'info'

const styles: Record<Variant, string> = {
  error: 'border-rose-200 bg-rose-50 text-rose-900',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  info: 'border-violet-200 bg-violet-50 text-violet-950',
}

type Props = {
  variant: Variant
  title?: string
  children: ReactNode
  className?: string
}

export function InlineAlert({ variant, title, children, className = '' }: Props) {
  return (
    <div
      role="alert"
      className={`rounded-2xl border px-4 py-3 text-sm leading-relaxed ${styles[variant]} ${className}`}
    >
      {title ? <p className="font-semibold">{title}</p> : null}
      <div className={title ? 'mt-1' : ''}>{children}</div>
    </div>
  )
}
