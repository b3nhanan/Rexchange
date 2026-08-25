import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Lock, Mail, ShieldCheck, ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react';
import { api } from '../lib/api';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuth, authMode, navigateTo, setUser } = useApp();

  const [mode, setMode] = useState<'login' | 'signup'>(authMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [year, setYear] = useState('Senior');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      if (mode === 'signup') {
        const res = await api.auth.signup({
          name: fullName || 'Campus Student',
          email: email || 'student@college.edu',
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
            college: res.user.college || 'State University',
            year: res.user.year || year || 'Freshman',
            department: res.user.department || department || 'General Studies',
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
          email: email || 'student@college.edu',
          password,
        });
        if (res.user) {
          const loggedInUser: any = {
            id: res.user.id,
            name: res.user.name,
            email: res.user.email,
            avatar: res.user.avatar || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
            college: res.user.college || 'State University',
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
      setErrorMsg(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSSO = async () => {
    setIsLoading(true);
    try {
      const res = await api.auth.signup({
        name: 'Alex Rivers',
        email: 'alex.rivers@college.edu',
        department: 'Computer Science',
        year: 'Senior',
      });
      if (res.user) {
        setUser({
          id: res.user.id,
          name: res.user.name,
          email: res.user.email,
          avatar: res.user.avatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
          college: res.user.college || 'State University',
          year: res.user.year || 'Senior',
          department: res.user.department || 'Computer Science',
          bio: res.user.bio || 'Campus enthusiast.',
          rating: 0.0,
          reviewsCount: 0,
          karmaPoints: 0,
          tradesCompleted: 0,
          rank: 'New Member',
          verified: true,
          isCurrentUser: true,
          badges: [],
        });
      }
      closeAuth();
      navigateTo('feed');
    } catch {
      closeAuth();
      navigateTo('feed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xl animate-in fade-in">
      <div className="relative w-full max-w-md bg-slate-900/80 backdrop-blur-2xl border border-white/15 rounded-[36px] p-6 sm:p-8 shadow-2xl overflow-hidden dot-pattern">
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
            {mode === 'login' ? 'Campus Student Sign In' : 'Create Your Student Account'}
          </p>
        </div>

        {/* Auth Mode Toggle */}
        <div className="flex bg-white/5 rounded-2xl p-1 border border-white/10 mb-6 font-mono text-xs">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-2.5 rounded-xl font-bold uppercase tracking-wider transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('signup')}
            className={`flex-1 py-2.5 rounded-xl font-bold uppercase tracking-wider transition-all cursor-pointer ${
              mode === 'signup'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-xs text-red-300 font-mono">
            {errorMsg}
          </div>
        )}

        {/* Social SSO Buttons */}
        <div className="space-y-2.5 mb-5 font-mono text-xs">
          <button
            onClick={handleSSO}
            type="button"
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 hover:border-white/20 transition-all font-medium cursor-pointer"
          >
            <span>Continue with Student Google (.edu)</span>
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">or email credentials</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Alex Rivers"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:bg-white/[0.08]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-1">
                    Major / Dept
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="Computer Science"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-1">
                    Year
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
                  >
                    <option value="Freshman">Freshman</option>
                    <option value="Sophomore">Sophomore</option>
                    <option value="Junior">Junior</option>
                    <option value="Senior">Senior</option>
                    <option value="Grad Student">Grad Student</option>
                  </select>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-1">
              Campus Email (.edu)
            </label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex.rivers@college.edu"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:bg-white/[0.08]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-9 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:bg-white/[0.08]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-widest shadow-2xl shadow-indigo-600/40 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Verification Note */}
        <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-green-400" />
          <span>Automatic campus verification via accredited domain</span>
        </div>
      </div>
    </div>
  );
};
