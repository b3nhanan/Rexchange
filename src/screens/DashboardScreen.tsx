import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Package,
  Bookmark,
  Repeat,
  Award,
  Plus,
  CheckCircle,
  Trash2,
  Sparkles,
  TrendingUp,
  Users,
  BarChart3,
} from 'lucide-react';
import { api } from '../lib/api';

export const DashboardScreen: React.FC = () => {
  const {
    user,
    listings,
    savedListingIds,
    toggleSaveListing,
    updateListingStatus,
    deleteListing,
    navigateTo,
    openAuth,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'my_listings' | 'saved' | 'exchanges' | 'analytics'>(
    user ? 'my_listings' : 'analytics'
  );
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const data = await api.analytics.getCommunity();
        setAnalytics(data);
      } catch (err) {
        console.warn('Failed to load community analytics', err);
      }
    }
    loadAnalytics();
  }, []);

  // User's own listings
  const myListings = user
    ? listings.filter((l) => l.seller.id === user.id || l.seller.isCurrentUser)
    : [];

  // Saved listings
  const savedListings = listings.filter((l) => savedListingIds.includes(l.id));

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 dot-grid pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Navigation Sidebar */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 sticky top-24 space-y-6 shadow-2xl">
              {/* User Mini Profile or Guest Callout */}
              {user ? (
                <div className="flex items-center gap-3.5 pb-5 border-b border-white/10">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-indigo-500/40"
                  />
                  <div>
                    <h3 className="font-display text-base font-bold text-white leading-tight">
                      {user.name}
                    </h3>
                    <p className="font-mono text-xs text-slate-400">
                      {user.department}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="pb-5 border-b border-white/10 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-xs">
                      ?
                    </div>
                    <div>
                      <h3 className="font-display text-sm font-bold text-white leading-tight">
                        Guest Visitor
                      </h3>
                      <p className="font-mono text-[10px] text-slate-400">
                        Campus Network
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => openAuth('login')}
                    className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold uppercase transition-all shadow-lg shadow-indigo-600/30 cursor-pointer mt-2"
                  >
                    Sign In
                  </button>
                </div>
              )}

              {/* Sidebar Navigation */}
              <nav className="space-y-2 font-mono text-xs">
                <button
                  onClick={() => setActiveTab('my_listings')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all cursor-pointer ${
                    activeTab === 'my_listings'
                      ? 'bg-indigo-600/20 text-indigo-300 font-bold border border-indigo-500/40 shadow-lg shadow-indigo-600/20'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Package className="w-4 h-4" />
                    <span>My Listings</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-white/10 border border-white/10 text-[10px]">
                    {myListings.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('saved')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all cursor-pointer ${
                    activeTab === 'saved'
                      ? 'bg-indigo-600/20 text-indigo-300 font-bold border border-indigo-500/40 shadow-lg shadow-indigo-600/20'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Bookmark className="w-4 h-4" />
                    <span>Saved Wishlist</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-white/10 border border-white/10 text-[10px]">
                    {savedListings.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('exchanges')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all cursor-pointer ${
                    activeTab === 'exchanges'
                      ? 'bg-indigo-600/20 text-indigo-300 font-bold border border-indigo-500/40 shadow-lg shadow-indigo-600/20'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Repeat className="w-4 h-4" />
                    <span>Trade History</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-white/10 border border-white/10 text-[10px]">
                    {analytics?.totalTradesCompleted || 3}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all cursor-pointer ${
                    activeTab === 'analytics'
                      ? 'bg-indigo-600/20 text-indigo-300 font-bold border border-indigo-500/40 shadow-lg shadow-indigo-600/20'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-4 h-4" />
                    <span>Community Activity</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px]">
                    Live
                  </span>
                </button>

                <button
                  onClick={() => navigateTo('profile')}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                >
                  <Award className="w-4 h-4" />
                  <span>Karma & Badges</span>
                </button>
              </nav>

              {/* Quick Post CTA */}
              <div className="pt-4 border-t border-white/10">
                <button
                  onClick={() => navigateTo('create')}
                  className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/35 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Listing</span>
                </button>
              </div>
            </div>
          </aside>

          {/* Main Dashboard Area */}
          <main className="flex-1 min-w-0 space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-display text-2xl sm:text-3xl font-black text-white">
                  Community Dashboard
                </h1>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  Manage active listings, trade history, and student reputation score.
                </p>
              </div>

              <button
                onClick={() => navigateTo('create')}
                className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold uppercase tracking-wider shadow-lg shadow-indigo-600/30 flex items-center gap-2 self-start sm:self-auto cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>New Listing</span>
              </button>
            </div>

            {/* Karma & Reputation Card */}
            <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 sm:p-8 relative overflow-hidden shadow-2xl">
              <div className="absolute right-0 top-0 w-80 h-full bg-indigo-600/15 blur-3xl pointer-events-none" />

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 font-mono text-xs text-fuchsia-300 font-bold uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-fuchsia-400" />
                    <span>{user ? `Campus Karma Level ${Math.floor((user.karmaPoints || 0) / 100) + 1}` : 'Campus Karma Network'}</span>
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span className="font-display text-4xl font-black text-white">
                      {user ? user.karmaPoints : 0}
                    </span>
                    <span className="font-mono text-xs text-indigo-300">Karma Points</span>
                  </div>
                  <p className="text-xs text-slate-400 font-body max-w-md">
                    {user
                      ? 'Earn +50 karma for each active listing and +40 for completed exchanges across campus.'
                      : 'Join your campus marketplace network. Earn +50 karma for listings and build your verified student reputation.'}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="w-full sm:w-48 bg-slate-950/80 rounded-full h-3.5 border border-white/10 overflow-hidden p-0.5">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-fuchsia-500 h-full rounded-full"
                      style={{ width: `${user ? Math.min(100, ((user.karmaPoints || 0) / 500) * 100) : 0}%` }}
                    />
                  </div>
                  {user ? (
                    <button
                      onClick={() => navigateTo('profile')}
                      className="px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 font-mono text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer"
                    >
                      View Badges
                    </button>
                  ) : (
                    <button
                      onClick={() => openAuth('signup')}
                      className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer shadow-lg shadow-indigo-600/30"
                    >
                      Join & Earn Karma
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Tab 1: My Listings */}
            {activeTab === 'my_listings' && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* Create New Card (Dashed) */}
                <div
                  onClick={() => navigateTo('create')}
                  className="border-2 border-dashed border-white/15 hover:border-indigo-500/50 rounded-[32px] p-6 flex flex-col items-center justify-center text-center gap-3 min-h-[280px] cursor-pointer bg-white/[0.01] hover:bg-white/[0.04] transition-all group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-600/20 transition-all">
                    <Plus className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-display text-sm font-bold text-white group-hover:text-indigo-300">
                      Post New Resource
                    </h4>
                    <p className="text-xs text-slate-400 font-body mt-1">
                      Textbook, gadget, service, or dorm item
                    </p>
                  </div>
                </div>

                {/* Active Items */}
                {myListings.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[32px] p-4 flex flex-col group hover:border-white/25 transition-all shadow-xl"
                  >
                    <div
                      onClick={() => navigateTo('listing_detail', item.id)}
                      className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950 mb-3 cursor-pointer"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute top-2.5 right-2.5 font-mono text-xs font-bold px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/15 text-green-400">
                        {item.price === 0 ? 'Free' : `₹${item.price.toLocaleString('en-IN')}`}
                      </div>

                      <div className="absolute top-2.5 left-2.5 font-mono text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-600 text-white">
                        {item.status.toUpperCase()}
                      </div>
                    </div>

                    <h4
                      onClick={() => navigateTo('listing_detail', item.id)}
                      className="font-display text-base font-semibold text-white line-clamp-1 mb-1 cursor-pointer hover:text-indigo-300 transition-colors"
                    >
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-400 font-body line-clamp-2 mb-3">
                      {item.description}
                    </p>

                    {/* Actions */}
                    <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-500 text-[11px]">{item.createdAt}</span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateListingStatus(item.id, item.status === 'active' ? 'sold' : 'active')}
                          className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-green-400 text-[11px] transition-colors cursor-pointer"
                        >
                          {item.status === 'active' ? 'Mark Sold' : 'Reactivate'}
                        </button>

                        <button
                          onClick={() => deleteListing(item.id)}
                          className="p-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                          title="Delete Listing"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 2: Saved Items */}
            {activeTab === 'saved' && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {savedListings.length === 0 ? (
                  <div className="col-span-full bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[32px] p-12 text-center space-y-3 shadow-2xl">
                    <Bookmark className="w-10 h-10 text-slate-500 mx-auto" />
                    <h3 className="font-display text-base font-bold text-white">No saved items yet</h3>
                    <p className="text-xs text-slate-400">
                      Bookmark items from the campus marketplace feed to track them here.
                    </p>
                  </div>
                ) : (
                  savedListings.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[32px] p-4 flex flex-col group hover:border-white/25 transition-all shadow-xl"
                    >
                      <div
                        onClick={() => navigateTo('listing_detail', item.id)}
                        className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950 mb-3 cursor-pointer"
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute top-2.5 right-2.5 font-mono text-xs font-bold px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/15 text-green-400">
                          {item.price === 0 ? 'Free' : `₹${item.price.toLocaleString('en-IN')}`}
                        </div>
                      </div>

                      <h4
                        onClick={() => navigateTo('listing_detail', item.id)}
                        className="font-display text-base font-semibold text-white line-clamp-1 mb-1 cursor-pointer hover:text-indigo-300 transition-colors"
                      >
                        {item.title}
                      </h4>

                      <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-400">Seller: {item.seller.name}</span>
                        <button
                          onClick={() => toggleSaveListing(item.id)}
                          className="text-indigo-400 hover:text-indigo-300 font-bold cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Tab 3: Completed Trades */}
            {activeTab === 'exchanges' && (
              <div className="space-y-3">
                {[
                  {
                    title: 'Calculus Early Transcendentals (Stewart)',
                    role: 'Exchanged with Sarah for CS study notes',
                    date: 'Yesterday',
                    points: '+40 Karma',
                  },
                  {
                    title: 'Dell 24" 1080p Monitor',
                    role: 'Traded for ₹3,500 campus credit',
                    date: 'Last week',
                    points: '+50 Karma',
                  },
                  {
                    title: 'Intro to Python 1-on-1 Tutoring Session',
                    role: 'Completed 2hr tutoring',
                    date: '2 weeks ago',
                    points: '+30 Karma',
                  },
                ].map((trade, i) => (
                  <div
                    key={i}
                    className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-2xl p-4.5 flex items-center justify-between gap-4 shadow-lg"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-400">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-display text-sm font-bold text-white">
                          {trade.title}
                        </h4>
                        <p className="text-xs text-slate-400 font-body">{trade.role}</p>
                      </div>
                    </div>
                    <div className="text-right font-mono text-xs shrink-0">
                      <span className="text-green-400 font-bold block">{trade.points}</span>
                      <span className="text-slate-500 text-[11px]">{trade.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 4: Campus Analytics Pulse */}
            {activeTab === 'analytics' && analytics && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 space-y-1 shadow-xl">
                    <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                      <span>Total Active Listings</span>
                      <Package className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div className="font-display text-2xl font-bold text-white">
                      {analytics.totalListings}
                    </div>
                  </div>

                  <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 space-y-1 shadow-xl">
                    <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                      <span>Verified Students</span>
                      <Users className="w-4 h-4 text-fuchsia-400" />
                    </div>
                    <div className="font-display text-2xl font-bold text-white">
                      {analytics.totalStudents}
                    </div>
                  </div>

                  <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 space-y-1 shadow-xl">
                    <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                      <span>Successful Trades</span>
                      <TrendingUp className="w-4 h-4 text-green-400" />
                    </div>
                    <div className="font-display text-2xl font-bold text-green-400">
                      {analytics.totalTradesCompleted}
                    </div>
                  </div>
                </div>

                {/* Top Campus Contributors Leaderboard */}
                <div className="bg-white/[0.03] border border-white/10 rounded-[32px] p-6 shadow-2xl space-y-4">
                  <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-slate-300">
                    Campus Karma Leaderboard
                  </h3>
                  <div className="divide-y divide-white/5">
                    {analytics.topContributors?.map((contrib: any, idx: number) => (
                      <div key={contrib.id} className="py-3.5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="w-6 font-mono text-xs font-bold text-indigo-400">
                            #{idx + 1}
                          </span>
                          <img
                            src={contrib.avatar}
                            alt={contrib.name}
                            className="w-8 h-8 rounded-full object-cover border border-white/10"
                          />
                          <div>
                            <p className="font-mono text-xs font-bold text-slate-200">
                              {contrib.name}
                            </p>
                            <p className="text-[11px] text-slate-500">
                              {contrib.department} • {contrib.year}
                            </p>
                          </div>
                        </div>
                        <div className="text-right font-mono text-xs">
                          <span className="text-indigo-300 font-bold block">{contrib.karma} pts</span>
                          <span className="text-slate-500 text-[10px]">{contrib.tradesCompleted} trades</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
