import type { MouseEventHandler, ReactNode } from 'react'
import { motion } from 'framer-motion'

/** Explicit colors so buttons stay visible on any background (Tailwind theme tokens can fail in some builds). */
export const buttonVariants = {
  primary:
    'bg-violet-600 text-white border border-violet-800/40 shadow-md hover:bg-violet-700 active:bg-violet-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500',
  ghost:
    'bg-white text-slate-800 border-2 border-slate-200 shadow-sm hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400',
  danger:
    'bg-rose-600 text-white border border-rose-800/30 shadow-md hover:bg-rose-700 active:bg-rose-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500',
} as const

type Variant = keyof typeof buttonVariants

type Props = {
  variant?: Variant
  children: ReactNode
  className?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  onClick?: MouseEventHandler<HTMLButtonElement>
}

export function Button({ variant = 'primary', className = '', children, type = 'button', ...rest }: Props) {
  return (
    <motion.button
      type={type}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`inline-flex min-h-[42px] min-w-[88px] cursor-pointer items-center justify-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-semibold tracking-tight transition disabled:cursor-not-allowed disabled:opacity-50 ${buttonVariants[variant]} ${className}`}
      {...rest}
    />
  )
}
