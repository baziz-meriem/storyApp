import { Router } from 'express';
import * as projectController from '../controllers/projectController.js';
import { requireAuth } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { createProjectSchema, updateProjectSchema } from '../validators/project.js';

const router = Router();

router.use(requireAuth);

router.post('/', validateBody(createProjectSchema), projectController.create);
router.get('/', projectController.list);
router.get('/:id', projectController.getOne);
router.put('/:id', validateBody(updateProjectSchema), projectController.update);
router.delete('/:id', projectController.remove);

export default router;
