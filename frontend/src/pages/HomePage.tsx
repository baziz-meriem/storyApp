import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shell } from '@/components/Shell'
import { buttonVariants } from '@/components/Button'

const steps = [
  {
    step: '1',
    title: 'Sign up',
    text: 'Create a free account so your blankets are saved and private to you.',
  },
  {
    step: '2',
    title: 'Fill 16 patches',
    text: 'Add text, upload photos, or paste image links. Drag squares to reorder the story.',
  },
  {
    step: '3',
    title: 'Share a link',
    text: 'Anyone with the invite link can view your blanket—no editing, just reading.',
  },
]

export function HomePage() {
  return (
    <Shell>
      <div className="mx-auto max-w-3xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-violet-600"
        >
          Story blanket · 16 patches
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="font-display text-4xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-5xl"
        >
          Weave memories into a quilt your readers can feel.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.12 }}
          className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-600"
        >
          Little Stories is a calm space to arrange photos and words on a four-by-four grid—like a
          digital blanket. Share a read-only link when you are ready.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            to="/register"
            className={`inline-flex min-h-[48px] items-center justify-center rounded-2xl px-8 py-3 text-base font-semibold tracking-tight transition ${buttonVariants.primary}`}
          >
            Begin a blanket
          </Link>
          <Link
            to="/login"
            className={`inline-flex min-h-[48px] items-center justify-center rounded-2xl border-2 border-slate-200 bg-white px-8 py-3 text-base font-semibold tracking-tight text-slate-800 shadow-sm transition hover:bg-slate-50`}
          >
            I have an account
          </Link>
        </motion.div>
        <p className="mt-4 text-sm text-slate-500">No credit card required to try.</p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="mt-14 text-left"
        >
          <h2 className="text-center font-display text-lg font-semibold text-slate-900">How it works</h2>
          <ol className="mt-6 grid gap-4 sm:grid-cols-3">
            {steps.map((s) => (
              <li
                key={s.step}
                className="flex gap-3 rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-sm"
              >
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-800"
                  aria-hidden
                >
                  {s.step}
                </span>
                <div>
                  <p className="font-display text-sm font-semibold text-slate-900">{s.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-10 grid gap-4 rounded-3xl border border-slate-200/80 bg-white/60 p-6 text-left shadow-sm backdrop-blur-md sm:grid-cols-3"
        >
          {[
            { t: 'Visual grid', d: 'Sixteen squares keep your story structured and easy to scan.' },
            { t: 'Gentle sharing', d: 'Invite links show a calm, read-only view for friends and family.' },
            { t: 'Room to grow', d: 'Premium checkout is optional when you want to support the product.' },
          ].map((x) => (
            <div key={x.t} className="rounded-2xl bg-gradient-to-br from-white to-violet-50/50 p-4">
              <p className="font-display text-sm font-semibold text-slate-900">{x.t}</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{x.d}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </Shell>
  )
}
