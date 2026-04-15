import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/store/authStore'
import { Button, buttonVariants } from '@/components/Button'

type Props = {
  children: ReactNode
  showNav?: boolean
}

export function Shell({ children, showNav = true }: Props) {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  return (
    <div className="min-h-dvh">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-violet-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg"
      >
        Skip to main content
      </a>
      {showNav ? (
        <header className="sticky top-0 z-40 border-b border-white/40 bg-white/55 backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
            <Link to="/" className="group inline-flex items-center gap-2 rounded-lg outline-none ring-violet-400 focus-visible:ring-2">
              <motion.span
                className="font-display text-lg font-semibold tracking-tight text-slate-900"
                whileHover={{ y: -1 }}
              >
                Little Stories
              </motion.span>
              <span className="hidden text-xs text-slate-500 sm:inline">blanket tales</span>
            </Link>
            <nav className="flex items-center gap-2 sm:gap-3" aria-label="Main">
              {user ? (
                <>
                  <Link
                    to="/app"
                    className="rounded-full px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-white/80 hover:text-slate-900"
                  >
                    Studio
                  </Link>
                  <span className="hidden max-w-[160px] truncate text-xs text-slate-500 sm:inline" title={user.email}>
                    {user.email}
                  </span>
                  <Button variant="ghost" className="!min-h-[40px] !py-2 !text-xs" onClick={() => logout()}>
                    Sign out
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="rounded-full px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-white/80"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className={`inline-flex min-h-[40px] items-center justify-center rounded-2xl px-5 py-2 text-xs font-semibold tracking-tight transition ${buttonVariants.primary}`}
                  >
                    Start free
                  </Link>
                </>
              )}
            </nav>
          </div>
        </header>
      ) : null}
      <main
        id="main-content"
        tabIndex={-1}
        className="mx-auto max-w-6xl px-4 py-10 outline-none sm:px-6"
      >
        {children}
      </main>
      <footer className="border-t border-white/40 bg-white/30 py-6 text-center text-xs text-slate-500">
        <p>Little Stories — a 16-patch blanket you can edit, reorder, and share.</p>
      </footer>
    </div>
  )
}
