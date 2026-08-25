import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Lock, Mail, ShieldCheck, ArrowRight, Eye, EyeOff, Loader2, User } from 'lucide-react';
import { api } from '../lib/api';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuth, authMode, navigateTo, setUser } = useApp();

  const [mode, setMode] = useState<'login' | 'signup'>(authMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [year, setYear] = useState('1st Year');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim()) {
      setErrorMsg('Please enter your campus email address.');
      return;
    }

    if (!password) {
      setErrorMsg('Please enter your account password.');
      return;
    }

    if (mode === 'signup' && password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    if (mode === 'signup' && !fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    setIsLoading(true);

    try {
      if (mode === 'signup') {
        const res = await api.auth.signup({
          name: fullName.trim(),
          email: email.trim().toLowerCase(),
          password,
          department,
          year,
        });
        if (res.user) {
          const newUserProfile: any = {
            id: res.user.id,
            name: res.user.name,
            email: res.user.email,
            avatar: res.user.avatar || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
            college: res.user.college || 'Engineering Campus',
            year: res.user.year || year,
            department: res.user.department || department,
            bio: res.user.bio || 'New student at campus marketplace.',
            rating: 0.0,
            reviewsCount: 0,
            karmaPoints: 0,
            tradesCompleted: 0,
            rank: 'New Member',
            verified: true,
            isCurrentUser: true,
            badges: [],
          };
          setUser(newUserProfile);
        }
      } else {
        const res = await api.auth.login({
          email: email.trim().toLowerCase(),
          password,
        });
        if (res.user) {
          const loggedInUser: any = {
            id: res.user.id,
            name: res.user.name,
            email: res.user.email,
            avatar: res.user.avatar || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
            college: res.user.college || 'Engineering Campus',
            year: res.user.year || 'Student',
            department: res.user.department || 'General Studies',
            bio: res.user.bio || '',
            rating: res.user.ratingAvg ?? 0,
            reviewsCount: res.user.reviewsCount ?? 0,
            karmaPoints: res.user.karma ?? 0,
            tradesCompleted: res.user.tradesCompleted ?? 0,
            rank: (res.user.tradesCompleted ?? 0) > 10 ? 'Top Trader' : (res.user.tradesCompleted ?? 0) > 0 ? 'Active Trader' : 'New Member',
            verified: true,
            isCurrentUser: true,
            badges: res.user.badges || [],
          };
          setUser(loggedInUser);
        }
      }
      closeAuth();
      navigateTo('feed');
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xl animate-in fade-in">
      <div className="relative w-full max-w-md bg-slate-900/90 backdrop-blur-2xl border border-white/15 rounded-[36px] p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Glow behind modal */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-indigo-600/25 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-fuchsia-600/20 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={closeAuth}
          className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <div className="w-3.5 h-3.5 border-2 border-white/90 rounded-sm rotate-45" />
            </div>
            <span className="text-2xl font-black tracking-tighter italic text-white">
              REXCHANGE<span className="text-indigo-400">.</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            {mode === 'login' ? 'Secure Campus Account Sign In' : 'Create Verified Student Account'}
          </p>
        </div>

        {/* Auth Mode Toggle */}
        <div className="flex bg-white/5 rounded-2xl p-1 border border-white/10 mb-6 font-mono text-xs">
          <button
            onClick={() => {
              setMode('login');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2.5 rounded-xl font-bold uppercase tracking-wider transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setMode('signup');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2.5 rounded-xl font-bold uppercase tracking-wider transition-all cursor-pointer ${
              mode === 'signup'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-5 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <span className="shrink-0 font-bold">⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-widest text-slate-400 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Rivers"
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white text-xs focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-600"
                />
                <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-widest text-slate-400 mb-1.5">
              Campus Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.name@campus.edu"
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white text-xs focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-600"
              />
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-mono uppercase tracking-widest text-slate-400">
                Password
              </label>
              {mode === 'signup' && (
                <span className="text-[10px] text-slate-500 font-mono">Min 6 characters</span>
              )}
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-11 py-3 bg-white/5 border border-white/10 rounded-2xl text-white text-xs focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-600"
              />
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {mode === 'signup' && (
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-1">
                  Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                >
                  <option value="Computer Science" className="bg-slate-900">CS & IT</option>
                  <option value="Electrical Engineering" className="bg-slate-900">Electrical Eng</option>
                  <option value="Mechanical Engineering" className="bg-slate-900">Mechanical Eng</option>
                  <option value="Business & Economics" className="bg-slate-900">Business / Econ</option>
                  <option value="Design & Architecture" className="bg-slate-900">Design</option>
                  <option value="General Studies" className="bg-slate-900">General Studies</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-1">
                  Year
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                >
                  <option value="1st Year" className="bg-slate-900">1st Year (Freshman)</option>
                  <option value="2nd Year" className="bg-slate-900">2nd Year (Sophomore)</option>
                  <option value="3rd Year" className="bg-slate-900">3rd Year (Junior)</option>
                  <option value="4th Year" className="bg-slate-900">4th Year (Senior)</option>
                  <option value="Postgraduate" className="bg-slate-900">Postgrad / Master</option>
                </select>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>{mode === 'login' ? 'Authenticate & Enter' : 'Complete Registration'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-center gap-2 text-[11px] text-slate-400 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-green-400" />
          <span>PBKDF2 Salted Encryption & Verified Session Tokens</span>
        </div>
      </div>
    </div>
  );
};
