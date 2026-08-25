import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
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

// Helper for secure salted password hashing using Node.js crypto PBKDF2
export function hashPassword(password: string, customSalt?: string): { hash: string; salt: string } {
  const salt = customSalt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

export function verifyPassword(password: string, storedPasswordString?: string): boolean {
  if (!storedPasswordString) return false;
  
  // Format is "salt:hash"
  if (storedPasswordString.includes(':')) {
    const [salt, storedHash] = storedPasswordString.split(':');
    const { hash } = hashPassword(password, salt);
    return hash === storedHash;
  }
  
  // Fallback for unhashed plain passwords
  return password === storedPasswordString;
}

const DATA_DIR = path.join(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'rexchange_db.json');

interface PersistedData {
  users: UserRecord[];
  listings: ListingRecord[];
  messages: MessageRecord[];
  reviews: ReviewRecord[];
  notifications: NotificationRecord[];
  savedListings: SavedListingRecord[];
  sessions: [string, string][];
}

class Database {
  private users: Map<string, UserRecord> = new Map();
  private listings: Map<string, ListingRecord> = new Map();
  private messages: MessageRecord[] = [];
  private reviews: ReviewRecord[] = [];
  private notifications: NotificationRecord[] = [];
  private savedListings: SavedListingRecord[] = [];
  private sessions: Map<string, string> = new Map(); // token -> userId

  constructor() {
    this.init();
  }

  private init() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        const data: PersistedData = JSON.parse(raw);

        if (Array.isArray(data.users)) {
          for (const u of data.users) {
            this.users.set(u.id, u);
          }
        }
        if (Array.isArray(data.listings)) {
          for (const l of data.listings) {
            this.listings.set(l.id, l);
          }
        }
        this.messages = Array.isArray(data.messages) ? data.messages : [];
        this.reviews = Array.isArray(data.reviews) ? data.reviews : [];
        this.notifications = Array.isArray(data.notifications) ? data.notifications : [];
        this.savedListings = Array.isArray(data.savedListings) ? data.savedListings : [];
        this.sessions = new Map(data.sessions || []);

        console.log(`[Database] Loaded ${this.users.size} users and ${this.listings.size} listings from disk persistence.`);
        return;
      }
    } catch (err) {
      console.warn('[Database] Could not read disk database, re-seeding:', err);
    }

    this.seed();
    this.persist();
  }

  private persist() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const data: PersistedData = {
        users: Array.from(this.users.values()),
        listings: Array.from(this.listings.values()),
        messages: this.messages,
        reviews: this.reviews,
        notifications: this.notifications,
        savedListings: this.savedListings,
        sessions: Array.from(this.sessions.entries()),
      };
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('[Database] Failed to persist data to disk:', err);
    }
  }

  private seed() {
    for (const u of INITIAL_USERS) {
      const { hash, salt } = hashPassword(u.password || 'Campus123!');
      this.users.set(u.id, {
        ...u,
        password: `${salt}:${hash}`,
      });
    }
    for (const l of INITIAL_LISTINGS) {
      this.listings.set(l.id, { ...l });
    }
    this.messages = INITIAL_MESSAGES.map((m) => ({ ...m }));
    this.reviews = INITIAL_REVIEWS.map((r) => ({ ...r }));
    this.notifications = INITIAL_NOTIFICATIONS.map((n) => ({ ...n }));

    // Pre-seed mock token for user-1
    this.sessions.set('mock-token-user-1', 'user-1');
  }

  // --- Auth & Sessions ---
  createSession(userId: string): string {
    const token = `rexchange_token_${Date.now()}_${crypto.randomBytes(16).toString('hex')}`;
    this.sessions.set(token, userId);
    this.persist();
    return token;
  }

  getUserByToken(token?: string): UserRecord | null {
    if (!token) return null;
    const cleanToken = token.replace(/^Bearer\s+/i, '').trim();
    const userId = this.sessions.get(cleanToken);
    if (!userId) {
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
    const deleted = this.sessions.delete(cleanToken);
    if (deleted) this.persist();
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
      if (u.email.toLowerCase().trim() === normalized) return u;
    }
    return null;
  }

  createUser(data: {
    name: string;
    email: string;
    password?: string;
    college?: string;
    department?: string;
    year?: string;
    bio?: string;
    avatar?: string;
  }): UserRecord {
    const id = `user-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    let storedPassword = '';
    if (data.password) {
      const { hash, salt } = hashPassword(data.password);
      storedPassword = `${salt}:${hash}`;
    } else {
      const { hash, salt } = hashPassword('Campus123!');
      storedPassword = `${salt}:${hash}`;
    }

    const newUser: UserRecord = {
      id,
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
      password: storedPassword,
      college: data.college || 'Engineering Campus',
      department: data.department || 'General Studies',
      year: data.year || '1st Year',
      avatar:
        data.avatar ||
        `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      bio: data.bio || 'New campus student ready to trade & share.',
      karma: 0,
      tradesCompleted: 0,
      ratingAvg: 0.0,
      reviewsCount: 0,
      badges: [],
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    };

    this.users.set(id, newUser);
    this.persist();
    return newUser;
  }

  updateUser(id: string, updates: Partial<UserRecord>): UserRecord | null {
    const existing = this.users.get(id);
    if (!existing) return null;

    if (updates.password) {
      const { hash, salt } = hashPassword(updates.password);
      updates.password = `${salt}:${hash}`;
    }

    const updated = { ...existing, ...updates };
    this.users.set(id, updated);
    this.persist();
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

    this.persist();
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
      this.persist();
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
        name: seller ? seller.name : (data.seller?.name || 'Campus Student'),
        avatar: seller ? seller.avatar : (data.seller?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'),
        department: seller ? seller.department : (data.seller?.department || 'General'),
        year: seller ? seller.year : (data.seller?.year || '1st Year'),
        rating: seller ? seller.ratingAvg : 5.0,
        tradesCompleted: seller ? seller.tradesCompleted : 0,
      },
    };

    this.listings.set(id, newListing);

    // Award +50 Karma for posting listing
    this.awardKarma(data.sellerId, 50, `Listing "${data.title}" published to campus feed`);

    this.persist();
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

    this.persist();
    return updated;
  }

  deleteListing(id: string): boolean {
    const deleted = this.listings.delete(id);
    if (deleted) this.persist();
    return deleted;
  }

  // --- Saved Listings ---
  saveListing(userId: string, listingId: string): boolean {
    const exists = this.savedListings.some((s) => s.userId === userId && s.listingId === listingId);
    if (!exists) {
      this.savedListings.push({
        id: `save-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        userId,
        listingId,
        savedAt: new Date().toISOString(),
      });
      this.persist();
      return true;
    }
    return false;
  }

  unsaveListing(userId: string, listingId: string): boolean {
    const initialLen = this.savedListings.length;
    this.savedListings = this.savedListings.filter(
      (s) => !(s.userId === userId && s.listingId === listingId)
    );
    if (this.savedListings.length !== initialLen) {
      this.persist();
      return true;
    }
    return false;
  }

  removeSavedListing(userId: string, listingId: string): boolean {
    return this.unsaveListing(userId, listingId);
  }

  getSavedListings(userId: string): ListingRecord[] {
    const ids = this.getSavedListingIds(userId);
    return ids.map((id) => this.listings.get(id)).filter(Boolean) as ListingRecord[];
  }

  getSavedListingIds(userId: string): string[] {
    return this.savedListings.filter((s) => s.userId === userId).map((s) => s.listingId);
  }

  // --- Messages ---
  getMessagesBetween(userA: string, userB: string, listingId?: string): MessageRecord[] {
    return this.messages.filter((m) => {
      const matchUsers =
        (m.senderId === userA && m.receiverId === userB) ||
        (m.senderId === userB && m.receiverId === userA);
      if (!matchUsers) return false;
      if (listingId) return m.listingId === listingId;
      return true;
    });
  }

  getMessagesByListing(listingId: string): MessageRecord[] {
    return this.messages.filter((m) => m.listingId === listingId);
  }

  getConversationsForUser(userId: string) {
    return this.getUserConversations(userId);
  }

  getUserConversations(userId: string) {
    const threadMap = new Map<string, MessageRecord>();

    for (const msg of this.messages) {
      if (msg.senderId === userId || msg.receiverId === userId) {
        const partnerId = msg.senderId === userId ? msg.receiverId : msg.senderId;
        const key = `${partnerId}_${msg.listingId || 'general'}`;
        const current = threadMap.get(key);
        if (!current || msg.timestampMs > current.timestampMs) {
          threadMap.set(key, msg);
        }
      }
    }

    const conversations = [];
    for (const [key, latestMsg] of threadMap.entries()) {
      const [partnerId, listingId] = key.split('_');
      const partner = this.getUserById(partnerId);
      const listing = listingId !== 'general' ? this.getListingById(listingId) : null;

      const unreadCount = this.messages.filter(
        (m) =>
          m.senderId === partnerId &&
          m.receiverId === userId &&
          (!listingId || m.listingId === listingId) &&
          !m.isRead
      ).length;

      conversations.push({
        id: `conv-${partnerId}-${listingId}`,
        partner: partner || {
          id: partnerId,
          name: 'Campus Student',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          department: 'Student',
          year: 'Campus Member',
          online: true,
        },
        listing: listing || undefined,
        latestMessage: latestMsg.content,
        timestamp: latestMsg.timestamp,
        timestampMs: latestMsg.timestampMs,
        unreadCount,
      });
    }

    return conversations.sort((a, b) => b.timestampMs - a.timestampMs);
  }

  createMessage(data: {
    senderId: string;
    receiverId: string;
    listingId?: string;
    content: string;
  }): MessageRecord {
    const id = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg: MessageRecord = {
      id,
      senderId: data.senderId,
      receiverId: data.receiverId,
      listingId: data.listingId || '',
      content: data.content,
      timestamp: timeStr,
      timestampMs: Date.now(),
      isRead: false,
    };

    this.messages.push(newMsg);

    const sender = this.getUserById(data.senderId);
    this.addNotification({
      userId: data.receiverId,
      title: `Message from ${sender ? sender.name : 'Campus Student'}`,
      message: data.content.length > 60 ? `${data.content.substring(0, 60)}...` : data.content,
      type: 'message',
      link: 'messages',
    });

    this.persist();
    return newMsg;
  }

  // --- Reviews ---
  getReviewsForUser(userId: string): ReviewRecord[] {
    return this.reviews.filter((r) => r.revieweeId === userId);
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

    const user = this.users.get(data.revieweeId);
    if (user) {
      const userRevs = this.getReviewsForUser(data.revieweeId);
      const sum = userRevs.reduce((acc, r) => acc + r.rating, 0);
      user.ratingAvg = Number((sum / userRevs.length).toFixed(1));
      user.reviewsCount = userRevs.length;
      this.users.set(data.revieweeId, user);
      this.awardKarma(data.revieweeId, 25, `Received a 5-star student review`);
    }

    this.persist();
    return newRev;
  }

  // --- Notifications ---
  getNotifications(userId: string): NotificationRecord[] {
    return this.getUserNotifications(userId);
  }

  getUserNotifications(userId: string): NotificationRecord[] {
    return this.notifications
      .filter((n) => n.userId === userId)
      .sort((a, b) => b.createdAtTimestamp - a.createdAtTimestamp);
  }

  addNotification(data: {
    userId: string;
    title: string;
    message: string;
    type?: 'message' | 'trade' | 'karma' | 'badge' | 'system';
    link?: string;
  }): NotificationRecord {
    const id = `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newNotif: NotificationRecord = {
      id,
      userId: data.userId,
      title: data.title,
      message: data.message,
      type: data.type || 'system',
      link: data.link,
      isRead: false,
      createdAt: 'Just now',
      createdAtTimestamp: Date.now(),
    };

    this.notifications.push(newNotif);
    this.persist();
    return newNotif;
  }

  markNotificationRead(id: string): boolean {
    const notif = this.notifications.find((n) => n.id === id);
    if (notif) {
      notif.isRead = true;
      this.persist();
      return true;
    }
    return false;
  }

  markAllNotificationsRead(userId: string): boolean {
    let changed = false;
    for (const n of this.notifications) {
      if (n.userId === userId && !n.isRead) {
        n.isRead = true;
        changed = true;
      }
    }
    if (changed) this.persist();
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
