import { Router } from 'express';
import { db } from '../db';

export const notificationsRouter = Router();

// GET /api/notifications?userId=
notificationsRouter.get('/', (req, res) => {
  try {
    const userId = (req.query.userId as string) || 'user-1';
    const notifications = db.getNotifications(userId);
    const unreadCount = notifications.filter((n) => !n.isRead).length;
    return res.json({ notifications, unreadCount });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// PUT /api/notifications/read-all
notificationsRouter.put('/read-all', (req, res) => {
  try {
    const userId = (req.body?.userId as string) || (req.query.userId as string) || 'user-1';
    db.markAllNotificationsRead(userId);
    return res.json({ success: true, message: 'All notifications marked as read' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to mark notifications read' });
  }
});

// PUT /api/notifications/:id/read
notificationsRouter.put('/:id/read', (req, res) => {
  try {
    db.markNotificationRead(req.params.id);
    return res.json({ success: true, message: 'Notification marked as read' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to mark notification read' });
  }
});
