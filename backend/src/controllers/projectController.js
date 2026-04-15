import * as projectService from '../services/projectService.js';

export async function create(req, res, next) {
  try {
    const project = await projectService.createProject(req.userId, req.validated);
    res.status(201).json({ project });
  } catch (e) {
    next(e);
  }
}

export async function list(req, res, next) {
  try {
    const projects = await projectService.listProjects(req.userId);
    res.json({ projects });
  } catch (e) {
    next(e);
  }
}

export async function getOne(req, res, next) {
  try {
    const project = await projectService.getProjectById(req.userId, req.params.id);
    res.json({ project });
  } catch (e) {
    next(e);
  }
}

export async function update(req, res, next) {
  try {
    const project = await projectService.updateProject(req.userId, req.params.id, req.validated);
    res.json({ project });
  } catch (e) {
    next(e);
  }
}

export async function remove(req, res, next) {
  try {
    const result = await projectService.deleteProject(req.userId, req.params.id);
    res.json(result);
  } catch (e) {
    next(e);
  }
}
