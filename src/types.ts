export type CategoryType = 'Resources' | 'Services' | 'Opportunities';

export type PriceType = 'fixed' | 'free' | 'exchange' | 'negotiable';

export interface Seller {
  id: string;
  name: string;
  avatar: string;
  college?: string;
  year?: string;
  department?: string;
  rating: number;
  reviewsCount: number;
  verified: boolean;
  isCurrentUser?: boolean;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  category: CategoryType;
  subcategory: string;
  price: number; // 0 for free
  priceType: PriceType;
  priceUnit?: string; // e.g. "/hr"
  originalPrice?: number;
  imageUrl: string;
  additionalImages?: string[];
  tags: string[];
  condition?: string;
  features?: string[];
  seller: Seller;
  createdAt: string;
  isSaved?: boolean;
  status: 'active' | 'sold' | 'exchanged';
  hotBadge?: string; // e.g. "Hot", "New", "Almost Gone"
}

export interface ChatMessage {
  id: string;
  senderId: 'me' | string;
  senderName: string;
  text: string;
  timestamp: string;
}

export interface ListingContext {
  id: string;
  title: string;
  price: string;
  imageUrl: string;
  listedTime: string;
}

export interface Conversation {
  id: string;
  participant: {
    id: string;
    name: string;
    avatar: string;
    online: boolean;
    department?: string;
  };
  lastMessage: string;
  lastMessageTime: string;
  unreadCount?: number;
  listingContext?: ListingContext;
  messages: ChatMessage[];
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  bgColor: string;
  iconColor: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  college: string;
  year: string;
  department: string;
  bio: string;
  rating: number;
  reviewsCount: number;
  karmaPoints: number;
  tradesCompleted?: number;
  rank: string;
  verified: boolean;
  isCurrentUser?: boolean;
  badges: Badge[];
}

export type ScreenView =
  | 'landing'
  | 'feed'
  | 'listing_detail'
  | 'create'
  | 'dashboard'
  | 'profile'
  | 'messages'
  | 'auth';
