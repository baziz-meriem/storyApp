import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { imageUpload } from '../middleware/upload.js';
import * as uploadController from '../controllers/uploadController.js';

const router = Router();

router.post('/single', requireAuth, imageUpload.single('image'), uploadController.uploadImage);

export default router;
