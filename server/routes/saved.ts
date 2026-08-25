import { Router } from 'express';
import { db } from '../db';

export const savedRouter = Router();

// GET /api/saved?userId=
savedRouter.get('/', (req, res) => {
  try {
    const userId = (req.query.userId as string) || 'user-1';
    const listings = db.getSavedListings(userId);
    return res.json({ listings });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch saved listings' });
  }
});

// POST /api/saved
savedRouter.post('/', (req, res) => {
  try {
    const { userId, listingId } = req.body;
    if (!userId || !listingId) {
      return res.status(400).json({ error: 'userId and listingId are required' });
    }
    db.saveListing(userId, listingId);
    return res.json({ success: true, message: 'Listing saved' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to save listing' });
  }
});

// DELETE /api/saved/:listingId?userId=
savedRouter.delete('/:listingId', (req, res) => {
  try {
    const userId = (req.query.userId as string) || (req.body?.userId as string) || 'user-1';
    db.removeSavedListing(userId, req.params.listingId);
    return res.json({ success: true, message: 'Listing removed from saved' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to remove saved listing' });
  }
});
