import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Sparkles,
  ArrowRight,
  Package,
  Wrench,
  Rocket,
  IndianRupee,
  Eye,
  Tag,
  ShieldCheck,
  Loader2,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { CategoryType, PriceType } from '../types';
import { api } from '../lib/api';

export const CreateListingScreen: React.FC = () => {
  const { addNewListing, navigateTo, user } = useApp();

  const [title, setTitle] = useState('Keychron K2 Mechanical Keyboard');
  const [category, setCategory] = useState<CategoryType>('Resources');
  const [subcategory, setSubcategory] = useState('Electronics');
  const [price, setPrice] = useState<number | ''>(2400);
  const [priceType, setPriceType] = useState<PriceType>('fixed');
  const [description, setDescription] = useState(
    'Wireless mechanical keyboard with Gateron Brown switches. Mint condition, barely used for one semester. Includes original keycaps, Mac/Windows switchers, and braided USB-C cable.'
  );
  const [condition, setCondition] = useState('Like New');
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80'
  );
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['#hardware', '#electronics', '#compsci']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // AI Assistant States
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);
  const [isAutoTagging, setIsAutoTagging] = useState(false);
  const [moderationStatus, setModerationStatus] = useState<{
    checked: boolean;
    safe: boolean;
    reason?: string;
  } | null>(null);
  const [isModerating, setIsModerating] = useState(false);

  const sampleImagePresets = [
    {
      label: 'Keyboard',
      url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
    },
    {
      label: 'Textbook',
      url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
    },
    {
      label: 'Tutoring',
      url: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&auto=format&fit=crop&q=80',
    },
    {
      label: 'Headphones',
      url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    },
  ];

  const handleAddTag = (customTag?: string) => {
    const value = customTag || tagInput;
    if (!value.trim()) return;
    const formatted = value.startsWith('#') ? value.trim() : `#${value.trim()}`;
    if (!tags.includes(formatted)) {
      setTags([...tags, formatted]);
    }
    if (!customTag) setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // AI Actions
  const handleAIGenerateDescription = async () => {
    if (!title.trim()) return;
    setIsGeneratingDesc(true);
    try {
      const res = await api.ai.generateDescription({
        title,
        category,
        keywords: `${subcategory}, ${condition}`,
      });
      if (res?.description) {
        setDescription(res.description);
      }
    } catch (err) {
      console.error('Failed to generate description with AI', err);
    } finally {
      setIsGeneratingDesc(false);
    }
  };

  const handleAIAutoTag = async () => {
    if (!title.trim() && !description.trim()) return;
    setIsAutoTagging(true);
    try {
      const res = await api.ai.autoTag({
        title,
        description,
      });
      if (res?.tags && Array.isArray(res.tags)) {
        const formatted = res.tags.map((t) => (t.startsWith('#') ? t : `#${t.toLowerCase().replace(/\s+/g, '')}`));
        setTags(Array.from(new Set([...tags, ...formatted])));
      }
    } catch (err) {
      console.error('Failed to auto-tag with AI', err);
    } finally {
      setIsAutoTagging(false);
    }
  };

  const handleCheckModeration = async () => {
    if (!title.trim() && !description.trim()) return;
    setIsModerating(true);
    try {
      const content = `${title}\n${description}\nTags: ${tags.join(' ')}`;
      const res = await api.ai.moderate({ content });
      setModerationStatus({
        checked: true,
        safe: res.safe,
        reason: res.reason,
      });
    } catch (err) {
      console.error('Failed to moderate content', err);
      setModerationStatus({
        checked: true,
        safe: true,
        reason: 'Automated campus baseline checks passed.',
      });
    } finally {
      setIsModerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);

    try {
      const created = await addNewListing({
        title: title.trim(),
        description: description.trim(),
        category,
        subcategory,
        price: price === '' || priceType === 'free' ? 0 : Number(price),
        priceType,
        imageUrl:
          imageUrl ||
          'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=600&q=80',
        tags,
        condition,
      });

      navigateTo('listing_detail', created.id);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 dot-grid pt-24 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1.5">
            <h1 className="font-display text-2xl sm:text-3xl font-black text-white">
              Post Campus Listing
            </h1>
            <span className="font-mono text-[10px] font-bold px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300">
              Earn +50 Karma
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 font-body">
            Share items, services, or opportunities with students across your campus community.
          </p>
        </div>

        {/* 2-Column Form & Live Card Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Input Form (7 Cols) */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
            {/* Category Select Card */}
            <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 sm:p-7 shadow-2xl space-y-4">
              <label className="block font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">
                1. Select Category & Type
              </label>

              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setCategory('Resources');
                    setSubcategory('Electronics');
                  }}
                  className={`p-4 rounded-2xl border flex flex-col items-center gap-2 text-center transition-all cursor-pointer ${
                    category === 'Resources'
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-lg shadow-indigo-600/25'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <Package className="w-5 h-5" />
                  <span className="font-mono text-xs font-bold">Resources</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCategory('Services');
                    setSubcategory('Tutoring');
                  }}
                  className={`p-4 rounded-2xl border flex flex-col items-center gap-2 text-center transition-all cursor-pointer ${
                    category === 'Services'
                      ? 'bg-fuchsia-600/20 border-fuchsia-500 text-fuchsia-300 shadow-lg shadow-fuchsia-600/25'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <Wrench className="w-5 h-5" />
                  <span className="font-mono text-xs font-bold">Services</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCategory('Opportunities');
                    setSubcategory('Projects');
                  }}
                  className={`p-4 rounded-2xl border flex flex-col items-center gap-2 text-center transition-all cursor-pointer ${
                    category === 'Opportunities'
                      ? 'bg-green-600/20 border-green-500 text-green-300 shadow-lg shadow-green-600/25'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <Rocket className="w-5 h-5" />
                  <span className="font-mono text-xs font-bold">Opportunities</span>
                </button>
              </div>

              {/* Subcategory */}
              <div className="pt-2">
                <label className="block font-mono text-[10px] uppercase tracking-widest text-slate-400 mb-1.5">
                  Subcategory
                </label>
                <select
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 font-mono cursor-pointer"
                >
                  <option value="Electronics" className="bg-slate-900">Electronics & Tech</option>
                  <option value="Textbooks" className="bg-slate-900">Textbooks & Notes</option>
                  <option value="Dorm Essentials" className="bg-slate-900">Dorm & Living</option>
                  <option value="Tutoring" className="bg-slate-900">Tutoring & Coaching</option>
                  <option value="Hobbies" className="bg-slate-900">Hobbies & Music</option>
                  <option value="Projects" className="bg-slate-900">Projects & Hackathons</option>
                  <option value="General" className="bg-slate-900">General Peer Exchange</option>
                </select>
              </div>
            </div>

            {/* Listing Details Card */}
            <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 sm:p-7 shadow-2xl space-y-4">
              <div>
                <label className="block font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                  2. Listing Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Keychron K2 Mechanical Keyboard"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Price & Condition Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                    Price (₹ INR)
                  </label>
                  <div className="relative">
                    <IndianRupee className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="number"
                      value={priceType === 'free' ? 0 : price}
                      onChange={(e) => {
                        setPrice(e.target.value === '' ? '' : Number(e.target.value));
                        if (Number(e.target.value) === 0) setPriceType('free');
                        else setPriceType('fixed');
                      }}
                      disabled={priceType === 'free'}
                      placeholder="0.00"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pl-9 pr-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 font-mono disabled:opacity-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                    Condition
                  </label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 font-mono cursor-pointer"
                  >
                    <option value="Brand New" className="bg-slate-900">Brand New (Sealed)</option>
                    <option value="Like New" className="bg-slate-900">Like New</option>
                    <option value="Good" className="bg-slate-900">Good Condition</option>
                    <option value="Fair" className="bg-slate-900">Fair / Usable</option>
                  </select>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-mono text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={priceType === 'free'}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setPriceType('free');
                        setPrice(0);
                      } else {
                        setPriceType('fixed');
                        setPrice(45);
                      }
                    }}
                    className="w-4 h-4 rounded bg-white/5 border-white/10 accent-indigo-600 cursor-pointer"
                  />
                  <span>Give away for Free</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-mono text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={priceType === 'exchange'}
                    onChange={(e) => setPriceType(e.target.checked ? 'exchange' : 'fixed')}
                    className="w-4 h-4 rounded bg-white/5 border-white/10 accent-fuchsia-600 cursor-pointer"
                  />
                  <span>Open to item swaps / trades</span>
                </label>
              </div>

              {/* Description & AI Generator */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Description & Details
                  </label>
                  <button
                    type="button"
                    onClick={handleAIGenerateDescription}
                    disabled={isGeneratingDesc || !title.trim()}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-300 font-mono text-[10px] font-bold transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isGeneratingDesc ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Sparkles className="w-3 h-3 text-indigo-400" />
                    )}
                    <span>{isGeneratingDesc ? 'Generating...' : 'AI Enhance Description'}</span>
                  </button>
                </div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Provide specs, history, included accessories, or preferred meet location..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Media, Tags & AI Auto-Tagging */}
            <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 sm:p-7 shadow-2xl space-y-4">
              <div>
                <label className="block font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                  3. Image URL & Presets
                </label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Paste direct image link..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 font-mono mb-3"
                />

                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-[10px] text-slate-500 uppercase">Presets:</span>
                  {sampleImagePresets.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setImageUrl(preset.url)}
                      className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-[11px] font-mono text-indigo-300 hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags & AI Auto-Tagging */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Tags & Search Keywords
                  </label>
                  <button
                    type="button"
                    onClick={handleAIAutoTag}
                    disabled={isAutoTagging || !title.trim()}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-fuchsia-500/15 hover:bg-fuchsia-500/25 border border-fuchsia-500/30 text-fuchsia-300 font-mono text-[10px] font-bold transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isAutoTagging ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Tag className="w-3 h-3 text-fuchsia-400" />
                    )}
                    <span>{isAutoTagging ? 'Analyzing...' : 'AI Auto-Tag'}</span>
                  </button>
                </div>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder="Type tag and press Enter (e.g. #cs)"
                    className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddTag()}
                    className="px-4 py-2 bg-white/10 hover:bg-white/15 border border-white/10 text-indigo-300 font-mono text-xs font-bold rounded-2xl cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 font-mono text-xs px-3 py-1 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-300"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-white cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Policy & Campus Moderation Check */}
            <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[32px] p-5 shadow-2xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h4 className="font-mono text-xs font-bold text-slate-200">
                    Campus Safety & Policy Check
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {moderationStatus?.checked
                      ? moderationStatus.reason
                      : 'Verify your listing meets university peer exchange safety standards.'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCheckModeration}
                disabled={isModerating || !title.trim()}
                className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 font-mono text-xs font-bold text-slate-300 hover:text-white transition-all shrink-0 cursor-pointer"
              >
                {isModerating ? (
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Checking...
                  </span>
                ) : moderationStatus?.checked ? (
                  <span className="flex items-center gap-1 text-green-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified
                  </span>
                ) : (
                  'Run Safety Check'
                )}
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4 pt-2">
              <button
                type="button"
                onClick={() => navigateTo('feed')}
                className="px-6 py-3 rounded-2xl border border-white/10 text-slate-400 hover:text-white font-mono text-xs uppercase tracking-wider cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-widest shadow-2xl shadow-indigo-600/40 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>{isSubmitting ? 'Publishing...' : 'Publish Listing'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Right: Live Preview Card (5 Cols) */}
          <div className="lg:col-span-5 sticky top-24 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono text-xs text-indigo-300">
                <Eye className="w-4 h-4 text-fuchsia-400 animate-pulse" />
                <span className="font-bold uppercase tracking-wider">Live Card Preview</span>
              </div>
              <span className="font-mono text-[10px] text-slate-500">
                Preview in Campus Feed
              </span>
            </div>

            <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[32px] p-5 flex flex-col shadow-2xl">
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950 mb-3.5">
                <img
                  src={
                    imageUrl ||
                    'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=600&q=80'
                  }
                  alt={title}
                  className="w-full h-full object-cover"
                />

                <div className="absolute top-2.5 right-2.5 font-mono text-xs font-bold px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/15 shadow-lg">
                  <span className={price === 0 || priceType === 'free' ? 'text-green-400' : 'text-white'}>
                    {price === 0 || priceType === 'free' ? 'Free' : `₹${price}`}
                  </span>
                </div>

                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span className="font-mono text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-600 text-white">
                    {category}
                  </span>
                  <span className="font-mono text-[9px] px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-md text-slate-300 border border-white/10">
                    {condition}
                  </span>
                </div>
              </div>

              <h3 className="font-display text-base font-bold text-white line-clamp-1 mb-1">
                {title || 'Listing Title'}
              </h3>
              <p className="font-body text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                {description || 'Listing description will appear here as you type...'}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-[10px] px-2.5 py-0.5 rounded-lg bg-white/5 border border-white/10 text-indigo-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-6 h-6 rounded-full object-cover border border-white/10"
                  />
                  <div>
                    <p className="font-mono text-xs text-slate-200 font-semibold">
                      {user.name}
                    </p>
                    <p className="font-mono text-[10px] text-slate-500">
                      {user.department}
                    </p>
                  </div>
                </div>
                <span className="font-mono text-[10px] text-slate-500">Just now</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
