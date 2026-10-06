import React from 'react';
import { useCookbook } from '../context/CookbookContext';
import { BookOpen, UtensilsCrossed, ArrowDownAZ, BookHeart, Printer, Plus, ShoppingCart } from 'lucide-react';
import { AuthButton } from './AuthButton';

export const Navigation: React.FC = () => {
  const { currentScreen, navigateTo, openPrintExport, shoppingList } = useCookbook();
  const toBuyCount = shoppingList.filter(i => !i.bought).length;

  const isExplore = currentScreen.type === 'explore';
  const isPantry = currentScreen.type === 'pantry';
  const isIndex = currentScreen.type === 'index';
  const isHeritage = currentScreen.type === 'heritage';
  const isDetail = currentScreen.type === 'detail';

  return (
    <>
      {/* Desktop & Mobile Header */}
      <header className="sticky top-0 z-40 bg-[#F4EEE5] [transform:translateZ(0)] border-b border-[#D2C4B1] px-4 sm:px-6 py-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          <div
            onClick={() => navigateTo({ type: 'explore' })}
            className="flex items-center gap-2.5 cursor-pointer group min-w-0"
          >
            <div className="w-8 h-8 shrink-0 rounded-full bg-[#4A3B2C] flex items-center justify-center text-[#FAF7F2] shadow-sm">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h1 className="font-serif-heritage text-lg sm:text-xl font-bold tracking-tight whitespace-nowrap truncate text-[#261D16] group-hover:text-[#4A3B2C] leading-none">
                Heritage Cookbook
              </h1>
              <p className="hidden lg:block text-[10px] text-[#7D6C5A] tracking-wider uppercase">
                Ruffolo-Vitale Family Heirloom
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden sm:flex items-center gap-1 bg-[#EBE3D6] p-1 rounded-xl border border-[#D2C4B1]">
            <button
              id="nav_explore_desktop"
              title="Cookbook"
              aria-label="Cookbook"
              onClick={() => navigateTo({ type: 'explore' })}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                isExplore
                  ? 'bg-[#4A3B2C] text-[#FAF7F2] shadow-sm'
                  : 'text-[#5C4E40] hover:text-[#261D16] hover:bg-[#E4DBCF]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Cookbook</span>
            </button>

            <button
              id="nav_pantry_desktop"
              title="Pantry Matcher"
              aria-label="Pantry Matcher"
              onClick={() => navigateTo({ type: 'pantry' })}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                isPantry
                  ? 'bg-[#4A3B2C] text-[#FAF7F2] shadow-sm'
                  : 'text-[#5C4E40] hover:text-[#261D16] hover:bg-[#E4DBCF]'
              }`}
            >
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Pantry Matcher</span>
            </button>

            <button
              id="nav_index_desktop"
              title="A–Z Index"
              aria-label="A–Z Index"
              onClick={() => navigateTo({ type: 'index' })}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                isIndex
                  ? 'bg-[#4A3B2C] text-[#FAF7F2] shadow-sm'
                  : 'text-[#5C4E40] hover:text-[#261D16] hover:bg-[#E4DBCF]'
              }`}
            >
              <ArrowDownAZ className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">A–Z Index</span>
            </button>

            <button
              id="nav_heritage_desktop"
              title="Heritage Notes"
              aria-label="Heritage Notes"
              onClick={() => navigateTo({ type: 'heritage' })}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                isHeritage
                  ? 'bg-[#4A3B2C] text-[#FAF7F2] shadow-sm'
                  : 'text-[#5C4E40] hover:text-[#261D16] hover:bg-[#E4DBCF]'
              }`}
            >
              <BookHeart className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Heritage Notes</span>
            </button>
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              id="nav_add_recipe"
              onClick={() => navigateTo({ type: 'addRecipe' })}
              title="Add a recipe to share with the family"
              className={`flex items-center gap-1.5 px-2 sm:px-3 py-1.5 text-xs font-semibold whitespace-nowrap rounded-lg border transition-colors ${
                currentScreen.type === 'addRecipe'
                  ? 'bg-[#4A3B2C] text-[#FAF7F2] border-[#4A3B2C]'
                  : 'text-[#4A3B2C] bg-[#EBE3D6] border-[#D2C4B1] hover:bg-[#E4DBCF]'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add recipe</span>
            </button>
            <button
              id="nav_shopping_list"
              onClick={() => navigateTo({ type: 'shopping' })}
              title="Shopping list: what you still need to buy"
              aria-label={`Shopping list${toBuyCount ? `, ${toBuyCount} to buy` : ''}`}
              className={`relative flex items-center gap-1.5 px-2 sm:px-3 py-1.5 text-xs font-semibold whitespace-nowrap rounded-lg border transition-colors ${
                currentScreen.type === 'shopping'
                  ? 'bg-[#4A3B2C] text-[#FAF7F2] border-[#4A3B2C]'
                  : 'text-[#4A3B2C] bg-[#EBE3D6] border-[#D2C4B1] hover:bg-[#E4DBCF]'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              {toBuyCount > 0 && (
                <span id="shopping_badge" className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#B8452D] text-white text-[10px] font-bold flex items-center justify-center leading-none">
                  {toBuyCount > 99 ? '99+' : toBuyCount}
                </span>
              )}
            </button>
            <button
              id="global_print_btn"
              onClick={() => openPrintExport()}
              title="Print & Keepsake Book Export"
              className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 text-xs font-medium whitespace-nowrap text-[#4A3B2C] bg-[#EBE3D6] border border-[#D2C4B1] rounded-lg hover:bg-[#E4DBCF] transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Print Cookbook</span>
            </button>
            <AuthButton />
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (Hidden when in Detail screen to match Android BackHandler/Scaffold behavior) */}
      {!isDetail && (
        <nav
          id="bottom_navigation_bar"
          className="sm:hidden fixed bottom-0 inset-x-0 z-30 bg-[#F4EEE5]/95 backdrop-blur-md border-t border-[#D2C4B1] flex items-center justify-around pt-1.5 pb-[max(0.6rem,env(safe-area-inset-bottom))] px-2 shadow-lg"
        >
          <button
            id="nav_explore"
            onClick={() => navigateTo({ type: 'explore' })}
            className={`flex flex-col items-center justify-center min-w-[64px] min-h-[44px] py-1 rounded-xl transition-colors active:scale-95 touch-manipulation ${
              isExplore ? 'text-[#4A3B2C]' : 'text-[#857566] hover:text-[#261D16]'
            }`}
          >
            <div className={`p-1.5 rounded-full ${isExplore ? 'bg-[#DECFC0]' : ''}`}>
              <BookOpen className="w-4 h-4" />
            </div>
            <span className={`text-[10px] tracking-tight ${isExplore ? 'font-bold text-[#4A3B2C]' : 'font-normal'}`}>
              Cookbook
            </span>
          </button>

          <button
            id="nav_pantry"
            onClick={() => navigateTo({ type: 'pantry' })}
            className={`flex flex-col items-center justify-center min-w-[64px] min-h-[44px] py-1 rounded-xl transition-colors active:scale-95 touch-manipulation ${
              isPantry ? 'text-[#4A3B2C]' : 'text-[#857566] hover:text-[#261D16]'
            }`}
          >
            <div className={`p-1.5 rounded-full ${isPantry ? 'bg-[#DECFC0]' : ''}`}>
              <UtensilsCrossed className="w-4 h-4" />
            </div>
            <span className={`text-[10px] tracking-tight ${isPantry ? 'font-bold text-[#4A3B2C]' : 'font-normal'}`}>
              Pantry
            </span>
          </button>

          <button
            id="nav_index"
            onClick={() => navigateTo({ type: 'index' })}
            className={`flex flex-col items-center justify-center min-w-[64px] min-h-[44px] py-1 rounded-xl transition-colors active:scale-95 touch-manipulation ${
              isIndex ? 'text-[#4A3B2C]' : 'text-[#857566] hover:text-[#261D16]'
            }`}
          >
            <div className={`p-1.5 rounded-full ${isIndex ? 'bg-[#DECFC0]' : ''}`}>
              <ArrowDownAZ className="w-4 h-4" />
            </div>
            <span className={`text-[10px] tracking-tight ${isIndex ? 'font-bold text-[#4A3B2C]' : 'font-normal'}`}>
              Index
            </span>
          </button>

          <button
            id="nav_heritage"
            onClick={() => navigateTo({ type: 'heritage' })}
            className={`flex flex-col items-center justify-center min-w-[64px] min-h-[44px] py-1 rounded-xl transition-colors active:scale-95 touch-manipulation ${
              isHeritage ? 'text-[#4A3B2C]' : 'text-[#857566] hover:text-[#261D16]'
            }`}
          >
            <div className={`p-1.5 rounded-full ${isHeritage ? 'bg-[#DECFC0]' : ''}`}>
              <BookHeart className="w-4 h-4" />
            </div>
            <span className={`text-[10px] tracking-tight ${isHeritage ? 'font-bold text-[#4A3B2C]' : 'font-normal'}`}>
              Heritage
            </span>
          </button>
        </nav>
      )}
    </>
  );
};
