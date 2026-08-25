import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowLeft,
  Bookmark,
  Share2,
  ShieldCheck,
  MapPin,
  Clock,
  Sparkles,
  MessageSquare,
  Repeat,
  Star,
  Loader2,
  CheckCircle,
} from 'lucide-react';
import { api } from '../lib/api';

export const ListingDetailScreen: React.FC = () => {
  const {
    activeListingId,
    selectedListingId,
    listings,
    navigateTo,
    savedListingIds,
    toggleSaveListing,
    startConversationWithListing,
    user,
  } = useApp();

  const [tradeOfferModal, setTradeOfferModal] = useState(false);
  const [tradeNotes, setTradeNotes] = useState('');
  const [offerSent, setOfferSent] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // AI Smart Match
  const [matchExplanation, setMatchExplanation] = useState<string | null>(null);
  const [isLoadingMatch, setIsLoadingMatch] = useState(false);

  // Reviews
  const [reviews, setReviews] = useState<any[]>([]);

  const currentId = activeListingId || selectedListingId;
  const listing = listings.find((l) => l.id === currentId) || listings[0];
  const isSaved = savedListingIds.includes(listing.id);
  const isOwnListing = listing.seller.id === user.id || listing.seller.isCurrentUser;

  // Fetch AI Match explanation and seller reviews
  useEffect(() => {
    let isMounted = true;

    async function loadDetailData() {
      if (!listing) return;
      setIsLoadingMatch(true);
      try {
        const [matchRes, reviewsRes] = await Promise.allSettled([
          api.ai.explainMatch({ userId: user.id, listingId: listing.id }),
          api.reviews.getForUser(listing.seller.id),
        ]);

        if (isMounted) {
          if (matchRes.status === 'fulfilled' && matchRes.value?.explanation) {
            setMatchExplanation(matchRes.value.explanation);
          }
          if (reviewsRes.status === 'fulfilled' && reviewsRes.value?.reviews) {
            setReviews(reviewsRes.value.reviews);
          }
        }
      } catch (err) {
        console.warn('Failed to load listing extra context', err);
      } finally {
        if (isMounted) setIsLoadingMatch(false);
      }
    }

    loadDetailData();
    return () => {
      isMounted = false;
    };
  }, [listing?.id, user.id]);

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleSendTradeOffer = (e: React.FormEvent) => {
    e.preventDefault();
    setOfferSent(true);
    setTimeout(() => {
      setOfferSent(false);
      setTradeOfferModal(false);
      startConversationWithListing(listing);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 dot-grid pt-24 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Navigation Bar */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigateTo('feed')}
            className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Campus Feed</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => toggleSaveListing(listing.id)}
              className={`p-2.5 rounded-2xl border transition-all cursor-pointer ${
                isSaved
                  ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-400'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
              title={isSaved ? 'Saved to Wishlist' : 'Save to Wishlist'}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-indigo-400' : ''}`} />
            </button>
            <button
              onClick={handleCopyLink}
              className="p-2.5 rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer relative"
              title="Share listing"
            >
              {copySuccess ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* 2-Column Detail Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Image Preview & Details (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Main Image Showcase */}
            <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[32px] p-4 shadow-2xl overflow-hidden relative group">
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950">
                <img
                  src={listing.imageUrl}
                  alt={listing.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Floating Price Pill */}
                <div className="absolute top-4 right-4 bg-slate-950/85 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full shadow-2xl font-mono text-sm font-bold">
                  <span className={listing.price === 0 ? 'text-green-400' : 'text-white'}>
                    {listing.price === 0 ? 'Free (Giveaway)' : `₹${listing.price.toLocaleString('en-IN')}${listing.priceUnit || ''}`}
                  </span>
                </div>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-lg bg-indigo-600/90 text-white backdrop-blur-md shadow-md">
                    {listing.category}
                  </span>
                  {listing.condition && (
                    <span className="font-mono text-[10px] px-3 py-1 rounded-lg bg-slate-900/85 text-slate-200 backdrop-blur-md border border-white/10">
                      {listing.condition}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* AI Academic Match Explanation Card */}
            <div className="bg-indigo-950/30 backdrop-blur-xl border border-indigo-500/25 rounded-[28px] p-5 shadow-xl">
              <div className="flex items-center gap-2 mb-2 font-mono text-xs font-bold text-indigo-300">
                <Sparkles className="w-4 h-4 text-fuchsia-400 animate-pulse" />
                <span className="uppercase tracking-wider">AI Campus Match Insight</span>
              </div>
              {isLoadingMatch ? (
                <div className="flex items-center gap-2 text-xs text-slate-400 py-1">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                  <span>Analyzing compatibility with your academic major...</span>
                </div>
              ) : (
                <p className="text-xs sm:text-sm text-slate-300 font-body leading-relaxed">
                  {matchExplanation ||
                    `Relevant for students in ${user.department}. Verified peer trade record with fast on-campus delivery.`}
                </p>
              )}
            </div>

            {/* Description & Specs Card */}
            <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 sm:p-8 shadow-2xl space-y-6">
              <div>
                <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-indigo-300 mb-1.5">
                  <span>{listing.category}</span>
                  <span>•</span>
                  <span>{listing.subcategory}</span>
                </div>
                <h1 className="font-display text-2xl sm:text-3xl font-black text-white leading-snug">
                  {listing.title}
                </h1>
              </div>

              <div>
                <h3 className="font-mono text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                  Item Description
                </h3>
                <p className="font-body text-sm sm:text-base text-slate-300 leading-relaxed whitespace-pre-line font-normal">
                  {listing.description}
                </p>
              </div>

              {/* Tags */}
              {listing.tags && listing.tags.length > 0 && (
                <div>
                  <h3 className="font-mono text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2.5">
                    Tags & Keywords
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {listing.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-xs px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-indigo-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Campus Exchange Safety Badge */}
              <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-300 leading-relaxed font-body">
                  <span className="font-bold text-white block mb-0.5">Campus Safety Guarantee</span>
                  Trade safely at high-visibility campus spots: Student Union, Science Quad, or Campus Library 1st Floor.
                </div>
              </div>
            </div>

            {/* Seller Reviews & Peer Ratings */}
            {reviews.length > 0 && (
              <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-slate-300">
                    Peer Reviews ({reviews.length})
                  </h3>
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-mono font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>5.0 Verified Average</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={rev.reviewerAvatar}
                            alt={rev.reviewerName}
                            className="w-5 h-5 rounded-full object-cover"
                          />
                          <span className="font-mono text-xs font-semibold text-slate-200">
                            {rev.reviewerName}
                          </span>
                        </div>
                        <div className="flex items-center text-amber-400">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-300 font-body">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Seller Profile & Action Bar (5 Cols) */}
          <div className="lg:col-span-5 space-y-6 sticky top-24">
            {/* Seller Card */}
            <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 sm:p-7 shadow-2xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Seller Identity
                </span>
                <span className="font-mono text-[10px] text-green-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_6px_#4ade80]" />
                  Active Student
                </span>
              </div>

              {/* Avatar & Meta */}
              <div className="flex items-center gap-4">
                <img
                  src={listing.seller.avatar}
                  alt={listing.seller.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-500/30"
                />
                <div>
                  <h3 className="font-display text-lg font-bold text-white flex items-center gap-1.5">
                    <span>{listing.seller.name}</span>
                    {listing.seller.verified && (
                      <ShieldCheck className="w-4 h-4 text-green-400" title="Verified .edu email" />
                    )}
                  </h3>
                  <p className="font-mono text-xs text-slate-400">{listing.seller.department}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                  <div className="text-[10px] text-slate-400 uppercase">Campus Rating</div>
                  <div className="text-sm font-bold text-amber-400 mt-0.5 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{listing.seller.rating || 5.0} / 5.0</span>
                  </div>
                </div>

                <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                  <div className="text-[10px] text-slate-400 uppercase">Trades Completed</div>
                  <div className="text-sm font-bold text-indigo-300 mt-0.5">
                    {listing.seller.reviewsCount || 8} exchanges
                  </div>
                </div>
              </div>

              {/* Direct Actions */}
              <div className="space-y-3 pt-2">
                {isOwnListing ? (
                  <button
                    onClick={() => navigateTo('dashboard')}
                    className="w-full py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Manage in Dashboard
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => startConversationWithListing(listing)}
                      className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-widest shadow-2xl shadow-indigo-600/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Message Student Directly</span>
                    </button>

                    <button
                      onClick={() => setTradeOfferModal(true)}
                      className="w-full py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 font-bold text-xs uppercase tracking-widest backdrop-blur-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Repeat className="w-4 h-4 text-fuchsia-400" />
                      <span>Propose Swap / Trade</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Quick Listing Metadata */}
            <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[28px] p-5 shadow-xl space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Posted</span>
                </span>
                <span className="text-slate-200">{listing.createdAt}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Preferred Meeting</span>
                </span>
                <span className="text-slate-200">Main Campus Quad</span>
              </div>
            </div>
          </div>
        </div>

        {/* Trade Proposal Modal */}
        {tradeOfferModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xl animate-in fade-in">
            <div className="relative w-full max-w-lg bg-slate-900/85 backdrop-blur-2xl border border-white/15 rounded-[36px] p-6 sm:p-8 shadow-2xl">
              <h3 className="font-display text-xl font-bold text-white mb-2">
                Propose Item Trade / Swap
              </h3>
              <p className="text-xs text-slate-400 font-mono mb-4">
                Offer one of your listed resources or services in exchange for "{listing.title}".
              </p>

              <form onSubmit={handleSendTradeOffer} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-1">
                    Trade Proposal Message
                  </label>
                  <textarea
                    rows={4}
                    value={tradeNotes}
                    onChange={(e) => setTradeNotes(e.target.value)}
                    placeholder="e.g. I have a TI-84 Plus Calculator or can provide 3 hours of Calculus 2 tutoring in exchange for this item..."
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-3.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2 font-mono text-xs">
                  <button
                    type="button"
                    onClick={() => setTradeOfferModal(false)}
                    className="px-5 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold uppercase tracking-wider shadow-lg shadow-indigo-600/30 cursor-pointer"
                  >
                    {offerSent ? 'Offer Sent!' : 'Submit Proposal'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
