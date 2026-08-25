import { Listing, UserProfile, CategoryType, Conversation, ChatMessage } from '../types';

const API_BASE = '/api';

function getAuthToken(): string | null {
  return localStorage.getItem('rexchange_auth_token');
}

function setAuthToken(token: string) {
  localStorage.setItem('rexchange_auth_token', token);
}

function removeAuthToken() {
  localStorage.removeItem('rexchange_auth_token');
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) || {}),
  };

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(errorData.error || `Request failed with status ${res.status}`);
  }

  return res.json();
}

export const api = {
  auth: {
    signup: async (data: { name: string; email: string; password?: string; college?: string; department?: string; year?: string; bio?: string }) => {
      const res = await request<{ user: any; token: string }>('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      if (res.token) setAuthToken(res.token);
      return res;
    },
    login: async (data: { email: string; password?: string }) => {
      const res = await request<{ user: any; token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      if (res.token) setAuthToken(res.token);
      return res;
    },
    logout: async () => {
      try {
        await request('/auth/logout', { method: 'POST' });
      } finally {
        removeAuthToken();
      }
    },
    getMe: async () => {
      return request<{ user: any }>('/auth/me');
    },
  },

  users: {
    get: async (id: string) => {
      return request<{ user: any }>(`/users/${id}`);
    },
    update: async (id: string, updates: any) => {
      return request<{ user: any }>(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    },
  },

  listings: {
    getAll: async (params?: { category?: string; subcategory?: string; search?: string; minPrice?: number; maxPrice?: number; status?: string; sellerId?: string }) => {
      const query = new URLSearchParams();
      if (params?.category && params.category !== 'All') query.append('category', params.category);
      if (params?.subcategory && params.subcategory !== 'All Subcategories') query.append('subcategory', params.subcategory);
      if (params?.search) query.append('search', params.search);
      if (params?.minPrice !== undefined) query.append('minPrice', params.minPrice.toString());
      if (params?.maxPrice !== undefined) query.append('maxPrice', params.maxPrice.toString());
      if (params?.status) query.append('status', params.status);
      if (params?.sellerId) query.append('sellerId', params.sellerId);

      const qs = query.toString() ? `?${query.toString()}` : '';
      return request<{ listings: any[] }>(`/listings${qs}`);
    },
    getTrending: async () => {
      return request<{ listings: any[] }>('/listings/trending');
    },
    getRecommended: async (userId?: string) => {
      const qs = userId ? `?userId=${userId}` : '';
      return request<{ listings: any[] }>(`/listings/recommended${qs}`);
    },
    getById: async (id: string) => {
      return request<{ listing: any }>(`/listings/${id}`);
    },
    create: async (listingData: any) => {
      return request<{ listing: any }>('/listings', {
        method: 'POST',
        body: JSON.stringify(listingData),
      });
    },
    update: async (id: string, updates: any) => {
      return request<{ listing: any }>(`/listings/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    },
    delete: async (id: string) => {
      return request<{ success: boolean }>(`/listings/${id}`, {
        method: 'DELETE',
      });
    },
  },

  messages: {
    getConversations: async (userId?: string) => {
      const qs = userId ? `?userId=${userId}` : '';
      return request<{ conversations: any[] }>(`/messages/conversations${qs}`);
    },
    getMessages: async (listingId: string) => {
      return request<{ messages: any[] }>(`/messages/${listingId}`);
    },
    send: async (data: { listingId: string; senderId: string; receiverId: string; content: string }) => {
      return request<{ message: any }>('/messages', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
  },

  saved: {
    get: async (userId?: string) => {
      const qs = userId ? `?userId=${userId}` : '';
      return request<{ listings: any[] }>(`/saved${qs}`);
    },
    save: async (userId: string, listingId: string) => {
      return request<{ success: boolean }>('/saved', {
        method: 'POST',
        body: JSON.stringify({ userId, listingId }),
      });
    },
    remove: async (userId: string, listingId: string) => {
      return request<{ success: boolean }>(`/saved/${listingId}?userId=${userId}`, {
        method: 'DELETE',
      });
    },
  },

  reviews: {
    getForUser: async (userId: string) => {
      return request<{ reviews: any[] }>(`/reviews/${userId}`);
    },
    create: async (reviewData: { listingId: string; reviewerId: string; revieweeId: string; rating: number; comment?: string }) => {
      return request<{ review: any }>('/reviews', {
        method: 'POST',
        body: JSON.stringify(reviewData),
      });
    },
  },

  notifications: {
    get: async (userId?: string) => {
      const qs = userId ? `?userId=${userId}` : '';
      return request<{ notifications: any[]; unreadCount: number }>(`/notifications${qs}`);
    },
    markAllRead: async (userId?: string) => {
      return request<{ success: boolean }>('/notifications/read-all', {
        method: 'PUT',
        body: JSON.stringify({ userId }),
      });
    },
    markRead: async (id: string) => {
      return request<{ success: boolean }>(`/notifications/${id}/read`, {
        method: 'PUT',
      });
    },
  },

  analytics: {
    getCommunity: async () => {
      return request<{
        totalListings: number;
        totalStudents: number;
        totalTradesCompleted: number;
        categoryCounts: Record<string, number>;
        topContributors: any[];
        activityTimeline: { day: string; listings: number; exchanges: number }[];
      }>('/analytics/community');
    },
  },

  ai: {
    generateDescription: async (data: { title: string; category?: string; keywords?: string }) => {
      return request<{ description: string }>('/ai/generate-description', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    autoTag: async (data: { title: string; description?: string }) => {
      return request<{ tags: string[] }>('/ai/auto-tag', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    moderate: async (data: { content: string }) => {
      return request<{ safe: boolean; reason?: string }>('/ai/moderate', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    explainMatch: async (data: { userId?: string; listingId: string }) => {
      return request<{ explanation: string }>('/ai/explain-match', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
  },
};
