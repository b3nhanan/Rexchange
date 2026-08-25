import {
  UserRecord,
  ListingRecord,
  MessageRecord,
  ReviewRecord,
  NotificationRecord,
  SavedListingRecord,
  INITIAL_USERS,
  INITIAL_LISTINGS,
  INITIAL_MESSAGES,
  INITIAL_REVIEWS,
  INITIAL_NOTIFICATIONS,
} from './seedData';
import { recalculateBadges } from './karmaEngine';

class Database {
  private users: Map<string, UserRecord> = new Map();
  private listings: Map<string, ListingRecord> = new Map();
  private messages: MessageRecord[] = [];
  private reviews: ReviewRecord[] = [];
  private notifications: NotificationRecord[] = [];
  private savedListings: SavedListingRecord[] = [];
  private sessions: Map<string, string> = new Map(); // token -> userId

  constructor() {
    this.seed();
  }

  private seed() {
    for (const u of INITIAL_USERS) {
      this.users.set(u.id, { ...u });
    }
    for (const l of INITIAL_LISTINGS) {
      this.listings.set(l.id, { ...l });
    }
    this.messages = INITIAL_MESSAGES.map((m) => ({ ...m }));
    this.reviews = INITIAL_REVIEWS.map((r) => ({ ...r }));
    this.notifications = INITIAL_NOTIFICATIONS.map((n) => ({ ...n }));

    // Default session for initial mock user
    this.sessions.set('mock-token-user-1', 'user-1');
  }

  // --- Auth & Sessions ---
  createSession(userId: string): string {
    const token = `rexchange_token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    this.sessions.set(token, userId);
    return token;
  }

  getUserByToken(token?: string): UserRecord | null {
    if (!token) return null;
    const cleanToken = token.replace(/^Bearer\s+/i, '').trim();
    const userId = this.sessions.get(cleanToken);
    if (!userId) {
      // Fallback: if token is user-1 or mock, map to user-1
      if (cleanToken === 'mock-token-user-1' || cleanToken === 'user-1') {
        return this.users.get('user-1') || null;
      }
      return null;
    }
    return this.users.get(userId) || null;
  }

  deleteSession(token?: string) {
    if (!token) return;
    const cleanToken = token.replace(/^Bearer\s+/i, '').trim();
    this.sessions.delete(cleanToken);
  }

  // --- Users ---
  getAllUsers(): UserRecord[] {
    return Array.from(this.users.values());
  }

  getUserById(id: string): UserRecord | null {
    return this.users.get(id) || null;
  }

  getUserByEmail(email: string): UserRecord | null {
    const normalized = email.trim().toLowerCase();
    for (const u of this.users.values()) {
      if (u.email.toLowerCase() === normalized) return u;
    }
    return null;
  }

  createUser(data: Omit<UserRecord, 'id' | 'karma' | 'tradesCompleted' | 'ratingAvg' | 'reviewsCount' | 'badges' | 'joinedDate'> & { password?: string }): UserRecord {
    const id = `user-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newUser: UserRecord = {
      ...data,
      id,
      avatar: data.avatar || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      bio: data.bio || 'New campus student ready to trade & share.',
      karma: 50, // Welcome signup bonus
      tradesCompleted: 0,
      ratingAvg: 5.0,
      reviewsCount: 0,
      badges: [],
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    };

    this.users.set(id, newUser);

    this.addNotification({
      userId: id,
      title: 'Welcome to REXCHANGE! 🎓',
      message: 'You have earned +50 starter Karma points for joining your verified campus network.',
      type: 'karma',
    });

    return newUser;
  }

  updateUser(id: string, updates: Partial<UserRecord>): UserRecord | null {
    const existing = this.users.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...updates };
    this.users.set(id, updated);
    return updated;
  }

  awardKarma(userId: string, points: number, reason: string): UserRecord | null {
    const user = this.users.get(userId);
    if (!user) return null;

    user.karma += points;
    const { badges, newBadges } = recalculateBadges(user);
    user.badges = badges;
    this.users.set(userId, user);

    this.addNotification({
      userId,
      title: `+${points} Karma Points`,
      message: reason,
      type: 'karma',
    });

    for (const badge of newBadges) {
      this.addNotification({
        userId,
        title: `Badge Unlocked: ${badge} 🏆`,
        message: `Congratulations! You unlocked the ${badge} achievement badge.`,
        type: 'badge',
        link: 'profile',
      });
    }

    return user;
  }

  // --- Listings ---
  getListings(filters?: {
    category?: string;
    subcategory?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    status?: string;
    sellerId?: string;
  }): ListingRecord[] {
    let result = Array.from(this.listings.values());

    if (filters) {
      if (filters.category && filters.category !== 'All') {
        result = result.filter((l) => l.category.toLowerCase() === filters.category!.toLowerCase());
      }
      if (filters.subcategory && filters.subcategory !== 'All Subcategories') {
        result = result.filter((l) => l.subcategory.toLowerCase() === filters.subcategory!.toLowerCase());
      }
      if (filters.status) {
        result = result.filter((l) => l.status === filters.status);
      }
      if (filters.sellerId) {
        result = result.filter((l) => l.sellerId === filters.sellerId);
      }
      if (filters.minPrice !== undefined && !isNaN(filters.minPrice)) {
        result = result.filter((l) => l.price >= filters.minPrice!);
      }
      if (filters.maxPrice !== undefined && !isNaN(filters.maxPrice)) {
        result = result.filter((l) => l.price <= filters.maxPrice!);
      }
      if (filters.search) {
        const query = filters.search.toLowerCase().trim();
        result = result.filter((l) =>
          l.title.toLowerCase().includes(query) ||
          l.description.toLowerCase().includes(query) ||
          l.subcategory.toLowerCase().includes(query) ||
          l.tags.some((t) => t.toLowerCase().includes(query))
        );
      }
    }

    // Sort by latest timestamp
    return result.sort((a, b) => b.createdAtTimestamp - a.createdAtTimestamp);
  }

  getListingById(id: string, incrementViews = false): ListingRecord | null {
    const listing = this.listings.get(id);
    if (!listing) return null;
    if (incrementViews) {
      listing.views = (listing.views || 0) + 1;
      this.listings.set(id, listing);
    }
    return listing;
  }

  createListing(data: Omit<ListingRecord, 'id' | 'createdAt' | 'createdAtTimestamp' | 'views'>): ListingRecord {
    const id = `list-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const seller = this.getUserById(data.sellerId);

    const newListing: ListingRecord = {
      ...data,
      id,
      createdAt: 'Just now',
      createdAtTimestamp: Date.now(),
      views: 1,
      seller: {
        id: seller ? seller.id : data.sellerId,
        name: seller ? seller.name : data.seller.name,
        avatar: seller ? seller.avatar : data.seller.avatar,
        department: seller ? seller.department : data.seller.department,
        year: seller ? seller.year : data.seller.year,
        rating: seller ? seller.ratingAvg : 5.0,
        tradesCompleted: seller ? seller.tradesCompleted : 0,
      },
    };

    this.listings.set(id, newListing);

    // Award +50 Karma for posting listing
    this.awardKarma(data.sellerId, 50, `Listing "${data.title}" published to campus feed`);

    return newListing;
  }

  updateListing(id: string, updates: Partial<ListingRecord>): ListingRecord | null {
    const existing = this.listings.get(id);
    if (!existing) return null;

    const oldStatus = existing.status;
    const updated = { ...existing, ...updates };
    this.listings.set(id, updated);

    // If status changed to exchanged or sold, award trade completion
    if ((updates.status === 'exchanged' || updates.status === 'sold') && oldStatus === 'active') {
      const seller = this.users.get(existing.sellerId);
      if (seller) {
        seller.tradesCompleted += 1;
        this.users.set(seller.id, seller);
        this.awardKarma(seller.id, 40, `Successfully completed exchange for "${existing.title}"`);
      }
    }

    return updated;
  }

  deleteListing(id: string): boolean {
    return this.listings.delete(id);
  }

  // --- Messages & Conversations ---
  getMessagesByListing(listingId: string): MessageRecord[] {
    return this.messages
      .filter((m) => m.listingId === listingId)
      .sort((a, b) => a.timestampMs - b.timestampMs);
  }

  getConversationsForUser(userId: string): {
    listing: ListingRecord;
    partner: UserRecord;
    lastMessage: MessageRecord;
    unreadCount: number;
  }[] {
    const conversationMap = new Map<string, MessageRecord[]>();

    for (const msg of this.messages) {
      if (msg.senderId === userId || msg.receiverId === userId) {
        const key = msg.listingId;
        const list = conversationMap.get(key) || [];
        list.push(msg);
        conversationMap.set(key, list);
      }
    }

    const conversations: {
      listing: ListingRecord;
      partner: UserRecord;
      lastMessage: MessageRecord;
      unreadCount: number;
    }[] = [];

    for (const [listingId, msgs] of conversationMap.entries()) {
      const listing = this.listings.get(listingId);
      if (!listing) continue;

      msgs.sort((a, b) => a.timestampMs - b.timestampMs);
      const lastMessage = msgs[msgs.length - 1];

      const partnerId = lastMessage.senderId === userId ? lastMessage.receiverId : lastMessage.senderId;
      const partner = this.users.get(partnerId) || {
        id: partnerId,
        name: 'Campus Student',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        department: 'General',
        year: 'Student',
        email: '',
        college: 'State University',
        bio: '',
        karma: 100,
        tradesCompleted: 1,
        ratingAvg: 5.0,
        reviewsCount: 1,
        badges: [],
        joinedDate: '2024',
      };

      const unreadCount = msgs.filter((m) => m.receiverId === userId && !m.isRead).length;

      conversations.push({
        listing,
        partner,
        lastMessage,
        unreadCount,
      });
    }

    return conversations.sort((a, b) => b.lastMessage.timestampMs - a.lastMessage.timestampMs);
  }

  createMessage(data: Omit<MessageRecord, 'id' | 'timestamp' | 'timestampMs' | 'isRead'>): MessageRecord {
    const id = `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg: MessageRecord = {
      ...data,
      id,
      timestamp: `Today at ${timeStr}`,
      timestampMs: Date.now(),
      isRead: false,
    };

    this.messages.push(newMsg);

    const sender = this.users.get(data.senderId);
    const senderName = sender ? sender.name : 'A student';
    const listing = this.listings.get(data.listingId);
    const listingTitle = listing ? listing.title : 'a listing';

    // Notify receiver
    this.addNotification({
      userId: data.receiverId,
      title: `New message from ${senderName}`,
      message: `"${data.content.length > 50 ? data.content.substring(0, 50) + '...' : data.content}" regarding ${listingTitle}`,
      type: 'message',
      link: 'messages',
    });

    // Small karma bonus for active community communication
    this.awardKarma(data.senderId, 5, `Sent inquiry for "${listingTitle}"`);

    return newMsg;
  }

  // --- Saved Listings ---
  getSavedListings(userId: string): ListingRecord[] {
    const saved = this.savedListings.filter((s) => s.userId === userId);
    const results: ListingRecord[] = [];
    for (const s of saved) {
      const listing = this.listings.get(s.listingId);
      if (listing) results.push(listing);
    }
    return results;
  }

  saveListing(userId: string, listingId: string): boolean {
    const existing = this.savedListings.find((s) => s.userId === userId && s.listingId === listingId);
    if (existing) return true;
    this.savedListings.push({
      id: `save-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId,
      listingId,
      savedAt: new Date().toISOString(),
    });
    return true;
  }

  removeSavedListing(userId: string, listingId: string): boolean {
    const idx = this.savedListings.findIndex((s) => s.userId === userId && s.listingId === listingId);
    if (idx !== -1) {
      this.savedListings.splice(idx, 1);
      return true;
    }
    return false;
  }

  // --- Reviews ---
  getReviewsForUser(userId: string): ReviewRecord[] {
    return this.reviews
      .filter((r) => r.revieweeId === userId)
      .sort((a, b) => b.createdAtTimestamp - a.createdAtTimestamp);
  }

  createReview(data: Omit<ReviewRecord, 'id' | 'createdAt' | 'createdAtTimestamp'>): ReviewRecord {
    const id = `rev-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newRev: ReviewRecord = {
      ...data,
      id,
      createdAt: 'Just now',
      createdAtTimestamp: Date.now(),
    };

    this.reviews.push(newRev);

    // Recalculate reviewee average
    const userReviews = this.reviews.filter((r) => r.revieweeId === data.revieweeId);
    const totalRating = userReviews.reduce((sum, r) => sum + r.rating, 0);
    const avg = Number((totalRating / userReviews.length).toFixed(1));

    const reviewee = this.users.get(data.revieweeId);
    if (reviewee) {
      reviewee.ratingAvg = avg;
      reviewee.reviewsCount = userReviews.length;
      this.users.set(data.revieweeId, reviewee);

      // Award karma to both
      this.awardKarma(data.reviewerId, 15, 'Left a peer review');
      if (data.rating >= 4) {
        this.awardKarma(data.revieweeId, 30, `Received a ${data.rating}-star review from ${data.reviewerName}`);
      }
    }

    return newRev;
  }

  // --- Notifications ---
  getNotifications(userId: string): NotificationRecord[] {
    return this.notifications
      .filter((n) => n.userId === userId)
      .sort((a, b) => b.createdAtTimestamp - a.createdAtTimestamp);
  }

  addNotification(data: Omit<NotificationRecord, 'id' | 'isRead' | 'createdAt' | 'createdAtTimestamp'>): NotificationRecord {
    const id = `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const notif: NotificationRecord = {
      ...data,
      id,
      isRead: false,
      createdAt: 'Just now',
      createdAtTimestamp: Date.now(),
    };
    this.notifications.unshift(notif);
    return notif;
  }

  markNotificationRead(id: string): boolean {
    const notif = this.notifications.find((n) => n.id === id);
    if (notif) {
      notif.isRead = true;
      return true;
    }
    return false;
  }

  markAllNotificationsRead(userId: string): boolean {
    for (const n of this.notifications) {
      if (n.userId === userId) {
        n.isRead = true;
      }
    }
    return true;
  }

  // --- Analytics ---
  getCommunityAnalytics() {
    const listings = Array.from(this.listings.values());
    const users = Array.from(this.users.values());

    const categoryCounts: Record<string, number> = {
      Resources: 0,
      Services: 0,
      Opportunities: 0,
    };

    for (const l of listings) {
      if (categoryCounts[l.category] !== undefined) {
        categoryCounts[l.category]++;
      }
    }

    const topContributors = [...users]
      .sort((a, b) => b.karma - a.karma)
      .slice(0, 5)
      .map((u) => ({
        id: u.id,
        name: u.name,
        avatar: u.avatar,
        department: u.department,
        year: u.year,
        karma: u.karma,
        tradesCompleted: u.tradesCompleted,
        ratingAvg: u.ratingAvg,
      }));

    const totalTrades = users.reduce((sum, u) => sum + (u.tradesCompleted || 0), 0);

    return {
      totalListings: listings.length,
      totalStudents: users.length,
      totalTradesCompleted: totalTrades,
      categoryCounts,
      topContributors,
      activityTimeline: [
        { day: 'Mon', listings: 12, exchanges: 4 },
        { day: 'Tue', listings: 19, exchanges: 7 },
        { day: 'Wed', listings: 15, exchanges: 6 },
        { day: 'Thu', listings: 24, exchanges: 11 },
        { day: 'Fri', listings: 31, exchanges: 15 },
        { day: 'Sat', listings: 22, exchanges: 10 },
        { day: 'Sun', listings: 18, exchanges: 8 },
      ],
    };
  }
}

export const db = new Database();
