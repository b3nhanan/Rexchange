import { Router } from 'express';
import { db } from '../db';

export const analyticsRouter = Router();

// GET /api/analytics/community
analyticsRouter.get('/community', (req, res) => {
  try {
    const analytics = db.getCommunityAnalytics();
    return res.json(analytics);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch community analytics' });
  }
});
