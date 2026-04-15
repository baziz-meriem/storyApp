import { Router } from 'express';
import * as inviteController from '../controllers/inviteController.js';

const router = Router();

router.get('/:code', inviteController.getByCode);

export default router;
