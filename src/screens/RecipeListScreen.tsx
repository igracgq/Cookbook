import React from 'react';
import { useCookbook } from '../context/CookbookContext';
import {
  CATEGORY_INFO,
  DIFFICULTY_INFO,
  RecipeCategory,
  RecipeQuickFilter,
  SPICE_INFO
} from '../types';
import { getHeritagePhotoUrl } from '../utils/photoResolver';
import { calculateDifficulty } from '../utils/recipeCalculator';
import {
  Search,
  Heart,
  Clock,
  Users,
  BookOpen,
  ChefHat,
  Sparkles,
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
    navigateTo
  } = useCookbook();

  return (
    <div id="recipe_list_screen" className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-28 sm:pb-16 space-y-6">
      {/* Heirloom Hero Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBE3D6] text-[#7D6C5A] text-xs font-semibold tracking-wider uppercase border border-[#D2C4B1]">
          <Sparkles className="w-3.5 h-3.5 text-[#4A3B2C]" />
          Family Heirloom Collection
        </span>
        <h2 className="font-serif-heritage text-3xl sm:text-4xl lg:text-5xl font-bold text-[#261D16] tracking-tight">
          Ruffolo-Vitale Cookbook
        </h2>
        <p className="text-xs sm:text-sm text-[#5C4E40] max-w-lg mx-auto leading-relaxed">
          Authentic Calabrian recipes, artisan homemade pastas, holiday sweets, and time-honored kitchen wisdom.
        </p>
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
            placeholder="Search 74 recipes, ingredients, Nonna Rosina..."
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
            All Sections (74)
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
                <span className={`text-[10px] ${isSelected ? 'text-[#FAF7F2]/80' : 'text-[#7D6C5A]'}`}>
                  {info.pageRange}
                </span>
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
          <span className="italic">Filtered by {selectedFilter}</span>
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
        {filteredRecipes.map(recipe => {
          const isFav = favoriteRecipeIds.has(recipe.id);
          const difficulty = calculateDifficulty(recipe);
          const spiceLevel = getEffectiveSpiceLevel(recipe);
          const diffInfo = DIFFICULTY_INFO[difficulty];
          const spiceInfo = SPICE_INFO[spiceLevel];
          const hasCustomPhoto = !!customRecipePhotos[recipe.id];
          const photoUrl = customRecipePhotos[recipe.id] || getHeritagePhotoUrl(recipe);

          return (
            <div
              key={recipe.id}
              id={`recipe_card_${recipe.id}`}
              onClick={() => navigateTo({ type: 'detail', recipeId: recipe.id })}
              className="group bg-[#FAF7F2] rounded-2xl border border-[#D2C4B1] overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Photo with Overlay Badges (NO PAGE NUMBERS ON PHOTO) */}
                <div className="relative h-48 w-full bg-[#EBE3D6] overflow-hidden">
                  <img
                    src={photoUrl}
                    alt={recipe.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                  {/* Section Badge & Custom Photo Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-full bg-[#FAF7F2]/90 backdrop-blur-sm text-[#4A3B2C] text-[10px] font-bold uppercase tracking-wider">
                      {CATEGORY_INFO[recipe.category]?.displayName.split('&')[0].trim()}
                    </span>
                    {hasCustomPhoto && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-800/80 text-white text-[9px] font-bold backdrop-blur-sm flex items-center gap-1">
                        <Camera className="w-2.5 h-2.5" />
                        <span>Custom Photo</span>
                      </span>
                    )}
                  </div>

                  {/* Favorite Button */}
                  <button
                    id={`fav_btn_${recipe.id}`}
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      toggleFavorite(recipe.id);
                    }}
                    title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white text-[#4A3B2C] transition-all shadow-sm cursor-pointer"
                  >
                    <Heart
                      className={`w-4 h-4 transition-colors ${
                        isFav ? 'fill-[#B8452D] text-[#B8452D]' : 'text-[#7D6C5A]'
                      }`}
                    />
                  </button>

                  {/* Bottom Meta on Image */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="flex items-center gap-1 font-semibold text-[11px]">
                        <Clock className="w-3.5 h-3.5" />
                        {recipe.cookTime}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-[11px]">
                        <Users className="w-3.5 h-3.5" />
                        {recipe.servings}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-full text-[10px] font-medium">
                      <span>{diffInfo.label}</span>
                      <span>•</span>
                      <span>{spiceInfo.icon}</span>
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 space-y-2">
                  <div>
                    <h3 className="font-serif-heritage text-xl font-bold text-[#261D16] group-hover:text-[#4A3B2C] leading-tight line-clamp-1">
                      {recipe.title}
                    </h3>
                    {recipe.italianTitle && (
                      <p className="font-serif-heritage italic text-xs text-[#7D6C5A] line-clamp-1">
                        {recipe.italianTitle}
                      </p>
                    )}
                  </div>

                  {/* Contributor Pill */}
                  <div className="flex items-center gap-1.5 text-xs text-[#5C4E40]">
                    <ChefHat className="w-3.5 h-3.5 text-[#7D6C5A]" />
                    <span className="truncate">Contributed by {recipe.contributor}</span>
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
    </div>
  );
};
