import { z } from 'zod';

const patchSchema = z.object({
  index: z.number().int().min(0).max(15),
  type: z.enum(['image', 'text', 'empty']),
  content: z.string().max(20000).optional(),
  style: z.record(z.unknown()).optional(),
  storySnippet: z.string().max(2000).optional(),
});

export const createProjectSchema = z.object({
  title: z.string().min(1).max(200),
  blanketConfig: z.array(patchSchema).length(16).optional(),
});

export const updateProjectSchema = z
  .object({
    title: z.string().min(1).max(200).optional(),
    blanketConfig: z.array(patchSchema).length(16).optional(),
  })
  .refine((d) => d.title !== undefined || d.blanketConfig !== undefined, {
    message: 'Provide title and/or blanketConfig',
  });
