import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AppProvider, useApp } from './context/AppContext';
import { TopNavigation } from './components/TopNavigation';
import { MobileBottomNav } from './components/MobileBottomNav';
import { AuthModal } from './components/AuthModal';
import { LandingScreen } from './screens/LandingScreen';
import { FeedScreen } from './screens/FeedScreen';
import { ListingDetailScreen } from './screens/ListingDetailScreen';
import { CreateListingScreen } from './screens/CreateListingScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { MessagesScreen } from './screens/MessagesScreen';

const MainContent: React.FC = () => {
  const { currentScreen, selectedListingId } = useApp();

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col font-['Inter',sans-serif] relative overflow-x-hidden selection:bg-indigo-600 selection:text-white">
      {/* Global Ambient Glow Orbs for Frosted Glass refraction */}
      <div className="fixed top-[-15%] left-[-10%] w-[55%] h-[55%] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-[-15%] right-[-10%] w-[55%] h-[55%] bg-fuchsia-600/12 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed top-[40%] right-[20%] w-[35%] h-[35%] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Top Navigation Bar */}
      <TopNavigation />

      {/* Main Content Area with Smooth Page Transition */}
      <main className="flex-1 relative z-10 overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentScreen === 'listing_detail' ? `listing_detail-${selectedListingId}` : currentScreen}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{
              duration: 0.22,
              ease: [0.25, 1, 0.5, 1],
            }}
            className="w-full"
          >
            {currentScreen === 'landing' && <LandingScreen />}
            {currentScreen === 'feed' && <FeedScreen />}
            {currentScreen === 'listing_detail' && <ListingDetailScreen />}
            {currentScreen === 'create' && <CreateListingScreen />}
            {currentScreen === 'dashboard' && <DashboardScreen />}
            {currentScreen === 'profile' && <ProfileScreen />}
            {currentScreen === 'messages' && <MessagesScreen />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile Navigation Dock */}
      <MobileBottomNav />

      {/* Authentication Modal */}
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
