import { Link } from 'react-router-dom'
import { Shell } from '@/components/Shell'
import { buttonVariants } from '@/components/Button'

export function NotFoundPage() {
  return (
    <Shell>
      <div className="mx-auto max-w-md text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-violet-600">404</p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-slate-900">Page not found</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          That address does not exist or was moved. Check the URL, or head back to the home page.
        </p>
        <Link
          to="/"
          className={`mt-8 inline-flex items-center justify-center rounded-2xl px-6 py-3 text-sm font-semibold ${buttonVariants.primary}`}
        >
          Back to home
        </Link>
      </div>
    </Shell>
  )
}
