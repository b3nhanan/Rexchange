import { Router } from 'express';
import { db } from '../db';

export const listingsRouter = Router();

// GET /api/listings/trending
listingsRouter.get('/trending', (req, res) => {
  try {
    const listings = db.getListings();
    const trending = [...listings].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 6);
    return res.json({ listings: trending });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch trending listings' });
  }
});

// GET /api/listings/recommended
listingsRouter.get('/recommended', (req, res) => {
  try {
    const userId = (req.query.userId as string) || 'user-1';
    const user = db.getUserById(userId);
    const listings = db.getListings();

    if (!user) {
      return res.json({ listings: listings.slice(0, 4) });
    }

    // Recommendation logic: match department keywords, high ratings, or complementary categories
    const recommended = listings
      .filter((l) => l.sellerId !== userId)
      .map((l) => {
        let score = 0;
        if (l.seller.department.toLowerCase() === user.department.toLowerCase()) score += 5;
        if (l.tags.some((t) => user.department.toLowerCase().includes(t.toLowerCase()))) score += 4;
        if (l.category === 'Opportunities') score += 2;
        if (l.seller.rating >= 4.8) score += 3;
        return { listing: l, score };
      })
      .sort((a, b) => b.score - a.score)
      .map((item) => item.listing)
      .slice(0, 4);

    return res.json({ listings: recommended.length > 0 ? recommended : listings.slice(0, 4) });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch recommended listings' });
  }
});

// GET /api/listings
listingsRouter.get('/', (req, res) => {
  try {
    const { category, subcategory, search, minPrice, maxPrice, status, sellerId } = req.query;

    const listings = db.getListings({
      category: category as string,
      subcategory: subcategory as string,
      search: search as string,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      status: status as string,
      sellerId: sellerId as string,
    });

    return res.json({ listings });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch listings' });
  }
});

// GET /api/listings/:id
listingsRouter.get('/:id', (req, res) => {
  try {
    const listing = db.getListingById(req.params.id, true);
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    return res.json({ listing });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch listing' });
  }
});

// POST /api/listings
listingsRouter.post('/', (req, res) => {
  try {
    const {
      title,
      description,
      category,
      subcategory,
      price,
      priceUnit,
      condition,
      imageUrl,
      location,
      tags,
      sellerId,
      acceptedTradeOffers,
    } = req.body;

    if (!title || !category || !subcategory || !sellerId) {
      return res.status(400).json({ error: 'Title, category, subcategory, and sellerId are required' });
    }

    const seller = db.getUserById(sellerId);
    const sellerObj = seller
      ? {
          id: seller.id,
          name: seller.name,
          avatar: seller.avatar,
          department: seller.department,
          year: seller.year,
          rating: seller.ratingAvg,
          tradesCompleted: seller.tradesCompleted,
        }
      : {
          id: sellerId,
          name: 'Campus Student',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          department: 'General',
          year: 'Student',
          rating: 5.0,
          tradesCompleted: 0,
        };

    const listing = db.createListing({
      title,
      description: description || '',
      category,
      subcategory,
      price: price !== undefined ? Number(price) : 0,
      priceUnit: priceUnit || '',
      condition: condition || 'Good',
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      location: location || 'Campus Center',
      tags: Array.isArray(tags) ? tags : [],
      sellerId,
      seller: sellerObj,
      status: 'active',
      acceptedTradeOffers: Array.isArray(acceptedTradeOffers) ? acceptedTradeOffers : [],
    });

    return res.status(201).json({ listing });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to create listing' });
  }
});

// PUT /api/listings/:id
listingsRouter.put('/:id', (req, res) => {
  try {
    const updated = db.updateListing(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    return res.json({ listing: updated });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update listing' });
  }
});

// DELETE /api/listings/:id
listingsRouter.delete('/:id', (req, res) => {
  try {
    const success = db.deleteListing(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    return res.json({ success: true, message: 'Listing deleted' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to delete listing' });
  }
});
