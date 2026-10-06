import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useCookbook } from '../context/CookbookContext';
import { commonPantryIngredients, findRecipeById, missingIngredientsFor } from '../data/cookbookDataSource';
import { ShareListButtons } from '../components/ShareListButtons';
import { listMessage } from '../utils/shareList';
import { MatcherFilter } from '../types';
import { getRecipePhotoUrls } from '../utils/photoResolver';
import { RecipePhoto } from '../components/RecipePhoto';
import { allRecipes } from '../data/cookbookDataSource';
import {
  UtensilsCrossed,
  Plus,
  X,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChefHat,
  ShoppingCart,
  ListChecks
} from 'lucide-react';

export const PantryMatcherScreen: React.FC = () => {
  const {
    pantryItems,
    addPantryIngredient,
    removePantryIngredient,
    clearAllPantry,
    seedCommonPantry,
    matcherFilter,
    setMatcherFilter,
    pantryMatches,
    customRecipePhotos,
    addToShoppingList,
    shoppingList,
    navigateTo
  } = useCookbook();

  const [inputVal, setInputVal] = useState('');

  // The recipe the person has chosen to cook, and what they would still need to buy for it.
  const [chosenId, setChosenId] = useState<string | null>(null);
  const [addedNote, setAddedNote] = useState<string | null>(null);
  const planRef = useRef<HTMLDivElement | null>(null);
  const chosen = chosenId ? findRecipeById(chosenId) : undefined;
  const missing = useMemo(() => (chosen ? missingIngredientsFor(chosen, pantryItems) : []), [chosen, pantryItems]);
  useEffect(() => setAddedNote(null), [chosenId]);
  useEffect(() => {
    if (chosenId) planRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [chosenId]);

  const addMissingToList = () => {
    if (!chosen) return;
    const fresh = addToShoppingList(chosen.title, missing);
    setAddedNote(
      fresh === 0 ? 'Those items are already on your shopping list.' : `${fresh} item${fresh === 1 ? '' : 's'} added to your shopping list.`
    );
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      addPantryIngredient(inputVal);
      setInputVal('');
    }
  };

  return (
    <div id="pantry_matcher_screen" className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-28 sm:pb-16 space-y-6">
      {/* Title */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBE3D6] text-[#7D6C5A] text-xs font-semibold tracking-wider uppercase border border-[#D2C4B1]">
          <UtensilsCrossed className="w-3.5 h-3.5 text-[#4A3B2C]" />
          Smart Pantry Matcher
        </span>
        <h2 className="font-serif-heritage text-3xl sm:text-4xl font-bold text-[#261D16]">
          What Can I Cook Tonight?
        </h2>
        <p className="text-xs sm:text-sm text-[#5C4E40]">
          Tell us what ingredients you have on your counter, in your fridge, or in your cantina. We'll cross-reference all {allRecipes.length} Ruffolo-Vitale family heirloom recipes.
        </p>
      </div>

      {/* Input Box & Action Buttons */}
      <div className="bg-[#FAF7F2] p-5 sm:p-6 rounded-2xl border border-[#D2C4B1] space-y-4 shadow-sm">
        <form onSubmit={handleAdd} className="flex gap-2">
          <input
            id="pantry_ingredient_input"
            type="text"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            placeholder="Add ingredient (e.g., eggs, garlic, ricotta, sausage)..."
            className="flex-1 px-4 py-3 bg-white border border-[#D2C4B1] rounded-xl text-sm text-[#261D16] placeholder:text-[#857566] focus:outline-none focus:ring-2 focus:ring-[#4A3B2C]"
          />
          <button
            id="add_ingredient_btn"
            type="submit"
            className="flex items-center gap-1.5 px-5 py-3 bg-[#4A3B2C] text-[#FAF7F2] rounded-xl text-xs sm:text-sm font-bold hover:bg-[#382B1E] transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </form>

        {/* Quick Pantry Seeds */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#E4DBCF]">
          <span className="text-xs font-semibold text-[#7D6C5A] mr-1">Quick Add:</span>
          {commonPantryIngredients.slice(0, 12).map(item => {
            const isAlreadyAdded = pantryItems.includes(item.toLowerCase());
            return (
              <button
                key={item}
                id={`quick_add_${item.toLowerCase()}`}
                type="button"
                onClick={() => addPantryIngredient(item)}
                disabled={isAlreadyAdded}
                className={`px-2.5 py-1 text-xs rounded-lg transition-all ${
                  isAlreadyAdded
                    ? 'bg-[#EBE3D6] text-[#A69480] cursor-default'
                    : 'bg-[#EBE3D6] text-[#4A3B2C] hover:bg-[#DDD2C2] hover:text-[#261D16] border border-[#D2C4B1]'
                }`}
              >
                + {item}
              </button>
            );
          })}
        </div>

        {/* Current Pantry Items Chips */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#4A3B2C]">
              Your Pantry ({pantryItems.length} items)
            </span>
            <div className="flex items-center gap-3">
              <button
                id="seed_pantry_btn"
                type="button"
                onClick={seedCommonPantry}
                className="text-xs text-[#7D6C5A] hover:text-[#261D16] flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>Seed Italian Staples</span>
              </button>

              {pantryItems.length > 0 && (
                <button
                  id="clear_pantry_btn"
                  type="button"
                  onClick={clearAllPantry}
                  className="text-xs text-[#B8452D] hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Clear All</span>
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 min-h-[36px]">
            {pantryItems.length === 0 ? (
              <p className="text-xs text-[#857566] italic py-1">
                Your pantry is currently empty. Type ingredients above or tap "Seed Italian Staples"!
              </p>
            ) : (
              pantryItems.map(item => (
                <span
                  key={item}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#EBE3D6] text-[#261D16] text-xs font-medium border border-[#D2C4B1]"
                >
                  <span>{item}</span>
                  <button
                    onClick={() => removePantryIngredient(item)}
                    className="p-0.5 hover:text-[#B8452D] text-[#7D6C5A]"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))
            )}
          </div>
        </div>
      </div>

      {/* What is missing for the recipe the person chose */}
      {chosen && (
        <div ref={planRef} id="missing_panel" className="scroll-mt-24 bg-[#FAF7F2] rounded-2xl border-2 border-[#4A3B2C] p-5 sm:p-6 space-y-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#7D6C5A]">You chose to cook</p>
              <h3 className="font-serif-heritage text-xl sm:text-2xl font-bold text-[#261D16] leading-tight">{chosen.title}</h3>
            </div>
            <button type="button" onClick={() => setChosenId(null)} aria-label="Close" className="p-1.5 rounded-full text-[#7D6C5A] hover:bg-[#EBE3D6] cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          {missing.length === 0 ? (
            <p className="text-sm text-[#5C7250] font-semibold">You have everything you need. Ready to cook!</p>
          ) : (
            <>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#B8452D] mb-2">
                  Ingredients you don't have ({missing.length})
                </h4>
                <ul id="missing_list" className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm text-[#261D16]">
                  {missing.map(m => (
                    <li key={m.name} className="flex items-start gap-2">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#B8452D] shrink-0" />
                      <span className="break-words">{m.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  id="add_missing_to_list_btn"
                  type="button"
                  onClick={addMissingToList}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#4A3B2C] text-[#FAF7F2] rounded-xl text-xs font-bold hover:bg-[#382B1E] transition-colors cursor-pointer"
                >
                  <ShoppingCart className="w-3.5 h-3.5" /> Add to shopping list
                </button>
                {addedNote && (
                  <span role="status" className="flex items-center gap-2 text-xs text-[#2A441E]">
                    {addedNote}
                    <button type="button" onClick={() => navigateTo({ type: 'shopping' })} className="underline font-semibold cursor-pointer">View list</button>
                  </span>
                )}
              </div>

              <div className="pt-3 border-t border-[#E4DBCF] space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#7D6C5A]">Send what's missing</p>
                <ShareListButtons
                  idPrefix="missing_share"
                  subject={`Ingredients I need for ${chosen.title} (Heritage Cookbook)`}
                  message={listMessage(`Ingredients I need for ${chosen.title}:`, missing.map(m => m.text))}
                />
              </div>
            </>
          )}

          <button
            type="button"
            onClick={() => navigateTo({ type: 'detail', recipeId: chosen.id })}
            className="text-xs font-semibold text-[#4A3B2C] underline cursor-pointer"
          >
            Open the recipe
          </button>
        </div>
      )}

      {/* Match Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#D2C4B1] pb-3">
        {Object.values(MatcherFilter).map(filter => {
          const isSelected = matcherFilter === filter;
          return (
            <button
              key={filter}
              id={`matcher_filter_${filter.toLowerCase().replace(/\s+/g, '_')}`}
              onClick={() => setMatcherFilter(filter)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                isSelected
                  ? 'bg-[#4A3B2C] text-[#FAF7F2] shadow-sm'
                  : 'bg-[#EBE3D6] text-[#5C4E40] hover:bg-[#E4DBCF]'
              }`}
            >
              {filter}
            </button>
          );
        })}

        <span className="ml-auto text-xs text-[#7D6C5A]">
          {pantryMatches.length} matching recipe{pantryMatches.length === 1 ? '' : 's'}
        </span>
      </div>

      {/* Matches Grid */}
      {pantryMatches.length === 0 ? (
        <div className="text-center py-16 px-4 bg-[#FAF7F2] rounded-2xl border border-dashed border-[#D2C4B1] max-w-md mx-auto space-y-3">
          <UtensilsCrossed className="w-10 h-10 text-[#A69480] mx-auto" />
          <h3 className="font-serif-heritage text-lg font-bold text-[#261D16]">
            No Matching Recipes
          </h3>
          <p className="text-xs text-[#7D6C5A]">
            Try adding standard Italian pantry staples like garlic, eggs, tomatoes, olive oil, or flour.
          </p>
          <button
            onClick={seedCommonPantry}
            className="px-4 py-2 bg-[#4A3B2C] text-[#FAF7F2] text-xs font-semibold rounded-xl hover:bg-[#382B1E] transition-colors"
          >
            Load Italian Staples
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pantryMatches.map(match => {
            const { recipe, matchedCount, totalKeyIngredients, matchPercentage, missingIngredients } =
              match;
            const photoUrl = customRecipePhotos[recipe.id] || getRecipePhotoUrls(recipe)[0];
            const is100Percent = matchPercentage === 100;

            return (
              <div
                key={recipe.id}
                id={`match_card_${recipe.id}`}
                onClick={() => navigateTo({ type: 'detail', recipeId: recipe.id })}
                className={`bg-[#FAF7F2] rounded-2xl border p-4 flex gap-4 hover:shadow-md transition-all cursor-pointer group ${
                  chosenId === recipe.id ? 'border-[#4A3B2C] ring-2 ring-[#4A3B2C]' : 'border-[#D2C4B1]'
                }`}
              >
                {/* Photo Thumbnail (whole picture visible) */}
                <div className="w-28 sm:w-32 shrink-0 self-start rounded-xl overflow-hidden">
                  <RecipePhoto src={photoUrl} alt={recipe.title} aspect="aspect-square" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    {/* Percentage Pill */}
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          is100Percent
                            ? 'bg-[#5C7250] text-white'
                            : matchPercentage >= 70
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-[#EBE3D6] text-[#5C4E40]'
                        }`}
                      >
                        {is100Percent ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <AlertCircle className="w-3 h-3 text-amber-700" />
                        )}
                        <span>
                          {matchPercentage}% Match ({matchedCount}/{totalKeyIngredients})
                        </span>
                      </span>

                      {recipe.cookTime && (
                        <span className="text-[11px] text-[#7D6C5A] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {recipe.cookTime}
                        </span>
                      )}
                    </div>

                    <h3 className="font-serif-heritage text-lg font-bold text-[#261D16] group-hover:text-[#4A3B2C] leading-tight truncate">
                      {recipe.title}
                    </h3>
                    {recipe.italianTitle && (
                      <p className="font-serif-heritage italic text-xs text-[#7D6C5A] truncate">
                        {recipe.italianTitle}
                      </p>
                    )}
                  </div>

                  {/* Missing ingredients tag */}
                  <div className="mt-2 pt-2 border-t border-[#E4DBCF]/80 text-xs space-y-2">
                    {missingIngredients.length === 0 ? (
                      <span className="text-[#5C7250] font-bold text-xs flex items-center gap-1">
                        ✓ Ready to cook right now!
                      </span>
                    ) : (
                      <p className="text-[#7D6C5A] truncate text-[11px]">
                        <strong className="text-[#B8452D]">Missing: </strong>
                        {missingIngredients.join(', ')}
                      </p>
                    )}
                    <button
                      id={`choose_recipe_${recipe.id}`}
                      type="button"
                      onClick={e => { e.stopPropagation(); setChosenId(recipe.id); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EBE3D6] border border-[#D2C4B1] hover:bg-[#E4DBCF] text-[11px] font-bold text-[#4A3B2C] cursor-pointer"
                    >
                      <ListChecks className="w-3.5 h-3.5" /> I want to cook this
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
