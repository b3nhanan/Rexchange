import { Router } from 'express';
import { db } from '../db';

export const reviewsRouter = Router();

// GET /api/reviews/:userId
reviewsRouter.get('/:userId', (req, res) => {
  try {
    const reviews = db.getReviewsForUser(req.params.userId);
    return res.json({ reviews });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// POST /api/reviews
reviewsRouter.post('/', (req, res) => {
  try {
    const { listingId, reviewerId, revieweeId, rating, comment } = req.body;
    if (!listingId || !reviewerId || !revieweeId || !rating) {
      return res.status(400).json({ error: 'listingId, reviewerId, revieweeId, and rating are required' });
    }

    const reviewer = db.getUserById(reviewerId);
    const review = db.createReview({
      listingId,
      reviewerId,
      reviewerName: reviewer ? reviewer.name : 'Campus Student',
      reviewerAvatar: reviewer
        ? reviewer.avatar
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      revieweeId,
      rating: Number(rating),
      comment: comment || '',
    });

    return res.status(201).json({ review });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to create review' });
  }
});
