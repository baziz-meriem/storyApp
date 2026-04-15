import axios from 'axios'
import { useAuthStore } from '@/store/authStore'
import type { Patch, Project, PublicProject, User } from '@/types/project'

const baseURL = import.meta.env.VITE_API_URL ?? ''

export const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export async function register(email: string, password: string, name?: string) {
  const { data } = await api.post<{ user: User; token: string }>('/auth/register', {
    email,
    password,
    name,
  })
  return data
}

export async function login(email: string, password: string) {
  const { data } = await api.post<{ user: User; token: string }>('/auth/login', {
    email,
    password,
  })
  return data
}

export async function fetchMe() {
  const { data } = await api.get<{ user: User }>('/auth/me')
  return data.user
}

export async function listProjects() {
  const { data } = await api.get<{ projects: Project[] }>('/projects')
  return data.projects
}

export async function getProject(id: string) {
  const { data } = await api.get<{ project: Project }>(`/projects/${id}`)
  return data.project
}

export async function createProject(title: string, blanketConfig?: Patch[]) {
  const { data } = await api.post<{ project: Project }>('/projects', { title, blanketConfig })
  return data.project
}

export async function updateProject(id: string, body: { title?: string; blanketConfig?: Patch[] }) {
  const { data } = await api.put<{ project: Project }>(`/projects/${id}`, body)
  return data.project
}

export async function deleteProject(id: string) {
  await api.delete(`/projects/${id}`)
}

export async function getInviteProject(code: string) {
  const { data } = await api.get<{ project: PublicProject }>(`/invite/${code}`)
  return data.project
}

export async function createCheckoutSession(successUrl?: string, cancelUrl?: string) {
  const { data } = await api.post<{ url: string | null; sessionId: string }>(
    '/payment/create-session',
    { successUrl, cancelUrl }
  )
  return data
}

/** Multipart upload — uses fetch so the browser sets the boundary (axios default JSON header breaks this). */
export async function uploadImage(file: File): Promise<{ url: string; filename: string }> {
  const baseURL = import.meta.env.VITE_API_URL ?? ''
  const token = useAuthStore.getState().token
  const form = new FormData()
  form.append('image', file)
  const res = await fetch(`${baseURL}/upload/single`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  })
  const body = (await res.json().catch(() => ({}))) as { error?: string; url?: string; filename?: string }
  if (!res.ok) {
    throw new Error(body.error ?? 'Upload failed')
  }
  if (!body.url) {
    throw new Error('Invalid upload response')
  }
  return { url: body.url, filename: body.filename ?? '' }
}
