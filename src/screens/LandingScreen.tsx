import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Package,
  Wrench,
  Rocket,
  ArrowRight,
  Share2,
  Mail,
  Sparkles,
  Activity,
  ShieldCheck,
} from 'lucide-react';

export const LandingScreen: React.FC = () => {
  const { navigateTo, openAuth, setSelectedCategory, listings } = useApp();

  // Find trending items
  const trendingListings = listings.slice(0, 4);

  return (
    <div className="min-h-screen relative overflow-x-hidden dot-grid bg-[#020617] text-slate-100">
      {/* Background Mesh Gradients */}
      <div className="fixed inset-0 pointer-events-none mesh-gradient z-0 opacity-70" />

      {/* Main Container */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen pt-32 pb-16 px-6 max-w-7xl mx-auto">
        {/* Hero Section */}
        <section className="w-full max-w-5xl mx-auto text-center flex flex-col items-center gap-6 relative z-20 mb-24">
          {/* Decorative Glow Elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-indigo-600/18 blur-[130px] rounded-full pointer-events-none" />

          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-[80px] font-black leading-[0.92] tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-100 to-slate-400 drop-shadow-2xl z-10 max-w-4xl">
            ONE CAMPUS <br />
            ONE MARKETPLACE.
          </h1>

          <p className="font-body text-base sm:text-xl text-slate-400 max-w-2xl z-10 leading-relaxed font-medium">
            One platform to find what you need and give what you don't — all within your campus community.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 mt-4 z-10 w-full sm:w-auto">
            <button
              onClick={() => openAuth('signup')}
              className="px-10 py-4.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-2xl shadow-indigo-600/40 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Sign Up</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigateTo('feed')}
              className="px-10 py-4.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 rounded-2xl font-bold text-xs uppercase tracking-widest backdrop-blur-md hover:border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Explore Marketplace</span>
            </button>
          </div>
        </section>

        {/* Live Campus Glass Stats Widget */}
        <section className="w-full max-w-5xl mx-auto mb-24 z-10">
          <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-6 sm:p-8 rounded-[36px] shadow-2xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6">
              <div>
                <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em] mb-1">
                  Marketplace Metrics
                </div>
                <div className="text-3xl sm:text-4xl font-black font-mono tracking-tighter text-white">
                  190+ <span className="text-sm sm:text-base font-normal text-slate-500 font-sans">sales & trades/month</span>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <div className="text-green-400 text-sm font-bold font-mono flex items-center gap-1">
                  <Activity className="w-4 h-4" />
                  <span>+18.6%</span>
                </div>
                <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                  Vs Last Semester
                </div>
              </div>
            </div>

            {/* Velocity Bar visualization */}
            <div className="h-16 flex items-end gap-1.5 mb-6">
              <div className="flex-1 bg-white/5 h-[35%] rounded-t-sm" />
              <div className="flex-1 bg-white/10 h-[50%] rounded-t-sm" />
              <div className="flex-1 bg-indigo-500/20 h-[65%] rounded-t-sm" />
              <div className="flex-1 bg-indigo-500/40 h-[45%] rounded-t-sm" />
              <div className="flex-1 bg-indigo-500/60 h-[75%] rounded-t-sm" />
              <div className="flex-1 bg-indigo-500 h-[100%] rounded-t-sm shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
              <div className="flex-1 bg-indigo-500/50 h-[80%] rounded-t-sm" />
              <div className="flex-1 bg-white/10 h-[60%] rounded-t-sm" />
              <div className="flex-1 bg-white/5 h-[40%] rounded-t-sm" />
              <div className="flex-1 bg-white/10 h-[70%] rounded-t-sm" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 bg-white/5 rounded-2xl border border-white/5">
                <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Active Peers</div>
                <div className="text-lg font-bold font-mono text-white">4,820</div>
              </div>
              <div className="p-3.5 bg-white/5 rounded-2xl border border-white/5">
                <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Items Listed</div>
                <div className="text-lg font-bold font-mono text-white">1,248</div>
              </div>
              <div className="p-3.5 bg-white/5 rounded-2xl border border-white/5">
                <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Exchange Rate</div>
                <div className="text-lg font-bold font-mono text-green-400">99.4%</div>
              </div>
              <div className="p-3.5 bg-white/5 rounded-2xl border border-white/5">
                <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Avg Response</div>
                <div className="text-lg font-bold font-mono text-indigo-300">&lt; 4 min</div>
              </div>
            </div>
          </div>
        </section>

        {/* Highlights Section (Platform Capabilities) */}
        <section className="w-full max-w-6xl mx-auto mb-28 z-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-3">
            <div>
              <h2 className="font-display text-3xl font-black tracking-tight text-white">
                What do we offer?
              </h2>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              ZERO COMMISSION • STUDENT-TO-STUDENT DIRECT
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Highlight Card 1 - Resources */}
            <div
              onClick={() => {
                setSelectedCategory('Resources');
                navigateTo('feed');
              }}
              className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 hover:border-indigo-500/40 hover:bg-white/[0.06] rounded-[32px] p-7 flex flex-col gap-4 transition-all duration-300 group cursor-pointer shadow-2xl"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-500/20 group-hover:border-indigo-400/40 transition-all">
                <Package className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-white tracking-tight">Resources</h3>
              <p className="font-body text-sm text-slate-400 leading-relaxed font-normal">
                Trade physical gear, textbooks, keyboards, monitors, and dorm furniture with verified students on campus.
              </p>
              <div className="mt-auto pt-3 flex items-center gap-2 text-xs font-bold font-mono uppercase tracking-wider text-indigo-400 group-hover:translate-x-1 transition-transform">
                <span>Explore Resources</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Highlight Card 2 - Services */}
            <div
              onClick={() => {
                setSelectedCategory('Services');
                navigateTo('feed');
              }}
              className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 hover:border-fuchsia-500/40 hover:bg-white/[0.06] rounded-[32px] p-7 flex flex-col gap-4 transition-all duration-300 group cursor-pointer shadow-2xl"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-fuchsia-400 group-hover:scale-110 group-hover:bg-fuchsia-500/20 group-hover:border-fuchsia-400/40 transition-all">
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-white tracking-tight">Services</h3>
              <p className="font-body text-sm text-slate-400 leading-relaxed font-normal">
                Hire local peer talent for STEM tutoring, design reviews, photography, code debugging, and thesis editing.
              </p>
              <div className="mt-auto pt-3 flex items-center gap-2 text-xs font-bold font-mono uppercase tracking-wider text-fuchsia-400 group-hover:translate-x-1 transition-transform">
                <span>Find Services</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Highlight Card 3 - Opportunities */}
            <div
              onClick={() => {
                setSelectedCategory('Opportunities');
                navigateTo('feed');
              }}
              className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 hover:border-green-500/40 hover:bg-white/[0.06] rounded-[32px] p-7 flex flex-col gap-4 transition-all duration-300 group cursor-pointer shadow-2xl"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-green-400 group-hover:scale-110 group-hover:bg-green-500/20 group-hover:border-green-400/40 transition-all">
                <Rocket className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-white tracking-tight">Opportunities</h3>
              <p className="font-body text-sm text-slate-400 leading-relaxed font-normal">
                Recruit teammates for collegiate hackathons, join research lab projects, or organize student study pods.
              </p>
              <div className="mt-auto pt-3 flex items-center gap-2 text-xs font-bold font-mono uppercase tracking-wider text-green-400 group-hover:translate-x-1 transition-transform">
                <span>Discover Teams</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </section>

        {/* Trending Section */}
        <section className="w-full max-w-6xl mx-auto mb-20 z-10">
          <div className="flex justify-between items-end mb-8">
            <div>
              <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em] mb-1">
                Active Listings
              </div>
              <h2 className="font-display text-3xl font-black tracking-tight text-white">
                Trending on Campus
              </h2>
            </div>
            <button
              onClick={() => navigateTo('feed')}
              className="text-xs font-mono uppercase tracking-wider text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1.5 font-bold cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingListings.map((item) => (
              <div
                key={item.id}
                onClick={() => navigateTo('listing_detail', item.id)}
                className="bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-white/25 rounded-3xl p-4 flex flex-col gap-3 transition-all duration-300 group cursor-pointer hover:-translate-y-1 shadow-xl"
              >
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950 mb-1">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="object-cover w-full h-full opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                  />
                  {item.hotBadge && (
                    <div className="absolute top-2.5 right-2.5 bg-fuchsia-600/90 text-white font-mono text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-lg backdrop-blur-md">
                      {item.hotBadge}
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-start">
                  <div className="pr-2 min-w-0">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-indigo-300 mb-1 block">
                      {item.subcategory || item.category}
                    </span>
                    <h4 className="font-display text-sm font-semibold text-slate-100 leading-snug line-clamp-1 group-hover:text-indigo-300 transition-colors">
                      {item.title}
                    </h4>
                  </div>
                  <span
                    className={`font-mono text-xs font-bold px-2.5 py-1 rounded-xl border shrink-0 ${
                      item.price === 0
                        ? 'text-green-400 bg-green-500/10 border-green-500/30'
                        : 'text-slate-100 bg-white/5 border-white/10'
                    }`}
                  >
                    {item.price === 0 ? 'Free' : `₹${item.price.toLocaleString('en-IN')}${item.priceUnit || ''}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Frosted Glass Footer */}
      <footer className="w-full border-t border-white/10 bg-black/40 backdrop-blur-2xl py-8 px-6 sm:px-10 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-gradient-to-tr from-indigo-500 to-fuchsia-500 rounded-lg flex items-center justify-center shadow-md shadow-indigo-500/20">
              <div className="w-3 h-3 border-2 border-white/90 rounded-sm rotate-45" />
            </div>
            <span className="text-lg font-black tracking-tighter italic text-white">
              REXCHANGE<span className="text-indigo-400">.</span>
            </span>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">
            <button onClick={() => openAuth('login')} className="hover:text-white transition-colors cursor-pointer">
              Student Sign In
            </button>
            <span>•</span>
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <span>•</span>
            <a href="#" className="hover:text-white transition-colors">
              Campus Guidelines
            </a>
          </div>

          <div className="flex items-center gap-3 text-slate-400">
            <button
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                alert('RExchange link copied to clipboard!');
              }}
              className="hover:text-white flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:border-white/20 transition-all cursor-pointer"
              title="Share"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
            <a
              href="mailto:support@rexchange.campus"
              className="hover:text-white flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:border-white/20 transition-all"
              title="Contact Support"
            >
              <Mail className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
