import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { allRecipes } from './data/cookbookDataSource';
import { CulinaryMonochromeBackground } from './components/CulinaryMonochromeBackground';
import { GlobalTimerBar } from './components/GlobalTimerBar';
import { Navigation } from './components/Navigation';
import { PrintExportModal } from './components/PrintExportModal';
import { AuthProvider } from './context/AuthContext';
import { CommunityProvider } from './context/CommunityContext';
import { CookbookProvider, useCookbook } from './context/CookbookContext';
import { AddRecipeScreen } from './screens/AddRecipeScreen';
import { AlphabeticalIndexScreen } from './screens/AlphabeticalIndexScreen';
import { HeritageNotesScreen } from './screens/HeritageNotesScreen';
import { PantryMatcherScreen } from './screens/PantryMatcherScreen';
import { RecipeDetailScreen } from './screens/RecipeDetailScreen';
import { RecipeListScreen } from './screens/RecipeListScreen';
import { ShoppingListScreen } from './screens/ShoppingListScreen';
import { InstallPrompt } from './components/InstallPrompt';
import { AppUpdateProvider } from './context/AppUpdateContext';
import { UpdateBanner } from './components/UpdateBanner';
import { WifiOff, CheckCircle2, X } from 'lucide-react';
import { ScreenDestination } from './types';

const TAB_ORDER: Array<'explore' | 'pantry' | 'index' | 'heritage'> = [
  'explore',
  'pantry',
  'index',
  'heritage'
];

const MainContent: React.FC = () => {
  const { currentScreen, navigateTo } = useCookbook();
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  // Screen key for motion animation
  const screenKey =
    currentScreen.type === 'detail'
      ? `detail-${currentScreen.recipeId}`
      : currentScreen.type;

  // Swipe navigation between top-level tabs on mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    // Only handle top-level tabs swipe at the container level; detail screen has its own handler
    if (currentScreen.type === 'detail') return;
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (currentScreen.type === 'detail') return;
    if (touchStartX.current === null || touchStartY.current === null) return;

    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    // Must be predominantly horizontal swipe with at least 75px distance
    if (Math.abs(deltaX) > 75 && Math.abs(deltaY) < 55) {
      const currentTab = currentScreen.type as 'explore' | 'pantry' | 'index' | 'heritage';
      const currentIndex = TAB_ORDER.indexOf(currentTab);

      if (currentIndex !== -1) {
        if (deltaX < 0 && currentIndex < TAB_ORDER.length - 1) {
          // Swipe Left -> Next Tab
          navigateTo({ type: TAB_ORDER[currentIndex + 1] });
        } else if (deltaX > 0 && currentIndex > 0) {
          // Swipe Right -> Previous Tab
          navigateTo({ type: TAB_ORDER[currentIndex - 1] });
        }
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  return (
    <main
      className="min-h-screen relative z-10 overflow-x-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={screenKey}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="w-full"
        >
          {currentScreen.type === 'explore' && <RecipeListScreen />}
          {currentScreen.type === 'detail' && (
            <RecipeDetailScreen recipeId={currentScreen.recipeId} />
          )}
          {currentScreen.type === 'pantry' && <PantryMatcherScreen />}
          {currentScreen.type === 'index' && <AlphabeticalIndexScreen />}
          {currentScreen.type === 'heritage' && <HeritageNotesScreen />}
          {currentScreen.type === 'addRecipe' && <AddRecipeScreen />}
          {currentScreen.type === 'shopping' && <ShoppingListScreen />}
        </motion.div>
      </AnimatePresence>

      <GlobalTimerBar />
      <PrintExportModal />
    </main>
  );
};

// Offline Status Indicator Banner
const OfflineStatusBar: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setIsDismissed(false);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setIsDismissed(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline || isDismissed) return null;

  return (
    <div
      id="offline_status_banner"
      className="bg-[#4A3B2C] text-[#FAF7F2] px-4 py-2 text-xs flex items-center justify-between shadow-md relative z-40"
    >
      <div className="flex items-center gap-2 max-w-4xl mx-auto w-full">
        <WifiOff className="w-4 h-4 text-amber-300 shrink-0" />
        <span>
          <strong>Offline Mode Active:</strong> All {allRecipes.length} recipes, pantry data, and your kitchen notes are safely cached offline.
        </span>
      </div>
      <button
        type="button"
        onClick={() => setIsDismissed(true)}
        className="text-[#FAF7F2]/80 hover:text-white p-1"
        title="Dismiss notice"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export function App() {
  return (
    <AppUpdateProvider>
    <AuthProvider>
      <CommunityProvider>
        <CookbookProvider>
          <div className="relative min-h-screen bg-[#F4EEE5] text-[#261D16]">
            <CulinaryMonochromeBackground />
            <OfflineStatusBar />
            <Navigation />
            <UpdateBanner />
            <InstallPrompt />
            <MainContent />
          </div>
        </CookbookProvider>
      </CommunityProvider>
    </AuthProvider>
    </AppUpdateProvider>
  );
}

export default App;
