import { Router } from 'express';
import { db } from '../db';

export const messagesRouter = Router();

// GET /api/messages/conversations?userId=
messagesRouter.get('/conversations', (req, res) => {
  try {
    const userId = (req.query.userId as string) || 'user-1';
    const conversations = db.getConversationsForUser(userId);
    return res.json({ conversations });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

// GET /api/messages/:listingId
messagesRouter.get('/:listingId', (req, res) => {
  try {
    const messages = db.getMessagesByListing(req.params.listingId);
    return res.json({ messages });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch messages for listing' });
  }
});

// POST /api/messages
messagesRouter.post('/', (req, res) => {
  try {
    const { listingId, senderId, receiverId, content } = req.body;
    if (!listingId || !senderId || !receiverId || !content) {
      return res.status(400).json({ error: 'listingId, senderId, receiverId, and content are required' });
    }

    const message = db.createMessage({
      listingId,
      senderId,
      receiverId,
      content,
    });

    return res.status(201).json({ message });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to send message' });
  }
});
