import { describe, expect, it } from '@jest/globals';
import { createProjectSchema, updateProjectSchema } from '../src/validators/project.js';

describe('project validators', () => {
  it('accepts valid create payload', () => {
    const grid = Array.from({ length: 16 }, (_, i) => ({
      index: i,
      type: 'empty',
      content: '',
      style: {},
    }));
    const r = createProjectSchema.safeParse({ title: 'My Story', blanketConfig: grid });
    expect(r.success).toBe(true);
  });

  it('rejects update with empty body', () => {
    const r = updateProjectSchema.safeParse({});
    expect(r.success).toBe(false);
  });
});
