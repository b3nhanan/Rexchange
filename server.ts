import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { authRouter } from './server/routes/auth';
import { usersRouter } from './server/routes/users';
import { listingsRouter } from './server/routes/listings';
import { messagesRouter } from './server/routes/messages';
import { savedRouter } from './server/routes/saved';
import { reviewsRouter } from './server/routes/reviews';
import { notificationsRouter } from './server/routes/notifications';
import { analyticsRouter } from './server/routes/analytics';
import { aiRouter } from './server/routes/ai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API Health Check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'REXCHANGE Campus Marketplace API', timestamp: new Date().toISOString() });
  });

  // Mount API Routers
  app.use('/api/auth', authRouter);
  app.use('/api/users', usersRouter);
  app.use('/api/listings', listingsRouter);
  app.use('/api/messages', messagesRouter);
  app.use('/api/saved', savedRouter);
  app.use('/api/reviews', reviewsRouter);
  app.use('/api/notifications', notificationsRouter);
  app.use('/api/analytics', analyticsRouter);
  app.use('/api/ai', aiRouter);

  // Development vs Production serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[REXCHANGE Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[REXCHANGE Server] Failed to start:', err);
  process.exit(1);
});
