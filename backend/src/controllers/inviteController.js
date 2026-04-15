import * as projectService from '../services/projectService.js';

export async function getByCode(req, res, next) {
  try {
    const project = await projectService.getProjectByInviteCode(req.params.code);
    res.json({ project });
  } catch (e) {
    next(e);
  }
}
