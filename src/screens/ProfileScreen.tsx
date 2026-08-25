import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Star,
  ShieldCheck,
  Award,
  Flame,
  Handshake,
  Code,
  Share2,
  Edit3,
  CheckCircle2,
  Sparkles,
  Package,
  LogOut,
  Lock,
  ArrowRight,
} from 'lucide-react';

export const ProfileScreen: React.FC = () => {
  const { user, listings, navigateTo, setUser, logout, openAuth } = useApp();

  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioText, setBioText] = useState(user?.bio || '');
  const [copiedShare, setCopiedShare] = useState(false);

  // If visitor is not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-[#020617] text-slate-100 dot-grid pt-28 pb-24 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-4">
          <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[36px] p-8 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-40 h-40 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-fuchsia-600/15 rounded-full blur-3xl pointer-events-none" />

            <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-indigo-600/20">
              <Lock className="w-8 h-8 text-indigo-400" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono font-bold uppercase tracking-widest text-indigo-300 mb-3">
              <ShieldCheck className="w-3 h-3 text-green-400" />
              <span>Campus Profile</span>
            </div>

            <h2 className="font-display text-2xl font-black text-white mb-2">
              Sign In to View Profile
            </h2>
            <p className="text-xs text-slate-400 font-body mb-6 leading-relaxed">
              Sign in with your campus account to view your trade reputation, student badges, karma points, and manage your active listings.
            </p>

            <div className="space-y-3 font-mono text-xs">
              <button
                onClick={() => openAuth('login')}
                className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold uppercase tracking-wider shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Sign In with Campus Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => openAuth('signup')}
                className="w-full py-3 px-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                Create Student Account
              </button>

              <button
                onClick={() => navigateTo('feed')}
                className="w-full py-2.5 text-[11px] text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
              >
                Return to Marketplace Feed
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const userListings = listings.filter((l) => l.seller.id === user.id || l.seller.isCurrentUser);

  const handleSaveBio = () => {
    setUser((prev) => (prev ? { ...prev, bio: bioText } : null));
    setIsEditingBio(false);
  };

  const handleShare = () => {
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 dot-grid pt-24 pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Profile Card Header */}
        <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[36px] p-6 sm:p-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/15 blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
            {/* Avatar */}
            <div className="relative group shrink-0">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover border-2 border-indigo-500/50 shadow-2xl shadow-indigo-600/30"
              />
              <div className="absolute -bottom-2 -right-2 bg-indigo-600 rounded-full p-1.5 border-4 border-slate-950">
                <ShieldCheck className="w-4 h-4 text-white" />
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <h1 className="font-display text-2xl sm:text-3xl font-black text-white">
                      {user.name}
                    </h1>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-green-500/15 border border-green-500/30 text-green-400">
                      Verified Student
                    </span>
                  </div>
                  <p className="font-mono text-xs text-indigo-300 mt-1">
                    {user.department} • {user.college}
                  </p>
                </div>

                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={handleShare}
                    className="px-3.5 py-2 rounded-2xl border border-white/10 bg-white/5 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    {copiedShare ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Share</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setIsEditingBio(!isEditingBio)}
                    className="px-3.5 py-2 rounded-2xl border border-indigo-500/30 bg-indigo-600/20 text-xs font-mono text-indigo-300 hover:bg-indigo-600/30 flex items-center gap-1.5 transition-all font-bold cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Bio</span>
                  </button>

                  <button
                    onClick={logout}
                    className="px-3.5 py-2 rounded-2xl border border-red-500/30 bg-red-500/10 text-xs font-mono text-red-300 hover:bg-red-500/20 flex items-center gap-1.5 transition-all font-medium cursor-pointer"
                    title="Sign Out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>

              {/* Stats Highlights */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-1">
                <div className="flex items-center gap-1.5 bg-white/5 border border-white/5 px-3.5 py-1.5 rounded-2xl text-xs font-mono text-slate-200">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="font-bold">
                    {user.rating > 0 ? user.rating.toFixed(1) : '0.0'}
                  </span>
                  <span className="text-slate-400">({user.reviewsCount} reviews)</span>
                </div>

                <div className="flex items-center gap-1.5 bg-white/5 border border-white/5 px-3.5 py-1.5 rounded-2xl text-xs font-mono text-slate-200">
                  <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
                  <span className="font-bold">{user.karmaPoints}</span>
                  <span className="text-slate-400">Karma</span>
                </div>

                <div className="flex items-center gap-1.5 bg-white/5 border border-white/5 px-3.5 py-1.5 rounded-2xl text-xs font-mono text-slate-200">
                  <Handshake className="w-3.5 h-3.5 text-green-400" />
                  <span className="font-bold">{user.tradesCompleted ?? 0}</span>
                  <span className="text-slate-400">Completed Trades</span>
                </div>
              </div>

              {/* Bio description */}
              {isEditingBio ? (
                <div className="pt-2 space-y-2">
                  <textarea
                    value={bioText}
                    onChange={(e) => setBioText(e.target.value)}
                    rows={3}
                    className="w-full bg-white/5 border border-indigo-500 rounded-2xl p-3 text-xs text-slate-100 focus:outline-none font-body"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setIsEditingBio(false)}
                      className="px-3 py-1 text-xs text-slate-400 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveBio}
                      className="px-4 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-mono font-bold uppercase cursor-pointer"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <p className="font-body text-xs sm:text-sm text-slate-300 leading-relaxed pt-1 max-w-2xl font-medium">
                  {user.bio || 'New student on campus marketplace ready to trade and connect.'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Badges Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-400" />
              <h2 className="font-display text-lg font-bold text-white">Reputation & Badges</h2>
            </div>
            <span className="text-xs font-mono text-indigo-300">
              {user.badges?.length || 0} of 8 Unlocked
            </span>
          </div>

          {user.badges && user.badges.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {user.badges.map((badge) => (
                <div
                  key={badge.id}
                  className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-4.5 flex items-center gap-4 shadow-lg hover:border-white/20 transition-all"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400 shadow-inner shrink-0">
                    {badge.id === 'top-seller' && <Flame className="w-6 h-6 text-amber-400" />}
                    {badge.id === 'trusted-peer' && <Handshake className="w-6 h-6 text-green-400" />}
                    {badge.id === 'tech-guru' && <Code className="w-6 h-6 text-indigo-400" />}
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-bold text-white">{badge.title}</h3>
                    <p className="font-mono text-xs text-slate-400 mt-0.5">{badge.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 text-center">
              <Award className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-50" />
              <p className="text-xs text-slate-400 font-mono">
                No badges unlocked yet. Complete trades, exchanges, and post verified listings to earn campus badges!
              </p>
            </div>
          )}
        </section>

        {/* Active Listings Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-t border-white/10 pt-8">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-indigo-300" />
              <h2 className="font-display text-lg font-bold text-white">
                {user.name.split(' ')[0]}'s Active Listings ({userListings.length})
              </h2>
            </div>
            <button
              onClick={() => navigateTo('create')}
              className="text-xs font-mono uppercase tracking-wider text-indigo-400 hover:text-indigo-300 font-bold cursor-pointer"
            >
              + Create New
            </button>
          </div>

          {userListings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {userListings.map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigateTo('listing_detail', item.id)}
                  className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[32px] p-4 flex flex-col group hover:border-white/25 transition-all cursor-pointer shadow-xl"
                >
                  <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950 mb-3">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute top-2.5 right-2.5 font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/15 text-green-400">
                      {item.price === 0 ? 'Free' : `₹${item.price.toLocaleString('en-IN')}`}
                    </div>
                  </div>

                  <h3 className="font-display text-sm font-semibold text-white group-hover:text-indigo-300 line-clamp-1 mb-1 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-body line-clamp-2">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-8 text-center space-y-3">
              <Package className="w-10 h-10 text-slate-500 mx-auto opacity-50" />
              <p className="text-sm font-semibold text-slate-300">You haven't posted any listings yet</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Got old textbooks, gadgets, notes, or offering campus tutoring? Post your first listing to start trading.
              </p>
              <button
                onClick={() => navigateTo('create')}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold uppercase transition-all shadow-lg shadow-indigo-600/30 cursor-pointer"
              >
                Post Your First Listing (+50 Karma)
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
