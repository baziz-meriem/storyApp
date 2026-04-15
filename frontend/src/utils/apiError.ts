import axios from 'axios'

/** Pulls a readable message from API JSON errors or Axios failures. */
export function getErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { error?: string; message?: string }
    if (typeof data?.error === 'string' && data.error.trim()) return data.error
    if (typeof data?.message === 'string' && data.message.trim()) return data.message
    if (err.response?.status === 401) return 'Your session expired. Please sign in again.'
    if (err.response?.status === 403) return 'You do not have permission to do that.'
    if (err.response?.status === 404) return 'We could not find what you were looking for.'
    if (err.response?.status === 409) return 'That already exists. Try something else.'
    if (err.response?.status && err.response.status >= 500) return 'Something went wrong on our side. Try again in a moment.'
  }
  if (err instanceof Error && err.message) return err.message
  return fallback
}
