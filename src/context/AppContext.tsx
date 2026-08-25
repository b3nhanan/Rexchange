import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Listing,
  UserProfile,
  Conversation,
  ScreenView,
  CategoryType,
  ChatMessage,
} from '../types';
import { CURRENT_USER, INITIAL_LISTINGS, INITIAL_CONVERSATIONS } from '../data/mockData';
import { api } from '../lib/api';

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
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  isAuthModalOpen: boolean;
  authMode: 'login' | 'signup';
  openAuth: (mode?: 'login' | 'signup') => void;
  closeAuth: () => void;
  navigateTo: (screen: ScreenView, listingId?: string) => void;
  notificationCount: number;
  clearNotifications: () => void;
  reloadListings: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenView>('landing');
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
  const [selectedConversationId, setSelectedConversationId] = useState<string>('conv-sarah');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'All'>('All');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(500);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high' | 'popular'>('newest');

  // Stored state with local fallback & initial sync
  const [listings, setListings] = useState<Listing[]>(() => {
    const saved = localStorage.getItem('rexchange_listings');
    return saved ? JSON.parse(saved) : INITIAL_LISTINGS;
  });

  const [savedListingIds, setSavedListingIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('rexchange_saved_ids');
    return saved ? JSON.parse(saved) : ['listing-1', 'listing-3'];
  });

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('rexchange_conversations');
    return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
  });

  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('rexchange_user');
    return saved ? JSON.parse(saved) : CURRENT_USER;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [notificationCount, setNotificationCount] = useState(3);

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
            isCurrentUser: l.sellerId === user.id,
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
  }, [user.id]);

  useEffect(() => {
    reloadListings();
  }, [reloadListings]);

  // Sync user profile & notifications on start
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const meRes = await api.auth.getMe();
        if (meRes?.user) {
          const u = meRes.user;
          setUser((prev) => ({
            ...prev,
            id: u.id,
            name: u.name,
            email: u.email,
            college: u.college,
            department: u.department,
            year: u.year,
            bio: u.bio,
            karmaPoints: u.karma || prev.karmaPoints,
            rating: u.ratingAvg || prev.rating,
            reviewsCount: u.reviewsCount || prev.reviewsCount,
            avatar: u.avatar || prev.avatar,
          }));
        }

        const notifRes = await api.notifications.get(user.id);
        if (notifRes && notifRes.unreadCount !== undefined) {
          setNotificationCount(notifRes.unreadCount);
        }
      } catch {
        // Fallback silently
      }
    };
    fetchUserData();
  }, [user.id]);

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
    localStorage.setItem('rexchange_user', JSON.stringify(user));
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
    setUser((prev) => ({
      ...prev,
      karmaPoints: prev.karmaPoints + 50,
    }));

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

  const clearNotifications = async () => {
    setNotificationCount(0);
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
        isAuthModalOpen,
        authMode,
        openAuth,
        closeAuth,
        navigateTo,
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
