import path from 'path';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import inviteRoutes from './routes/inviteRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import * as paymentController from './controllers/paymentController.js';
import { requireAuth } from './middleware/auth.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';

const uploadsDir = path.join(process.cwd(), 'uploads');

export function createApp() {
  const app = express();

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      crossOriginEmbedderPolicy: false,
    })
  );
  app.use(
    cors({
      origin: process.env.FRONTEND_URL || true,
      credentials: true,
    })
  );
  app.use(requestLogger);

  app.post(
    '/payment/webhook',
    express.raw({ type: 'application/json' }),
    paymentController.webhook
  );

  app.use(express.json({ limit: '2mb' }));

  app.get('/health', (req, res) => res.json({ ok: true }));

  app.use('/uploads', express.static(uploadsDir));

  app.use('/auth', authRoutes);
  app.use('/projects', projectRoutes);
  app.use('/invite', inviteRoutes);
  app.use('/upload', uploadRoutes);

  app.post('/payment/create-session', requireAuth, paymentController.createSession);

  app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  app.use(errorHandler);
  return app;
}
