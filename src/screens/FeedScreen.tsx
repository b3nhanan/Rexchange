import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Package,
  Wrench,
  Rocket,
  Search,
  Filter,
  Bookmark,
  PlusCircle,
  SlidersHorizontal,
  ChevronDown,
  Sparkles,
  Layers,
} from 'lucide-react';
import { CategoryType } from '../types';

export const FeedScreen: React.FC = () => {
  const {
    filteredListings,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    selectedSubcategory,
    setSelectedSubcategory,
    savedListingIds,
    toggleSaveListing,
    navigateTo,
  } = useApp();

  const [sortBy, setSortBy] = useState<'newest' | 'price_low' | 'price_high'>('newest');
  const [filterCondition, setFilterCondition] = useState<string>('all');

  const categories: { label: string; value: CategoryType | 'All'; icon: React.FC<{ className?: string }> }[] = [
    { label: 'All Items', value: 'All', icon: Layers },
    { label: 'Resources', value: 'Resources', icon: Package },
    { label: 'Services', value: 'Services', icon: Wrench },
    { label: 'Opportunities', value: 'Opportunities', icon: Rocket },
  ];

  const subcategoriesMap: Record<CategoryType | 'All', string[]> = {
    All: ['All Subcategories', 'Electronics', 'Textbooks', 'Tutoring', 'Dorm Essentials', 'Projects'],
    Resources: ['All Subcategories', 'Electronics', 'Textbooks', 'Dorm Essentials', 'Hobbies', 'Clothing'],
    Services: ['All Subcategories', 'Tutoring', 'Coding & Tech', 'Photography', 'Moving & Labor', 'Design'],
    Opportunities: ['All Subcategories', 'Projects & Hackathons', 'Study Groups', 'Lab Research', 'Club Events'],
  };

  // Filter listings by condition & sort
  let displayedListings = (filteredListings || []).filter((item) => {
    if (filterCondition !== 'all' && item.condition) {
      return item.condition.toLowerCase().includes(filterCondition.toLowerCase());
    }
    return true;
  });

  if (sortBy === 'price_low') {
    displayedListings = [...displayedListings].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price_high') {
    displayedListings = [...displayedListings].sort((a, b) => b.price - a.price);
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 dot-grid pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Feed Header Banner */}
        <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 sm:p-8 mb-8 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-72 h-72 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full backdrop-blur-md mb-2">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_6px_#4ade80]" />
                <span className="text-[10px] font-bold font-mono uppercase tracking-widest text-indigo-300">
                  Campus Marketplace Live
                </span>
              </div>
              <h1 className="font-display text-2xl sm:text-4xl font-black tracking-tight text-white">
                Discover & Trade on Campus
              </h1>
              <p className="font-body text-xs sm:text-sm text-slate-400 mt-1 max-w-xl font-medium">
                Direct peer exchanges with zero platform fees. Verified students only.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigateTo('create')}
                className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/35 transition-all flex items-center gap-2 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Post Listing</span>
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills & Search Controls */}
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center mb-6">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => {
                    setSelectedCategory(cat.value);
                    setSelectedSubcategory(null);
                  }}
                  className={`px-4 py-2.5 rounded-2xl font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 border border-indigo-500'
                      : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 border border-white/10 backdrop-blur-md'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search, Filter & Sort Controls */}
          <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
            {/* Search Input for Mobile/Tablet */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search listings..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-9 pr-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 focus:bg-white/[0.08] backdrop-blur-md"
              />
            </div>

            {/* Sort Select */}
            <div className="relative">
              <select
                aria-label="Sort listings by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="appearance-none bg-white/5 border border-white/10 text-slate-300 hover:text-white rounded-2xl pl-3.5 pr-8 py-2 text-xs font-mono focus:outline-none focus:border-indigo-500 backdrop-blur-md cursor-pointer"
              >
                <option value="newest" className="bg-slate-900 text-slate-200">Newest First</option>
                <option value="price_low" className="bg-slate-900 text-slate-200">Price: Low to High</option>
                <option value="price_high" className="bg-slate-900 text-slate-200">Price: High to Low</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Subcategories Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide text-xs font-mono">
          <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px] shrink-0 mr-1">
            Filter:
          </span>
          {subcategoriesMap[selectedCategory].map((sub) => {
            const isSelected =
              sub === 'All Subcategories'
                ? !selectedSubcategory
                : selectedSubcategory === sub;

            return (
              <button
                key={sub}
                onClick={() => {
                  if (sub === 'All Subcategories') {
                    setSelectedSubcategory(null);
                  } else {
                    setSelectedSubcategory(sub);
                  }
                }}
                className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-white/15 text-white border border-white/25 font-bold shadow-inner'
                    : 'bg-white/[0.03] text-slate-400 hover:text-slate-200 border border-white/5 hover:border-white/15'
                }`}
              >
                {sub}
              </button>
            );
          })}
        </div>

        {/* Listings Grid */}
        {displayedListings.length === 0 ? (
          <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[32px] p-16 text-center max-w-lg mx-auto space-y-4 my-12 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 mx-auto">
              <Search className="w-7 h-7" />
            </div>
            <h3 className="font-display text-lg font-bold text-white">No listings found</h3>
            <p className="font-body text-xs text-slate-400 leading-relaxed font-medium">
              We couldn't find any items matching your current filters. Try changing category or searching with different keywords.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedSubcategory(null);
                setSearchQuery('');
              }}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedListings.map((item) => {
              const isSaved = savedListingIds.includes(item.id);

              return (
                <div
                  key={item.id}
                  className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 hover:border-white/25 rounded-3xl p-4 flex flex-col group transition-all duration-300 hover:-translate-y-1 shadow-xl hover:shadow-2xl relative"
                >
                  {/* Image Container with Floating Overlays */}
                  <div
                    onClick={() => navigateTo('listing_detail', item.id)}
                    className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950 mb-3 cursor-pointer"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                    />

                    {/* Price Pill */}
                    <div className="absolute top-2.5 right-2.5 bg-slate-950/80 backdrop-blur-md border border-white/15 px-3 py-1 rounded-full text-xs font-mono font-bold shadow-lg">
                      <span className={item.price === 0 ? 'text-green-400' : 'text-white'}>
                        {item.price === 0 ? 'Free' : `₹${item.price.toLocaleString('en-IN')}${item.priceUnit || ''}`}
                      </span>
                    </div>

                    {/* Category / Condition Badge */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="font-mono text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-600/90 backdrop-blur-md text-white">
                        {item.category}
                      </span>
                      {item.condition && (
                        <span className="font-mono text-[9px] px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-md text-slate-300 border border-white/10">
                          {item.condition}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Item Content */}
                  <div className="flex-1 flex flex-col">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-indigo-300">
                        {item.subcategory}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSaveListing(item.id);
                        }}
                        className={`p-1.5 rounded-full hover:bg-white/10 transition-colors ${
                          isSaved ? 'text-indigo-400' : 'text-slate-400 hover:text-white'
                        }`}
                        title={isSaved ? 'Remove from saved' : 'Save item'}
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-indigo-400' : ''}`} />
                      </button>
                    </div>

                    <h3
                      onClick={() => navigateTo('listing_detail', item.id)}
                      className="font-display text-sm font-semibold text-slate-100 line-clamp-1 mb-1.5 cursor-pointer hover:text-indigo-300 transition-colors"
                    >
                      {item.title}
                    </h3>

                    <p className="font-body text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4 font-normal">
                      {item.description}
                    </p>

                    {/* Footer: Seller & Response */}
                    <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <img
                          src={item.seller.avatar}
                          alt={item.seller.name}
                          className="w-5 h-5 rounded-full object-cover border border-white/10"
                        />
                        <span className="text-[11px] text-slate-300 font-medium font-body truncate max-w-[100px]">
                          {item.seller.name}
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-slate-500">
                        {item.createdAt}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
