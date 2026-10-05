import React from 'react';
import { useCookbook } from '../context/CookbookContext';
import {
  allRecipes,
  getRecipesByCategory,
  getRecipesByContributor,
  getRecipesByLetter
} from '../data/cookbookDataSource';
import { CATEGORY_INFO, IndexViewMode, RecipeCategory } from '../types';
import { ArrowDownAZ, BookOpen, ChefHat, Layers } from 'lucide-react';

export const AlphabeticalIndexScreen: React.FC = () => {
  const {
    indexMode,
    setIndexMode,
    selectedLetter,
    setSelectedLetter,
    navigateTo
  } = useCookbook();

  const recipesByLetter = getRecipesByLetter();
  const recipesByCategory = getRecipesByCategory();
  const recipesByContributor = getRecipesByContributor();

  const availableLetters = Object.keys(recipesByLetter).sort();

  return (
    <div id="alphabetical_index_screen" className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-28 sm:pb-16 space-y-6">
      {/* Title */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBE3D6] text-[#7D6C5A] text-xs font-semibold tracking-wider uppercase border border-[#D2C4B1]">
          <ArrowDownAZ className="w-3.5 h-3.5 text-[#4A3B2C]" />
          Heirloom Index Catalog
        </span>
        <h2 className="font-serif-heritage text-3xl sm:text-4xl font-bold text-[#261D16]">
          Complete Master Index
        </h2>
        <p className="text-xs sm:text-sm text-[#5C4E40]">
          Search through all {allRecipes.length} family recipes alphabetically, by cookbook category sections, or by family contributor.
        </p>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex items-center justify-center gap-2 border-b border-[#D2C4B1] pb-3">
        <button
          id="index_tab_az"
          onClick={() => setIndexMode(IndexViewMode.ALPHABETICAL_A_TO_Z)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            indexMode === IndexViewMode.ALPHABETICAL_A_TO_Z
              ? 'bg-[#4A3B2C] text-[#FAF7F2] shadow-sm'
              : 'bg-[#EBE3D6] text-[#5C4E40] hover:bg-[#E4DBCF]'
          }`}
        >
          <ArrowDownAZ className="w-4 h-4" />
          <span>A–Z Alphabetical</span>
        </button>

        <button
          id="index_tab_cat"
          onClick={() => setIndexMode(IndexViewMode.BY_CATEGORY)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            indexMode === IndexViewMode.BY_CATEGORY
              ? 'bg-[#4A3B2C] text-[#FAF7F2] shadow-sm'
              : 'bg-[#EBE3D6] text-[#5C4E40] hover:bg-[#E4DBCF]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>By Section</span>
        </button>

        <button
          id="index_tab_contrib"
          onClick={() => setIndexMode(IndexViewMode.BY_CONTRIBUTOR)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            indexMode === IndexViewMode.BY_CONTRIBUTOR
              ? 'bg-[#4A3B2C] text-[#FAF7F2] shadow-sm'
              : 'bg-[#EBE3D6] text-[#5C4E40] hover:bg-[#E4DBCF]'
          }`}
        >
          <ChefHat className="w-4 h-4" />
          <span>By Family Cook</span>
        </button>
      </div>

      {/* 1. Alphabetical A-Z Mode */}
      {indexMode === IndexViewMode.ALPHABETICAL_A_TO_Z && (
        <div className="space-y-6">
          {/* Alphabet Quick Scrubber */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 p-3 bg-[#FAF7F2] rounded-2xl border border-[#D2C4B1]">
            <button
              onClick={() => setSelectedLetter(null)}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors ${
                selectedLetter === null
                  ? 'bg-[#4A3B2C] text-[#FAF7F2]'
                  : 'text-[#5C4E40] hover:bg-[#EBE3D6]'
              }`}
            >
              All
            </button>
            {availableLetters.map(letter => (
              <button
                key={letter}
                onClick={() => setSelectedLetter(letter)}
                className={`w-7 h-7 text-xs font-bold font-mono rounded-lg transition-colors ${
                  selectedLetter === letter
                    ? 'bg-[#4A3B2C] text-[#FAF7F2]'
                    : 'text-[#5C4E40] hover:bg-[#EBE3D6]'
                }`}
              >
                {letter}
              </button>
            ))}
          </div>

          {/* Letter Groups */}
          <div className="space-y-6">
            {availableLetters
              .filter(l => selectedLetter === null || selectedLetter === l)
              .map(letter => {
                const recipes = recipesByLetter[letter] || [];
                return (
                  <div key={letter} className="bg-[#FAF7F2] rounded-2xl border border-[#D2C4B1] p-5 space-y-3">
                    <div className="flex items-center gap-3 border-b border-[#D2C4B1] pb-2">
                      <span className="w-8 h-8 rounded-xl bg-[#4A3B2C] text-[#FAF7F2] font-serif-heritage font-bold text-lg flex items-center justify-center">
                        {letter}
                      </span>
                      <span className="text-xs font-semibold text-[#7D6C5A]">
                        {recipes.length} recipe{recipes.length === 1 ? '' : 's'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {recipes.map(recipe => (
                        <div
                          key={recipe.id}
                          id={`index_item_${recipe.id}`}
                          onClick={() => navigateTo({ type: 'detail', recipeId: recipe.id })}
                          className="p-3 rounded-xl hover:bg-[#EBE3D6] transition-colors cursor-pointer border border-transparent hover:border-[#D2C4B1] flex items-center justify-between gap-3 group"
                        >
                          <div className="min-w-0">
                            <h4 className="font-serif-heritage text-base font-bold text-[#261D16] group-hover:text-[#4A3B2C] truncate">
                              {recipe.title}
                            </h4>
                            {recipe.italianTitle && (
                              <p className="font-serif-heritage italic text-xs text-[#7D6C5A] truncate">
                                {recipe.italianTitle}
                              </p>
                            )}
                            <p className="text-[11px] text-[#7D6C5A] truncate mt-0.5">
                              {recipe.contributor}
                            </p>
                          </div>

                          <span className="shrink-0 px-2.5 py-1 rounded-full bg-[#EBE3D6] text-[#4A3B2C] font-mono text-xs font-bold border border-[#D2C4B1]">
                            p. {recipe.cookbookPage}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* 2. By Category Mode */}
      {indexMode === IndexViewMode.BY_CATEGORY && (
        <div className="space-y-6">
          {Object.entries(CATEGORY_INFO).map(([catKey, info]) => {
            const recipes = recipesByCategory[catKey as RecipeCategory] || [];
            if (recipes.length === 0) return null;

            return (
              <div key={catKey} className="bg-[#FAF7F2] rounded-2xl border border-[#D2C4B1] p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-[#D2C4B1] pb-2">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#4A3B2C]" />
                    <h3 className="font-serif-heritage text-lg font-bold text-[#261D16]">
                      {info.displayName}
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#7D6C5A]">
                    {info.pageRange} ({recipes.length})
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {recipes.map(recipe => (
                    <div
                      key={recipe.id}
                      onClick={() => navigateTo({ type: 'detail', recipeId: recipe.id })}
                      className="p-3 rounded-xl hover:bg-[#EBE3D6] transition-colors cursor-pointer border border-transparent hover:border-[#D2C4B1] flex items-center justify-between gap-3 group"
                    >
                      <div className="min-w-0">
                        <h4 className="font-serif-heritage text-base font-bold text-[#261D16] group-hover:text-[#4A3B2C] truncate">
                          {recipe.title}
                        </h4>
                        <p className="text-[11px] text-[#7D6C5A] truncate mt-0.5">
                          {[recipe.contributor, recipe.cookTime].filter(Boolean).join(' • ')}
                        </p>
                      </div>

                      <span className="shrink-0 px-2.5 py-1 rounded-full bg-[#EBE3D6] text-[#4A3B2C] font-mono text-xs font-bold border border-[#D2C4B1]">
                        p. {recipe.cookbookPage}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. By Contributor Mode */}
      {indexMode === IndexViewMode.BY_CONTRIBUTOR && (
        <div className="space-y-6">
          {Object.entries(recipesByContributor)
            .sort((a, b) => b[1].length - a[1].length)
            .map(([contributor, recipes]) => (
              <div key={contributor} className="bg-[#FAF7F2] rounded-2xl border border-[#D2C4B1] p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-[#D2C4B1] pb-2">
                  <div className="flex items-center gap-2">
                    <ChefHat className="w-4 h-4 text-[#4A3B2C]" />
                    <h3 className="font-serif-heritage text-lg font-bold text-[#261D16]">
                      {contributor}
                    </h3>
                  </div>
                  <span className="text-xs font-semibold text-[#7D6C5A]">
                    {recipes.length} recipe{recipes.length === 1 ? '' : 's'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {recipes.map(recipe => (
                    <div
                      key={recipe.id}
                      onClick={() => navigateTo({ type: 'detail', recipeId: recipe.id })}
                      className="p-3 rounded-xl hover:bg-[#EBE3D6] transition-colors cursor-pointer border border-transparent hover:border-[#D2C4B1] flex items-center justify-between gap-3 group"
                    >
                      <div className="min-w-0">
                        <h4 className="font-serif-heritage text-base font-bold text-[#261D16] group-hover:text-[#4A3B2C] truncate">
                          {recipe.title}
                        </h4>
                        <p className="text-[11px] text-[#7D6C5A] truncate mt-0.5">
                          {CATEGORY_INFO[recipe.category]?.displayName}
                        </p>
                      </div>

                      <span className="shrink-0 px-2.5 py-1 rounded-full bg-[#EBE3D6] text-[#4A3B2C] font-mono text-xs font-bold border border-[#D2C4B1]">
                        p. {recipe.cookbookPage}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};
