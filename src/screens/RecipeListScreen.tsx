import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCookbook } from '../context/CookbookContext';
import {
  CATEGORY_INFO,
  DIFFICULTY_INFO,
  RecipeCategory,
  RecipeQuickFilter,
  SPICE_INFO
} from '../types';
import { getRecipePhotoUrls, isStockPhotoUrl, FAMILY_PHOTO_URL } from '../utils/photoResolver';
import { RecipePhoto } from '../components/RecipePhoto';
import { allRecipes } from '../data/cookbookDataSource';
import { calculateDifficulty } from '../utils/recipeCalculator';
import {
  Search,
  Heart,
  Clock,
  Users,
  BookOpen,
  X,
  Camera
} from 'lucide-react';
import { VoiceSearchButton } from '../components/VoiceSearchButton';

export const RecipeListScreen: React.FC = () => {
  const {
    filteredRecipes,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedFilter,
    setSelectedFilter,
    favoriteRecipeIds,
    toggleFavorite,
    getEffectiveSpiceLevel,
    customRecipePhotos,
    favoritesSync,
    navigateTo
  } = useCookbook();

  const { cloudAvailable } = useAuth();

  // Long lists render in pages so the 1,000+ recipe cookbook stays fast on phones.
  const PAGE_SIZE = 48;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  useEffect(() => setVisibleCount(PAGE_SIZE), [searchQuery, selectedCategory, selectedFilter]);

  return (
    <div id="recipe_list_screen" className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-28 sm:pb-16 space-y-6">
      {/* Family photo from page 1 of the cookbook */}
      <div className="max-w-4xl mx-auto">
        <img
          src={FAMILY_PHOTO_URL}
          alt="The Ruffolo-Vitale family gathered together"
          className="w-full h-auto rounded-3xl border border-[#D2C4B1] shadow-sm"
          loading="eager"
        />
      </div>

      {/* Search Input Bar with Integrated Voice Search */}
      <div className="max-w-xl mx-auto relative">
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7D6C5A] pointer-events-none" />
          <input
            id="recipe_search_input"
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={`Search ${allRecipes.length} recipes, ingredients, Nonna Rosina...`}
            className="w-full pl-10 pr-20 py-3 bg-[#FAF7F2] border border-[#D2C4B1] rounded-2xl text-sm text-[#261D16] placeholder:text-[#857566] focus:outline-none focus:ring-2 focus:ring-[#4A3B2C] shadow-sm transition-all"
          />

          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                title="Clear search text"
                className="p-1.5 text-[#7D6C5A] hover:text-[#261D16] rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            <VoiceSearchButton
              onTranscript={text => setSearchQuery(text)}
              buttonId="voice_search_list_btn"
            />
          </div>
        </div>
      </div>

      {/* Categories Horizontal Scroll / Pills */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#4A3B2C]">
            Cookbook Sections
          </span>
          {selectedCategory && (
            <button
              type="button"
              onClick={() => setSelectedCategory(null)}
              className="text-xs text-[#7D6C5A] hover:text-[#261D16] underline cursor-pointer"
            >
              Clear Section
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            id="cat_all"
            type="button"
            onClick={() => setSelectedCategory(null)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer ${
              selectedCategory === null
                ? 'bg-[#4A3B2C] text-[#FAF7F2] shadow-sm'
                : 'bg-[#EBE3D6] text-[#5C4E40] hover:bg-[#E4DBCF] border border-[#D2C4B1]'
            }`}
          >
            All Sections ({allRecipes.length})
          </button>

          {Object.entries(CATEGORY_INFO).map(([catKey, info]) => {
            const isSelected = selectedCategory === catKey;
            return (
              <button
                key={catKey}
                id={`cat_${catKey.toLowerCase()}`}
                type="button"
                onClick={() => setSelectedCategory(catKey as RecipeCategory)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-[#4A3B2C] text-[#FAF7F2] shadow-sm'
                    : 'bg-[#EBE3D6] text-[#5C4E40] hover:bg-[#E4DBCF] border border-[#D2C4B1]'
                }`}
              >
                <span>{info.displayName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {Object.values(RecipeQuickFilter).map(filter => {
          const isSelected = selectedFilter === filter;
          return (
            <button
              key={filter}
              id={`quick_filter_${filter.toLowerCase().replace(/[^a-z0-9]/g, '_')}`}
              type="button"
              onClick={() => setSelectedFilter(filter)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium shrink-0 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#7D6C5A] text-[#FAF7F2]'
                  : 'bg-[#EBE3D6]/70 text-[#5C4E40] hover:bg-[#E4DBCF] border border-[#D2C4B1]'
              }`}
            >
              {filter}
            </button>
          );
        })}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-[#7D6C5A] border-b border-[#D2C4B1] pb-2">
        <span>
          Showing <strong>{filteredRecipes.length}</strong> heirloom recipe
          {filteredRecipes.length === 1 ? '' : 's'}
        </span>
        {selectedFilter !== RecipeQuickFilter.ALL && (
          <span className="italic">
            Filtered by {selectedFilter}
            {selectedFilter === RecipeQuickFilter.FAVORITES && (
              <span id="favorites_sync_status" className="not-italic ml-2 font-semibold">
                {favoritesSync === 'local' && cloudAvailable && '· saved on this device (sign in to keep them across devices)'}
                {favoritesSync === 'syncing' && '· saving to your account…'}
                {favoritesSync === 'synced' && '· saved to your account'}
                {favoritesSync === 'error' && '· could not save to your account, will retry on your next tap'}
              </span>
            )}
          </span>
        )}
      </div>

      {/* Empty State */}
      {filteredRecipes.length === 0 && (
        <div className="text-center py-16 px-4 bg-[#FAF7F2] rounded-2xl border border-dashed border-[#D2C4B1] max-w-md mx-auto space-y-3">
          <BookOpen className="w-10 h-10 text-[#A69480] mx-auto" />
          <h3 className="font-serif-heritage text-lg font-bold text-[#261D16]">No Recipes Found</h3>
          <p className="text-xs text-[#7D6C5A]">
            Try adjusting your search query or reset your section and dietary filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory(null);
              setSelectedFilter(RecipeQuickFilter.ALL);
            }}
            className="px-4 py-2 bg-[#4A3B2C] text-[#FAF7F2] text-xs font-semibold rounded-xl hover:bg-[#382B1E] transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {filteredRecipes.slice(0, visibleCount).map(recipe => {
          const isFav = favoriteRecipeIds.has(recipe.id);
          const difficulty = calculateDifficulty(recipe);
          const spiceLevel = getEffectiveSpiceLevel(recipe);
          const diffInfo = DIFFICULTY_INFO[difficulty];
          const spiceInfo = SPICE_INFO[spiceLevel];
          const hasCustomPhoto = !!customRecipePhotos[recipe.id];
          const photoUrl = customRecipePhotos[recipe.id] || getRecipePhotoUrls(recipe)[0];

          return (
            <div
              key={recipe.id}
              id={`recipe_card_${recipe.id}`}
              onClick={() => navigateTo({ type: 'detail', recipeId: recipe.id })}
              className="group bg-[#FAF7F2] rounded-2xl border border-[#D2C4B1] overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Photo (whole picture visible, no text on it) */}
                <RecipePhoto src={photoUrl} alt={recipe.title} aspect={photoUrl ? 'aspect-[4/3]' : 'aspect-[16/6]'}>
                  <button
                    id={`fav_btn_${recipe.id}`}
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      toggleFavorite(recipe.id);
                    }}
                    title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/85 backdrop-blur-sm hover:bg-white text-[#4A3B2C] transition-all shadow-sm cursor-pointer"
                  >
                    <Heart
                      className={`w-4 h-4 transition-colors ${
                        isFav ? 'fill-[#B8452D] text-[#B8452D]' : 'text-[#7D6C5A]'
                      }`}
                    />
                  </button>
                </RecipePhoto>

                {/* Card Content */}
                <div className="p-4 space-y-2.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#7D6C5A]">
                    {CATEGORY_INFO[recipe.category]?.displayName}
                  </p>
                  <div>
                    <h3 className="font-serif-heritage text-xl font-bold text-[#261D16] group-hover:text-[#4A3B2C] leading-tight line-clamp-2">
                      {recipe.title}
                    </h3>
                    {recipe.italianTitle && (
                      <p className="font-serif-heritage italic text-xs text-[#7D6C5A] line-clamp-1 mt-0.5">
                        {recipe.italianTitle}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#5C4E40]">
                    {recipe.cookTime && (
                      <span className="flex items-center gap-1 font-semibold">
                        <Clock className="w-3.5 h-3.5 text-[#A69480]" />
                        {recipe.cookTime}
                      </span>
                    )}
                    {recipe.servings && (
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-[#A69480]" />
                        {recipe.servings}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <span>{diffInfo.label}</span>
                      <span>•</span>
                      <span>{spiceInfo.icon}</span>
                    </span>
                    {!hasCustomPhoto && isStockPhotoUrl(photoUrl) && (
                      <span className="italic text-[#7D6C5A]">Illustrative photo</span>
                    )}
                    {recipe.community && (
                      <span className="font-semibold text-[#5C7250]">Shared by {recipe.contributor}</span>
                    )}
                    {hasCustomPhoto && (
                      <span className="flex items-center gap-1 text-emerald-800 font-semibold">
                        <Camera className="w-3 h-3" />
                        Your photo
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-4 py-3 bg-[#EBE3D6]/50 border-t border-[#D2C4B1]/70 flex items-center justify-between text-xs text-[#7D6C5A]">
                <span className="font-medium text-[#4A3B2C]">
                  {recipe.ingredients.length} ingredients
                </span>
                <span className="text-[11px] font-semibold text-[#4A3B2C] group-hover:underline">
                  View Recipe →
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredRecipes.length > visibleCount && (
        <div className="flex justify-center pt-2">
          <button
            id="show_more_recipes_btn"
            type="button"
            onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
            className="px-5 py-2.5 rounded-xl bg-[#4A3B2C] text-[#FAF7F2] text-sm font-semibold hover:bg-[#382B1E] transition-colors cursor-pointer"
          >
            Show more ({filteredRecipes.length - visibleCount} more recipes)
          </button>
        </div>
      )}
    </div>
  );
};
