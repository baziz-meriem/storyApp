export type PatchType = 'image' | 'text' | 'empty'

export interface Patch {
  index: number
  type: PatchType
  content: string
  style: Record<string, string | number | undefined>
  storySnippet?: string
}

export interface Project {
  id: string
  userId: string
  title: string
  createdAt: string
  updatedAt: string
  blanketConfig: Patch[]
  inviteCode: string
}

export interface PublicProject {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  blanketConfig: Patch[]
  inviteCode: string
  ownerName: string
  ownerEmail: string
}

export interface User {
  id: string
  email: string
  name: string
  premiumUnlocked: boolean
}

export function createDefaultGrid(): Patch[] {
  return Array.from({ length: 16 }, (_, i) => ({
    index: i,
    type: 'empty' as const,
    content: '',
    style: {},
    storySnippet: '',
  }))
}
