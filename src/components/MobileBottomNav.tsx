import React from 'react';
import { useApp } from '../context/AppContext';
import { LayoutGrid, PlusCircle, Users, MessageSquare } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { currentScreen, navigateTo } = useApp();

  if (currentScreen === 'landing' || currentScreen === 'auth') {
    return null;
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-slate-950/80 backdrop-blur-2xl border-t border-white/10 shadow-[0_-10px_30px_rgba(0,0,0,0.6)]">
      <div className="flex justify-around items-center px-4 py-2.5 w-full">
        <button
          onClick={() => navigateTo('feed')}
          className={`flex flex-col items-center justify-center transition-colors ${
            currentScreen === 'feed'
              ? 'text-indigo-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <LayoutGrid className="w-5 h-5 mb-1" />
          <span className="font-mono text-[9px] uppercase tracking-wider">Feed</span>
        </button>

        <button
          onClick={() => navigateTo('create')}
          className="flex flex-col items-center justify-center bg-indigo-600 text-white rounded-xl px-4 py-1.5 hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/40"
        >
          <PlusCircle className="w-5 h-5 mb-0.5" />
          <span className="font-mono text-[9px] font-bold uppercase tracking-wider">Create</span>
        </button>

        <button
          onClick={() => navigateTo('dashboard')}
          className={`flex flex-col items-center justify-center transition-colors ${
            currentScreen === 'dashboard' || currentScreen === 'profile'
              ? 'text-indigo-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-5 h-5 mb-1" />
          <span className="font-mono text-[9px] uppercase tracking-wider">Community</span>
        </button>

        <button
          onClick={() => navigateTo('messages')}
          className={`flex flex-col items-center justify-center transition-colors ${
            currentScreen === 'messages'
              ? 'text-indigo-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <MessageSquare className="w-5 h-5 mb-1" />
          <span className="font-mono text-[9px] uppercase tracking-wider">Messages</span>
        </button>
      </div>
    </nav>
  );
};
