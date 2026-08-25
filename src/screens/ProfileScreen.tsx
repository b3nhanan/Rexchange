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
} from 'lucide-react';

export const ProfileScreen: React.FC = () => {
  const { user, listings, navigateTo, setUser } = useApp();

  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioText, setBioText] = useState(user.bio);
  const [copiedShare, setCopiedShare] = useState(false);

  const userListings = listings.filter((l) => l.seller.id === user.id || l.seller.isCurrentUser);

  const handleSaveBio = () => {
    setUser((prev) => ({ ...prev, bio: bioText }));
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
            <div className="relative group">
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
                    className="px-4 py-2 rounded-2xl border border-white/10 bg-white/5 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    {copiedShare ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                        <span>Link Copied</span>
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
                    className="px-4 py-2 rounded-2xl border border-indigo-500/30 bg-indigo-600/20 text-xs font-mono text-indigo-300 hover:bg-indigo-600/30 flex items-center gap-1.5 transition-all font-bold cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Bio</span>
                  </button>
                </div>
              </div>

              {/* Stats Highlights */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-1">
                <div className="flex items-center gap-1.5 bg-white/5 border border-white/5 px-3.5 py-1.5 rounded-2xl text-xs font-mono text-slate-200">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="font-bold">{user.rating}</span>
                  <span className="text-slate-400">({user.reviewsCount} reviews)</span>
                </div>

                <div className="flex items-center gap-1.5 bg-white/5 border border-white/5 px-3.5 py-1.5 rounded-2xl text-xs font-mono text-slate-200">
                  <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
                  <span className="font-bold">{user.karmaPoints}</span>
                  <span className="text-slate-400">Karma</span>
                </div>

                <div className="flex items-center gap-1.5 bg-white/5 border border-white/5 px-3.5 py-1.5 rounded-2xl text-xs font-mono text-slate-200">
                  <Handshake className="w-3.5 h-3.5 text-green-400" />
                  <span className="font-bold">14</span>
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
                    className="w-full bg-white/5 border border-indigo-500 rounded-2xl p-3 text-xs text-slate-100 focus:outline-none"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setIsEditingBio(false)}
                      className="px-3 py-1 text-xs text-slate-400"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveBio}
                      className="px-4 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-mono font-bold uppercase"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <p className="font-body text-xs sm:text-sm text-slate-300 leading-relaxed pt-1 max-w-2xl font-medium">
                  {user.bio}
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
            <span className="text-xs font-mono text-indigo-300">3 of 8 Unlocked</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {user.badges.map((badge) => (
              <div
                key={badge.id}
                className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-4.5 flex items-center gap-4 shadow-lg hover:border-white/20 transition-all"
              >
                <div
                  className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400 shadow-inner shrink-0"
                >
                  {badge.id === 'top-seller' && <Flame className="w-6 h-6 text-amber-400" />}
                  {badge.id === 'trusted-peer' && <Handshake className="w-6 h-6 text-green-400" />}
                  {badge.id === 'tech-guru' && <Code className="w-6 h-6 text-indigo-400" />}
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold text-white">{badge.title}</h3>
                  <p className="font-mono text-xs text-slate-400 mt-0.5">
                    {badge.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Active Listings Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-t border-white/10 pt-8">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-indigo-300" />
              <h2 className="font-display text-lg font-bold text-white">
                Alex's Active Listings ({userListings.length})
              </h2>
            </div>
            <button
              onClick={() => navigateTo('create')}
              className="text-xs font-mono uppercase tracking-wider text-indigo-400 hover:text-indigo-300 font-bold"
            >
              + Create New
            </button>
          </div>

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
        </section>
      </div>
    </div>
  );
};
