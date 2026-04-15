import mongoose from 'mongoose';

const patchSchema = new mongoose.Schema(
  {
    index: { type: Number, required: true, min: 0, max: 15 },
    type: { type: String, enum: ['image', 'text', 'empty'], default: 'empty' },
    content: { type: String, default: '' },
    style: { type: mongoose.Schema.Types.Mixed, default: {} },
    storySnippet: { type: String, default: '' },
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    blanketConfig: { type: [patchSchema], default: () => createDefaultBlanket() },
    inviteCode: { type: String, required: true, unique: true, index: true },
  },
  { timestamps: true }
);

function createDefaultBlanket() {
  return Array.from({ length: 16 }, (_, i) => ({
    index: i,
    type: 'empty',
    content: '',
    style: {},
    storySnippet: '',
  }));
}

export function ensureBlanketConfig(config) {
  if (!Array.isArray(config) || config.length !== 16) {
    return createDefaultBlanket();
  }
  return config.map((p, i) => ({
    index: i,
    type: ['image', 'text', 'empty'].includes(p.type) ? p.type : 'empty',
    content: typeof p.content === 'string' ? p.content : '',
    style: p.style && typeof p.style === 'object' ? p.style : {},
    storySnippet: typeof p.storySnippet === 'string' ? p.storySnippet : '',
  }));
}

export const Project = mongoose.model('Project', projectSchema);
