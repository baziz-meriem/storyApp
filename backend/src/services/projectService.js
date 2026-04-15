import { Project, ensureBlanketConfig } from '../models/Project.js';
import { generateInviteCode } from '../utils/inviteCode.js';

async function uniqueInviteCode() {
  for (let i = 0; i < 10; i++) {
    const code = generateInviteCode();
    const exists = await Project.exists({ inviteCode: code });
    if (!exists) return code;
  }
  throw new Error('Could not generate invite code');
}

export async function createProject(userId, { title, blanketConfig }) {
  const inviteCode = await uniqueInviteCode();
  const blanket = blanketConfig ? ensureBlanketConfig(blanketConfig) : undefined;
  const project = await Project.create({
    userId,
    title,
    inviteCode,
    ...(blanket ? { blanketConfig: blanket } : {}),
  });
  return toProjectDto(project);
}

export async function listProjects(userId) {
  const list = await Project.find({ userId }).sort({ updatedAt: -1 }).lean();
  return list.map(toProjectDto);
}

export async function getProjectById(userId, projectId) {
  const project = await Project.findOne({ _id: projectId, userId }).lean();
  if (!project) {
    const err = new Error('Project not found');
    err.status = 404;
    throw err;
  }
  return toProjectDto(project);
}

export async function updateProject(userId, projectId, { title, blanketConfig }) {
  const update = {};
  if (title !== undefined) update.title = title;
  if (blanketConfig !== undefined) {
    update.blanketConfig = ensureBlanketConfig(blanketConfig);
  }
  const project = await Project.findOneAndUpdate(
    { _id: projectId, userId },
    { $set: update },
    { new: true, runValidators: true }
  ).lean();
  if (!project) {
    const err = new Error('Project not found');
    err.status = 404;
    throw err;
  }
  return toProjectDto(project);
}

export async function deleteProject(userId, projectId) {
  const result = await Project.deleteOne({ _id: projectId, userId });
  if (result.deletedCount === 0) {
    const err = new Error('Project not found');
    err.status = 404;
    throw err;
  }
  return { ok: true };
}

export async function getProjectByInviteCode(code) {
  const project = await Project.findOne({ inviteCode: code }).populate('userId', 'name email').lean();
  if (!project) {
    const err = new Error('Project not found');
    err.status = 404;
    throw err;
  }
  return toPublicProjectDto(project);
}

function toProjectDto(doc) {
  return {
    id: doc._id.toString(),
    userId: doc.userId.toString(),
    title: doc.title,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    blanketConfig: doc.blanketConfig,
    inviteCode: doc.inviteCode,
  };
}

function toPublicProjectDto(doc) {
  const owner = doc.userId;
  return {
    id: doc._id.toString(),
    title: doc.title,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    blanketConfig: doc.blanketConfig,
    inviteCode: doc.inviteCode,
    ownerName: owner?.name || '',
    ownerEmail: owner?.email ? maskEmail(owner.email) : '',
  };
}

function maskEmail(email) {
  const [local, domain] = email.split('@');
  if (!domain) return '***';
  const visible = local.slice(0, 2);
  return `${visible}***@${domain}`;
}
