import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Listing,
  UserProfile,
  Conversation,
  ScreenView,
  CategoryType,
  ChatMessage,
} from '../types';
import { INITIAL_LISTINGS, INITIAL_CONVERSATIONS } from '../data/mockData';
import { api } from '../lib/api';

export interface AppNotificationItem {
  id: string;
  userId?: string;
  title: string;
  message: string;
  type?: 'message' | 'trade' | 'karma' | 'badge' | 'system';
  link?: string;
  isRead?: boolean;
  createdAt?: string;
}

interface AppContextType {
  currentScreen: ScreenView;
  setCurrentScreen: (screen: ScreenView) => void;
  selectedListing: Listing | null;
  selectedListingId: string | null;
  activeListingId: string | null;
  setSelectedListingId: (id: string | null) => void;
  selectedConversationId: string;
  setSelectedConversationId: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: CategoryType | 'All';
  setSelectedCategory: (cat: CategoryType | 'All') => void;
  selectedSubcategory: string | null;
  setSelectedSubcategory: (subcat: string | null) => void;
  selectedSubcategories: string[];
  toggleSubcategory: (subcat: string) => void;
  maxPrice: number;
  setMaxPrice: (price: number) => void;
  selectedTags: string[];
  toggleTag: (tag: string) => void;
  sortBy: 'newest' | 'price-low' | 'price-high' | 'popular';
  setSortBy: (sort: 'newest' | 'price-low' | 'price-high' | 'popular') => void;
  listings: Listing[];
  filteredListings: Listing[];
  savedListingIds: string[];
  toggleSaveListing: (id: string) => void;
  addNewListing: (listingData: Partial<Listing>) => Promise<Listing>;
  updateListingStatus: (id: string, status: 'active' | 'sold' | 'exchanged') => Promise<void>;
  deleteListing: (id: string) => Promise<void>;
  conversations: Conversation[];
  sendMessage: (conversationId: string, text: string) => Promise<void>;
  startConversationWithListing: (listing: Listing) => void;
  user: UserProfile | null;
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  logout: () => Promise<void>;
  isAuthModalOpen: boolean;
  authMode: 'login' | 'signup';
  openAuth: (mode?: 'login' | 'signup') => void;
  closeAuth: () => void;
  navigateTo: (screen: ScreenView, listingId?: string) => void;
  notifications: AppNotificationItem[];
  notificationCount: number;
  clearNotifications: () => void;
  reloadListings: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenView>('landing');
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
  const [selectedConversationId, setSelectedConversationId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'All'>('All');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(5000);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high' | 'popular'>('newest');

  // Stored state with local fallback & initial sync
  const [listings, setListings] = useState<Listing[]>(() => {
    const saved = localStorage.getItem('rexchange_listings');
    return saved ? JSON.parse(saved) : INITIAL_LISTINGS;
  });

  const [savedListingIds, setSavedListingIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('rexchange_saved_ids');
    return saved ? JSON.parse(saved) : [];
  });

  // Empty conversations by default for clean initial experience
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('rexchange_conversations');
    return saved ? JSON.parse(saved) : [];
  });

  // No placeholder user by default on fresh visit
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('rexchange_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [notifications, setNotifications] = useState<AppNotificationItem[]>([]);
  const [notificationCount, setNotificationCount] = useState(0);

  // Initial backend load
  const reloadListings = useCallback(async () => {
    try {
      const data = await api.listings.getAll();
      if (data?.listings && data.listings.length > 0) {
        // Map backend listing records to UI shape if needed
        const mappedListings: Listing[] = data.listings.map((l: any) => ({
          id: l.id,
          title: l.title,
          description: l.description,
          category: l.category,
          subcategory: l.subcategory,
          price: l.price,
          priceType: l.price === 0 ? 'free' : 'fixed',
          priceUnit: l.priceUnit || '',
          imageUrl: l.imageUrl,
          tags: l.tags || [],
          condition: l.condition || 'Good',
          features: l.features || [],
          seller: {
            id: l.seller?.id || l.sellerId || 'user-1',
            name: l.seller?.name || 'Campus Student',
            avatar: l.seller?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            college: l.seller?.college || 'State University',
            year: l.seller?.year || 'Senior',
            department: l.seller?.department || 'Computer Science',
            rating: l.seller?.rating || 4.9,
            reviewsCount: l.seller?.tradesCompleted || 10,
            verified: true,
            isCurrentUser: user ? (l.sellerId === user.id) : false,
          },
          createdAt: l.createdAt || 'Recently',
          status: l.status || 'active',
          hotBadge: l.views > 50 ? 'Hot' : 'New',
        }));
        setListings(mappedListings);
      }
    } catch (e) {
      console.warn('Could not sync listings from backend API, using cached state', e);
    }
  }, [user?.id]);

  useEffect(() => {
    reloadListings();
  }, [reloadListings]);

  // Sync user profile & notifications on start if token exists
  useEffect(() => {
    const token = localStorage.getItem('rexchange_auth_token');
    if (!token) return;

    const fetchUserData = async () => {
      try {
        const meRes = await api.auth.getMe();
        if (meRes?.user) {
          const u = meRes.user;
          setUser({
            id: u.id,
            name: u.name,
            email: u.email,
            college: u.college || 'State University',
            department: u.department || 'General Studies',
            year: u.year || 'Freshman',
            bio: u.bio || '',
            avatar: u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
            karmaPoints: u.karma ?? 0,
            rating: u.ratingAvg ?? 0,
            reviewsCount: u.reviewsCount ?? 0,
            tradesCompleted: u.tradesCompleted ?? 0,
            rank: (u.tradesCompleted ?? 0) > 10 ? 'Top Trader' : (u.tradesCompleted ?? 0) > 0 ? 'Active Trader' : 'New Member',
            verified: true,
            isCurrentUser: true,
            badges: u.badges || [],
          });

          const notifRes = await api.notifications.get(u.id);
          if (notifRes && notifRes.notifications) {
            setNotifications(notifRes.notifications);
            setNotificationCount(notifRes.unreadCount || 0);
          } else {
            setNotifications([]);
            setNotificationCount(0);
          }
        }
      } catch {
        // Token might be invalid or expired
        localStorage.removeItem('rexchange_auth_token');
        localStorage.removeItem('rexchange_user');
        setUser(null);
      }
    };
    fetchUserData();
  }, []);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('rexchange_listings', JSON.stringify(listings));
  }, [listings]);

  useEffect(() => {
    localStorage.setItem('rexchange_saved_ids', JSON.stringify(savedListingIds));
  }, [savedListingIds]);

  useEffect(() => {
    localStorage.setItem('rexchange_conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('rexchange_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('rexchange_user');
    }
  }, [user]);

  const selectedListing = listings.find((l) => l.id === selectedListingId) || null;

  // Filtered listings based on search, category, subcategory, tags, etc.
  const filteredListings = listings.filter((item) => {
    if (selectedCategory !== 'All' && item.category !== selectedCategory) {
      return false;
    }
    if (selectedSubcategory && item.subcategory !== selectedSubcategory) {
      return false;
    }
    if (selectedSubcategories.length > 0 && !selectedSubcategories.includes(item.subcategory)) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchSub = item.subcategory?.toLowerCase().includes(q);
      const matchTags = item.tags?.some((t) => t.toLowerCase().includes(q));
      const matchSeller = item.seller?.name?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchSub && !matchTags && !matchSeller) {
        return false;
      }
    }
    if (selectedTags.length > 0) {
      const hasTag = selectedTags.some((t) => item.tags?.includes(t));
      if (!hasTag) return false;
    }
    if (item.price > maxPrice) {
      return false;
    }
    return true;
  });

  const navigateTo = (screen: ScreenView, listingId?: string) => {
    if (listingId) {
      setSelectedListingId(listingId);
    }
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleSubcategory = (subcat: string) => {
    setSelectedSubcategories((prev) =>
      prev.includes(subcat) ? prev.filter((s) => s !== subcat) : [...prev, subcat]
    );
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const toggleSaveListing = async (id: string) => {
    if (!user) {
      openAuth('login');
      return;
    }

    const isSaved = savedListingIds.includes(id);
    const newSaved = isSaved ? savedListingIds.filter((s) => s !== id) : [...savedListingIds, id];
    setSavedListingIds(newSaved);

    try {
      if (isSaved) {
        await api.saved.remove(user.id, id);
      } else {
        await api.saved.save(user.id, id);
      }
    } catch {
      // Keep local state intact
    }
  };

  const addNewListing = async (listingData: Partial<Listing>): Promise<Listing> => {
    if (!user) {
      openAuth('login');
      throw new Error('Please sign in to list items on the marketplace.');
    }

    const newListing: Listing = {
      id: `listing-${Date.now()}`,
      title: listingData.title || 'Untitled Listing',
      description: listingData.description || '',
      category: listingData.category || 'Resources',
      subcategory: listingData.subcategory || 'General',
      price: listingData.price ?? 0,
      priceType: listingData.priceType || (listingData.price === 0 ? 'free' : 'fixed'),
      priceUnit: listingData.priceUnit || '',
      imageUrl:
        listingData.imageUrl ||
        'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=600&q=80',
      additionalImages: listingData.additionalImages || [],
      tags: listingData.tags || ['#campus', '#exchange'],
      condition: listingData.condition || 'Good',
      features: listingData.features || [],
      seller: {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        college: user.college,
        year: user.year,
        department: user.department,
        rating: user.rating,
        reviewsCount: user.reviewsCount,
        verified: true,
        isCurrentUser: true,
      },
      createdAt: 'Just now',
      status: 'active',
      hotBadge: 'New',
    };

    setListings((prev) => [newListing, ...prev]);
    setUser((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        karmaPoints: (prev.karmaPoints || 0) + 50,
      };
    });

    try {
      const res = await api.listings.create({
        title: newListing.title,
        description: newListing.description,
        category: newListing.category,
        subcategory: newListing.subcategory,
        price: newListing.price,
        priceUnit: newListing.priceUnit,
        condition: newListing.condition,
        imageUrl: newListing.imageUrl,
        tags: newListing.tags,
        sellerId: user.id,
      });

      if (res?.listing?.id) {
        newListing.id = res.listing.id;
      }
    } catch (e) {
      console.warn('Backend listing save failed, retained in local memory', e);
    }

    return newListing;
  };

  const updateListingStatus = async (id: string, status: 'active' | 'sold' | 'exchanged') => {
    setListings((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status } : l))
    );
    try {
      await api.listings.update(id, { status });
    } catch {
      // Retain local state
    }
  };

  const deleteListing = async (id: string) => {
    setListings((prev) => prev.filter((l) => l.id !== id));
    try {
      await api.listings.delete(id);
    } catch {
      // Retain local state
    }
  };

  const sendMessage = async (conversationId: string, text: string) => {
    if (!text.trim()) return;
    if (!user) {
      openAuth('login');
      return;
    }

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'me',
      senderName: user.name,
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          return {
            ...c,
            lastMessage: text.trim(),
            lastMessageTime: 'Just now',
            messages: [...c.messages, newMsg],
          };
        }
        return c;
      })
    );

    const targetConv = conversations.find((c) => c.id === conversationId);

    // Call backend API if possible
    if (targetConv) {
      try {
        await api.messages.send({
          listingId: targetConv.listingContext?.id || targetConv.id,
          senderId: user.id,
          receiverId: targetConv.participant.id,
          content: text.trim(),
        });
      } catch {
        // Fall back gracefully
      }
    }

    // Realistic reply simulation
    if (targetConv && targetConv.participant.online) {
      setTimeout(() => {
        const replyText =
          targetConv.participant.name === 'Sarah Jenkins'
            ? "Sounds good! I'll be by the 2nd floor library study carrels in 15 mins."
            : targetConv.participant.name === 'Marcus Chen'
            ? 'Awesome, yeah I can meet you right outside the CS building near the patio.'
            : 'Great! Let me know when you arrive on campus.';

        const replyMsg: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          senderId: targetConv.participant.id,
          senderName: targetConv.participant.name,
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setConversations((prevConversations) =>
          prevConversations.map((c) => {
            if (c.id === conversationId) {
              return {
                ...c,
                lastMessage: replyText,
                lastMessageTime: 'Just now',
                messages: [...c.messages, replyMsg],
              };
            }
            return c;
          })
        );
      }, 1400);
    }
  };

  const startConversationWithListing = (listing: Listing) => {
    if (!user) {
      openAuth('login');
      return;
    }

    const existing = conversations.find(
      (c) => c.participant.id === listing.seller.id || c.listingContext?.id === listing.id
    );

    if (existing) {
      setSelectedConversationId(existing.id);
      setCurrentScreen('messages');
      return;
    }

    const newConv: Conversation = {
      id: `conv-${Date.now()}`,
      participant: {
        id: listing.seller.id,
        name: listing.seller.name,
        avatar: listing.seller.avatar,
        online: true,
        department: listing.seller.department,
      },
      lastMessage: `Hi ${listing.seller.name}, is "${listing.title}" still available?`,
      lastMessageTime: 'Just now',
      unreadCount: 0,
      listingContext: {
        id: listing.id,
        title: listing.title,
        price: listing.price === 0 ? 'Free' : `₹${listing.price.toLocaleString('en-IN')}${listing.priceUnit || ''}`,
        imageUrl: listing.imageUrl,
        listedTime: `Listed ${listing.createdAt}`,
      },
      messages: [
        {
          id: `msg-${Date.now()}`,
          senderId: 'me',
          senderName: user.name,
          text: `Hi ${listing.seller.name}, is "${listing.title}" still available? I'm interested in picking it up!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    };

    setConversations((prev) => [newConv, ...prev]);
    setSelectedConversationId(newConv.id);
    setCurrentScreen('messages');
  };

  const openAuth = (mode: 'login' | 'signup' = 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuth = () => {
    setIsAuthModalOpen(false);
  };

  const logout = async () => {
    try {
      await api.auth.logout();
    } catch {
      // Ignored
    }
    localStorage.removeItem('rexchange_user');
    localStorage.removeItem('rexchange_auth_token');
    localStorage.removeItem('rexchange_conversations');
    localStorage.removeItem('rexchange_saved_ids');
    setUser(null);
    setConversations([]);
    setNotifications([]);
    setNotificationCount(0);
    setSavedListingIds([]);
    navigateTo('landing');
  };

  const clearNotifications = async () => {
    setNotificationCount(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    if (!user) return;
    try {
      await api.notifications.markAllRead(user.id);
    } catch {
      // Ignored
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        selectedListing,
        selectedListingId,
        activeListingId: selectedListingId,
        setSelectedListingId,
        selectedConversationId,
        setSelectedConversationId,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedSubcategory,
        setSelectedSubcategory,
        selectedSubcategories,
        toggleSubcategory,
        maxPrice,
        setMaxPrice,
        selectedTags,
        toggleTag,
        sortBy,
        setSortBy,
        listings,
        filteredListings,
        savedListingIds,
        toggleSaveListing,
        addNewListing,
        updateListingStatus,
        deleteListing,
        conversations,
        sendMessage,
        startConversationWithListing,
        user,
        setUser,
        logout,
        isAuthModalOpen,
        authMode,
        openAuth,
        closeAuth,
        navigateTo,
        notifications,
        notificationCount,
        clearNotifications,
        reloadListings,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
