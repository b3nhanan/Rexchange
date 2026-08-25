import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Bell, ShoppingCart, ArrowLeft, Menu, X, PlusCircle, ShieldCheck } from 'lucide-react';

export const TopNavigation: React.FC = () => {
  const {
    currentScreen,
    navigateTo,
    searchQuery,
    setSearchQuery,
    user,
    openAuth,
    notifications,
    notificationCount,
    clearNotifications,
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);

  // If on Landing page, show sleek frosted glass navbar
  if (currentScreen === 'landing') {
    return (
      <header className="fixed top-0 w-full z-50 bg-white/[0.02] backdrop-blur-2xl border-b border-white/10 px-6 sm:px-10 py-4 transition-all">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button
            onClick={() => navigateTo('landing')}
            className="flex items-center gap-3 group focus:outline-none cursor-pointer"
          >
            <div className="w-9 h-9 bg-gradient-to-tr from-indigo-500 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <div className="w-4 h-4 border-2 border-white/90 rounded-sm rotate-45" />
            </div>
            <span className="text-xl sm:text-2xl font-black tracking-tighter italic text-white">
              REXCHANGE<span className="text-indigo-400">.</span>
            </span>
          </button>

          <div className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
            <button
              onClick={() => navigateTo('feed')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Marketplace
            </button>
            <button
              onClick={() => navigateTo('create')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Post Listing
            </button>
            <button
              onClick={() => navigateTo('dashboard')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Community
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => openAuth('login')}
              className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 backdrop-blur-md transition-all cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={() => navigateTo('feed')}
              className="hidden sm:flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/35 transition-all cursor-pointer"
            >
              Explore Marketplace
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white md:hidden cursor-pointer"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Landing Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-white/10 space-y-3 font-mono text-xs">
            <button
              onClick={() => {
                navigateTo('feed');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left py-2.5 text-slate-200 hover:text-white uppercase tracking-wider flex items-center justify-between"
            >
              <span>Marketplace Feed</span>
            </button>
            <button
              onClick={() => {
                navigateTo('create');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left py-2.5 text-slate-200 hover:text-white uppercase tracking-wider flex items-center justify-between"
            >
              <span>Post Listing</span>
            </button>
            <button
              onClick={() => {
                navigateTo('dashboard');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left py-2.5 text-slate-200 hover:text-white uppercase tracking-wider flex items-center justify-between"
            >
              <span>Community Dashboard</span>
            </button>
          </div>
        )}
      </header>
    );
  }

  // If on Auth screen, show simple back navbar
  if (currentScreen === 'auth') {
    return (
      <header className="w-full flex justify-between items-center px-6 sm:px-10 py-5 z-20 relative border-b border-white/10 bg-white/[0.02] backdrop-blur-2xl">
        <button
          onClick={() => navigateTo('feed')}
          className="flex items-center gap-3 focus:outline-none"
        >
          <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-fuchsia-500 rounded-lg flex items-center justify-center shadow-md shadow-indigo-500/20">
            <div className="w-3.5 h-3.5 border-2 border-white/90 rounded-sm rotate-45" />
          </div>
          <span className="text-xl font-black tracking-tighter italic text-white">
            REXCHANGE<span className="text-indigo-400">.</span>
          </span>
        </button>
        <button
          onClick={() => navigateTo('landing')}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
      </header>
    );
  }

  // Standard In-App Navigation Bar (Feed, Dashboard, Profile, Messages, Create)
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/[0.02] backdrop-blur-2xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between gap-4">
        {/* Left: Brand & Links */}
        <div className="flex items-center gap-10">
          <button
            onClick={() => navigateTo('landing')}
            className="flex items-center gap-3 group focus:outline-none cursor-pointer"
            title="Return to Home"
          >
            <div className="w-9 h-9 bg-gradient-to-tr from-indigo-500 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform shrink-0">
              <div className="w-4 h-4 border-2 border-white/90 rounded-sm rotate-45" />
            </div>
            <span className="text-xl font-black tracking-tighter italic text-white hidden sm:inline">
              REXCHANGE<span className="text-indigo-400">.</span>
            </span>
          </button>

          <div className="hidden md:flex gap-8 items-center text-xs font-bold uppercase tracking-[0.2em]">
            <button
              onClick={() => navigateTo('feed')}
              className={`transition-all pb-1 cursor-pointer ${
                currentScreen === 'feed'
                  ? 'text-white border-b-2 border-indigo-500 font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Marketplace
            </button>
            <button
              onClick={() => navigateTo('create')}
              className={`transition-all pb-1 cursor-pointer ${
                currentScreen === 'create'
                  ? 'text-white border-b-2 border-indigo-500 font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Create
            </button>
            <button
              onClick={() => navigateTo('dashboard')}
              className={`transition-all pb-1 cursor-pointer ${
                currentScreen === 'dashboard'
                  ? 'text-white border-b-2 border-indigo-500 font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Community
            </button>
            <button
              onClick={() => navigateTo('messages')}
              className={`transition-all pb-1 cursor-pointer ${
                currentScreen === 'messages'
                  ? 'text-white border-b-2 border-indigo-500 font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Messages
            </button>
          </div>
        </div>

        {/* Center: Frosted Search Bar */}
        <div className="flex-1 max-w-md mx-4 hidden lg:block">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search resources, textbooks, services..."
              className="w-full bg-white/[0.04] border border-white/10 rounded-full py-2 pl-10 pr-4 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 focus:bg-white/[0.07] backdrop-blur-md transition-all font-body"
            />
          </div>
        </div>

        {/* Right: Actions, Encryption Badge & Profile */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigateTo('create')}
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-indigo-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md transition-all"
          >
            <PlusCircle className="w-4 h-4 text-indigo-400" />
            <span>New Listing</span>
          </button>

          {/* Status Badge */}
          <div className="hidden xl:flex items-center gap-3 pl-2 border-l border-white/10">
            <div className="text-right">
              <div className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Student Status</div>
              <div className="text-[11px] font-mono text-green-400 font-semibold">VERIFIED .EDU</div>
            </div>
            <div className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center">
              <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_#22c55e]" />
            </div>
          </div>

          {/* Notifications button */}
          <div className="relative">
            <button
              aria-label="notifications"
              onClick={() => {
                setShowNotificationsDropdown(!showNotificationsDropdown);
                clearNotifications();
              }}
              className="p-2.5 text-slate-400 hover:text-white hover:bg-white/5 border border-white/5 hover:border-white/10 rounded-xl backdrop-blur-md transition-all relative"
            >
              <Bell className="w-4 h-4" />
              {notificationCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-fuchsia-500 rounded-full shadow-[0_0_6px_#d946ef]" />
              )}
            </button>

            {showNotificationsDropdown && (
              <div className="absolute right-0 mt-3 w-80 bg-slate-900/95 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-300 font-mono">
                    Campus Activity
                  </span>
                  {notifications.length > 0 && (
                    <button
                      onClick={() => clearNotifications()}
                      className="text-[10px] text-slate-400 hover:text-white font-mono cursor-pointer"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {notifications.length > 0 ? (
                  <div className="space-y-2.5 max-h-72 overflow-y-auto no-scrollbar text-xs">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          if (notif.link === 'messages') navigateTo('messages');
                          else if (notif.link === 'profile') navigateTo('profile');
                          else if (notif.link === 'dashboard') navigateTo('dashboard');
                          setShowNotificationsDropdown(false);
                        }}
                        className={`p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border transition-colors cursor-pointer ${
                          !notif.isRead ? 'border-indigo-500/40 bg-indigo-500/5' : 'border-white/5'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-slate-200 font-semibold text-xs">{notif.title}</p>
                          {notif.createdAt && (
                            <span className="text-[10px] font-mono text-slate-500">{notif.createdAt}</span>
                          )}
                        </div>
                        <p className="text-slate-400 text-[11px] leading-relaxed">{notif.message}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-6 px-3 text-center">
                    <div className="w-9 h-9 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-2.5 text-slate-400">
                      <Bell className="w-4 h-4 text-slate-400" />
                    </div>
                    <p className="text-xs font-semibold text-slate-300">No new notifications</p>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      You'll receive updates here when peers message you or interact with your listings.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Cart / Saved Items Shortcut */}
          <button
            aria-label="saved items"
            onClick={() => navigateTo('dashboard')}
            className="p-2.5 text-slate-400 hover:text-white hover:bg-white/5 border border-white/5 hover:border-white/10 rounded-xl backdrop-blur-md transition-all hidden sm:block"
            title="Saved Items & Exchanges"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>

          {/* User Profile Avatar or Sign In */}
          {user ? (
            <button
              onClick={() => navigateTo('profile')}
              className="flex items-center gap-2.5 p-1 pl-1.5 pr-3 rounded-full hover:bg-white/5 border border-white/10 backdrop-blur-md transition-all group cursor-pointer"
              title="View Profile"
            >
              <div className="w-7 h-7 rounded-full overflow-hidden border border-indigo-500/40 group-hover:border-indigo-400">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="hidden md:inline text-xs font-semibold text-slate-300">
                {user.name.split(' ')[0]}
              </span>
            </button>
          ) : (
            <button
              onClick={() => openAuth('login')}
              className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              Sign In
            </button>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-slate-400 hover:text-white md:hidden"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-950/95 backdrop-blur-2xl border-b border-white/10 px-6 py-5 space-y-3 font-mono text-xs">
          <div className="relative w-full mb-3">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search resources..."
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
            />
          </div>
          <button
            onClick={() => {
              navigateTo('feed');
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left py-2.5 text-slate-200 hover:text-white uppercase tracking-wider flex items-center justify-between"
          >
            <span>Marketplace Feed</span>
          </button>
          <button
            onClick={() => {
              navigateTo('create');
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left py-2.5 text-slate-200 hover:text-white uppercase tracking-wider flex items-center justify-between"
          >
            <span>Create New Listing</span>
          </button>
          <button
            onClick={() => {
              navigateTo('dashboard');
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left py-2.5 text-slate-200 hover:text-white uppercase tracking-wider flex items-center justify-between"
          >
            <span>Community Dashboard</span>
          </button>
          <button
            onClick={() => {
              navigateTo('profile');
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left py-2.5 text-slate-200 hover:text-white uppercase tracking-wider flex items-center justify-between"
          >
            <span>Student Profile</span>
          </button>
          <button
            onClick={() => {
              navigateTo('messages');
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left py-2.5 text-slate-200 hover:text-white uppercase tracking-wider flex items-center justify-between"
          >
            <span>Campus Messages</span>
          </button>
        </div>
      )}
    </nav>
  );
};
