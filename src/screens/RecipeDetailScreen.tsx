import React, { useRef, useState } from 'react';
import { useCookbook } from '../context/CookbookContext';
import {
  CATEGORY_INFO,
  DIFFICULTY_INFO,
  SPICE_INFO,
  SpiceLevel,
  UnitSystem,
  Recipe
} from '../types';
import { generateAutoTags } from '../utils/autoTagging';
import { scaleAndConvert } from '../utils/ingredientScaler';
import { getHeritagePhotoUrl } from '../utils/photoResolver';
import { calculateDifficulty, calculateNutrition, scaleNutrition } from '../utils/recipeCalculator';
import { optimizeImageFile } from '../utils/imageOptimizer';
import { allRecipes } from '../data/cookbookDataSource';
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  Clock,
  ChefHat,
  Printer,
  Sparkles,
  Camera,
  Trash2,
  CheckCircle2,
  Circle,
  Timer as TimerIcon,
  PlaySquare,
  Scale,
  Plus,
  Minus,
  Edit3,
  Flame,
  Activity,
  ShoppingBag,
  Share2,
  Image as ImageIcon,
  RotateCcw
} from 'lucide-react';
import { HandsFreeCookingModal } from '../components/HandsFreeCookingModal';
import { ShareRecipeModal } from '../components/ShareRecipeModal';

interface RecipeDetailScreenProps {
  recipeId: string;
}

export const RecipeDetailScreen: React.FC<RecipeDetailScreenProps> = ({ recipeId }) => {
  const {
    getRecipeById,
    navigateTo,
    navigateBack,
    favoriteRecipeIds,
    toggleFavorite,
    customRecipePhotos,
    setCustomRecipePhoto,
    removeCustomRecipePhoto,
    userNotes,
    saveRecipeNote,
    setRecipeCustomSpice,
    getEffectiveSpiceLevel,
    unitSystem,
    setUnitSystem,
    servingMultiplier,
    setServingMultiplier,
    checkedIngredients,
    toggleIngredientChecked,
    startRecipeTimer,
    openHandsFree,
    openPrintExport,
    addRecipeIngredientsToPantry
  } = useCookbook();

  const recipe = getRecipeById(recipeId);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  const [noteText, setNoteText] = useState(() => (recipe ? userNotes[recipe.id] || '' : ''));
  const [isNoteSaved, setIsNoteSaved] = useState(false);
  const [pantryAddedToast, setPantryAddedToast] = useState(false);
  const [photoFeedbackToast, setPhotoFeedbackToast] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Swipe detection refs
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  if (!recipe) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-4">
        <h2 className="font-serif-heritage text-2xl font-bold text-[#261D16]">Recipe Not Found</h2>
        <button
          onClick={navigateBack}
          className="px-4 py-2 bg-[#4A3B2C] text-[#FAF7F2] rounded-xl text-sm font-semibold"
        >
          Return to Cookbook
        </button>
      </div>
    );
  }

  // Find index for next/prev navigation
  const currentIndex = allRecipes.findIndex(r => r.id === recipe.id);
  const prevRecipe = currentIndex > 0 ? allRecipes[currentIndex - 1] : null;
  const nextRecipe = currentIndex < allRecipes.length - 1 ? allRecipes[currentIndex + 1] : null;

  const isFav = favoriteRecipeIds.has(recipe.id);
  const difficulty = calculateDifficulty(recipe);
  const diffInfo = DIFFICULTY_INFO[difficulty];
  const currentSpice = getEffectiveSpiceLevel(recipe);
  const autoTags = generateAutoTags(recipe);
  const nutrition = scaleNutrition(calculateNutrition(recipe), servingMultiplier);
  const photoUrl = customRecipePhotos[recipe.id] || getHeritagePhotoUrl(recipe);
  const isCustomPhoto = !!customRecipePhotos[recipe.id];

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const optimizedDataUrl = await optimizeImageFile(file, 1280, 960, 0.82);
      setCustomRecipePhoto(recipe.id, optimizedDataUrl);
      setPhotoFeedbackToast('Custom photo saved for this recipe!');
      setTimeout(() => setPhotoFeedbackToast(null), 3000);
    } catch (err) {
      console.error('Failed to process image:', err);
      setPhotoFeedbackToast('Could not save photo. Please try a different image.');
      setTimeout(() => setPhotoFeedbackToast(null), 3000);
    }
  };

  const handleResetPhoto = () => {
    removeCustomRecipePhoto(recipe.id);
    setPhotoFeedbackToast('Reverted to original heritage cookbook photo.');
    setTimeout(() => setPhotoFeedbackToast(null), 3000);
  };

  const handleSaveNote = () => {
    saveRecipeNote(recipe.id, noteText);
    setIsNoteSaved(true);
    setTimeout(() => setIsNoteSaved(false), 2500);
  };

  const handleAddToPantry = () => {
    addRecipeIngredientsToPantry(recipe);
    setPantryAddedToast(true);
    setTimeout(() => setPantryAddedToast(false), 2500);
  };

  // Swipe Gestures between recipes
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    // Minimum horizontal swipe distance of 75px and minimal vertical drift
    if (Math.abs(deltaX) > 75 && Math.abs(deltaY) < 55) {
      if (deltaX < 0 && nextRecipe) {
        // Swiped left -> Next recipe
        navigateTo({ type: 'detail', recipeId: nextRecipe.id });
      } else if (deltaX > 0) {
        if (prevRecipe) {
          // Swiped right -> Previous recipe
          navigateTo({ type: 'detail', recipeId: prevRecipe.id });
        } else {
          // Swiped right at the first recipe -> Back to list
          navigateBack();
        }
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  return (
    <div
      id="recipe_detail_screen"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="max-w-4xl mx-auto px-4 sm:px-6 py-4 pb-28 sm:pb-20 space-y-6 select-text"
    >
      {/* Hidden File Inputs for Gallery Upload & Direct Camera Snap */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handlePhotoUpload}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handlePhotoUpload}
        className="hidden"
      />

      {/* Top Navigation & Action Row */}
      <div className="flex items-center justify-between gap-3">
        <button
          id="back_to_cookbook_btn"
          type="button"
          onClick={navigateBack}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#EBE3D6] text-[#4A3B2C] hover:bg-[#E4DBCF] text-xs font-bold transition-transform active:scale-95 border border-[#D2C4B1] cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Cookbook</span>
        </button>

        {/* Action icons: Share, Print, Favorite */}
        <div className="flex items-center gap-2">
          {/* Share Recipe Button */}
          <button
            id="detail_share_btn"
            type="button"
            onClick={() => setIsShareModalOpen(true)}
            title="Share this recipe via WhatsApp, SMS, or Social Media"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#EBE3D6] text-[#4A3B2C] hover:bg-[#E4DBCF] border border-[#D2C4B1] text-xs font-bold transition-colors cursor-pointer shadow-sm"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </button>

          {/* Print / PDF Button */}
          <button
            id="detail_print_btn"
            type="button"
            onClick={() => openPrintExport(recipe.id)}
            title="Print or export keepsake PDF"
            className="p-2 rounded-xl bg-[#EBE3D6] text-[#4A3B2C] hover:bg-[#E4DBCF] border border-[#D2C4B1] transition-colors cursor-pointer shadow-sm"
          >
            <Printer className="w-4 h-4" />
          </button>

          {/* Favorite Button */}
          <button
            id="detail_fav_btn"
            type="button"
            onClick={() => toggleFavorite(recipe.id)}
            title={isFav ? 'Remove from favorites' : 'Add to favorites'}
            className="p-2 rounded-xl bg-[#EBE3D6] text-[#4A3B2C] hover:bg-[#E4DBCF] border border-[#D2C4B1] transition-colors cursor-pointer shadow-sm"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isFav ? 'fill-[#B8452D] text-[#B8452D]' : 'text-[#7D6C5A]'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Hero Photo Card (NO PAGE NUMBER ON PHOTO) */}
      <div className="relative rounded-3xl overflow-hidden shadow-lg border border-[#D2C4B1] bg-[#EBE3D6] aspect-[16/9] sm:aspect-[21/9]">
        <img
          src={photoUrl}
          alt={recipe.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/35" />

        {/* Top Badges (Category only - No page numbers on photo) */}
        <div className="absolute top-3.5 left-3.5 flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-[#FAF7F2]/90 backdrop-blur-md text-[#4A3B2C] text-xs font-bold uppercase tracking-wider shadow-sm">
            {CATEGORY_INFO[recipe.category]?.displayName}
          </span>
          {isCustomPhoto && (
            <span className="px-2.5 py-1 rounded-full bg-emerald-700/90 text-white text-[11px] font-bold backdrop-blur-sm shadow-sm flex items-center gap-1">
              <ImageIcon className="w-3 h-3" />
              <span>Your Photo</span>
            </span>
          )}
        </div>

        {/* Photo Upload & Change Buttons Overlay */}
        <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5">
          <button
            id="upload_recipe_photo_hero_btn"
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Upload your own photo of this dish"
            className="p-2 sm:px-3 sm:py-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-all text-xs flex items-center gap-1.5 border border-white/20 cursor-pointer shadow-sm"
          >
            <Camera className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Change Photo</span>
          </button>

          {isCustomPhoto && (
            <button
              id="reset_recipe_photo_hero_btn"
              type="button"
              onClick={handleResetPhoto}
              title="Reset to original heritage cookbook photo"
              className="p-2 rounded-full bg-red-900/80 hover:bg-red-900 text-white backdrop-blur-md transition-colors border border-white/20 cursor-pointer shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Bottom Hero Overlay */}
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h1 className="font-serif-heritage text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white drop-shadow-md">
            {recipe.title}
          </h1>
          {recipe.italianTitle && (
            <p className="font-serif-heritage italic text-base sm:text-xl text-[#FAF7F2]/95 mt-0.5">
              {recipe.italianTitle}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs sm:text-sm text-[#FAF7F2]/85">
            <span className="flex items-center gap-1">
              <ChefHat className="w-4 h-4 text-amber-300" />
              Contributed by <strong>{recipe.contributor}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Photo Feedback Toast */}
      {photoFeedbackToast && (
        <div className="p-3 bg-[#FAF7F2] border border-[#A7CE9B] rounded-2xl flex items-center justify-between gap-3 text-xs text-[#2A441E] font-medium shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{photoFeedbackToast}</span>
          </div>
          <button
            type="button"
            onClick={() => setPhotoFeedbackToast(null)}
            className="text-[#7D6C5A] hover:text-[#261D16]"
          >
            ✕
          </button>
        </div>
      )}

      {/* Dedicated Photo Customization Bar */}
      <div className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#D2C4B1] flex flex-wrap items-center justify-between gap-3 text-xs text-[#5C4E40]">
        <div className="flex items-center gap-2">
          <Camera className="w-4 h-4 text-[#7D6C5A]" />
          <span>
            {isCustomPhoto ? (
              <>
                <strong>Custom Photo Active:</strong> Overriding original cookbook image.
              </>
            ) : (
              <>
                <strong>Dish Photo:</strong> You can upload your own homemade dish photo to personalize this recipe.
              </>
            )}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="choose_photo_btn"
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 rounded-xl bg-[#EBE3D6] hover:bg-[#E4DBCF] text-[#4A3B2C] font-semibold border border-[#D2C4B1] transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Upload Photo</span>
          </button>

          <button
            id="camera_photo_btn"
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            className="px-3 py-1.5 rounded-xl bg-[#EBE3D6] hover:bg-[#E4DBCF] text-[#4A3B2C] font-semibold border border-[#D2C4B1] transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Take Photo</span>
          </button>

          {isCustomPhoto && (
            <button
              id="revert_photo_btn"
              type="button"
              onClick={handleResetPhoto}
              className="px-3 py-1.5 rounded-xl bg-red-100 hover:bg-red-200 text-red-800 font-semibold border border-red-200 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Revert to Original</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Action Bar (Hands-Free, Timer, Add to Pantry) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          id="start_hands_free_btn"
          type="button"
          onClick={() => openHandsFree(0)}
          className="flex items-center justify-center gap-2 py-3.5 px-4 bg-[#4A3B2C] text-[#FAF7F2] rounded-2xl font-bold text-xs sm:text-sm hover:bg-[#382B1E] transition-transform active:scale-95 shadow-md cursor-pointer"
        >
          <PlaySquare className="w-4 h-4 text-amber-300" />
          <span>Hands-Free Cooking</span>
        </button>

        <button
          id="detail_timer_btn"
          type="button"
          onClick={() => startRecipeTimer(recipe)}
          className="flex items-center justify-center gap-2 py-3.5 px-4 bg-[#EBE3D6] text-[#4A3B2C] border border-[#D2C4B1] rounded-2xl font-bold text-xs sm:text-sm hover:bg-[#E4DBCF] transition-colors cursor-pointer"
        >
          <TimerIcon className="w-4 h-4" />
          <span>Start Cook Timer</span>
        </button>

        <button
          id="add_to_pantry_btn"
          type="button"
          onClick={handleAddToPantry}
          className="flex items-center justify-center gap-2 py-3.5 px-4 bg-[#EBE3D6] text-[#4A3B2C] border border-[#D2C4B1] rounded-2xl font-bold text-xs sm:text-sm hover:bg-[#E4DBCF] transition-colors cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>{pantryAddedToast ? 'Added to Pantry!' : 'Send Items to Pantry'}</span>
        </button>
      </div>

      {/* Quick Specs Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FAF7F2] p-4 rounded-2xl border border-[#D2C4B1]">
        <div className="space-y-0.5">
          <span className="text-[11px] uppercase tracking-wider text-[#7D6C5A] font-semibold">
            Prep Time
          </span>
          <p className="text-sm sm:text-base font-bold text-[#261D16] flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#A69480]" />
            {recipe.prepTime}
          </p>
        </div>

        <div className="space-y-0.5">
          <span className="text-[11px] uppercase tracking-wider text-[#7D6C5A] font-semibold">
            Cook Time
          </span>
          <p className="text-sm sm:text-base font-bold text-[#261D16] flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-[#B8452D]" />
            {recipe.cookTime}
          </p>
        </div>

        <div className="space-y-0.5">
          <span className="text-[11px] uppercase tracking-wider text-[#7D6C5A] font-semibold">
            Difficulty
          </span>
          <p className="text-sm sm:text-base font-bold text-[#261D16] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#5C7250]" />
            {diffInfo.label}
          </p>
        </div>

        <div className="space-y-0.5">
          <span className="text-[11px] uppercase tracking-wider text-[#7D6C5A] font-semibold">
            Spice Profile
          </span>
          <p className="text-sm sm:text-base font-bold text-[#261D16] flex items-center gap-1.5">
            <span>{SPICE_INFO[currentSpice].icon}</span>
            <span>{SPICE_INFO[currentSpice].label}</span>
          </p>
        </div>
      </div>

      {/* Ingredients & Instructions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Ingredients Column (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#D2C4B1] space-y-4">
            <div className="flex items-center justify-between border-b border-[#D2C4B1] pb-3">
              <h2 className="font-serif-heritage text-xl font-bold text-[#261D16]">Ingredients</h2>

              {/* Metric / Imperial toggle */}
              <div className="flex items-center gap-1 bg-[#EBE3D6] p-0.5 rounded-lg text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setUnitSystem(UnitSystem.IMPERIAL)}
                  className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                    unitSystem === UnitSystem.IMPERIAL
                      ? 'bg-[#4A3B2C] text-[#FAF7F2]'
                      : 'text-[#5C4E40] hover:text-[#261D16]'
                  }`}
                >
                  US
                </button>
                <button
                  type="button"
                  onClick={() => setUnitSystem(UnitSystem.METRIC)}
                  className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                    unitSystem === UnitSystem.METRIC
                      ? 'bg-[#4A3B2C] text-[#FAF7F2]'
                      : 'text-[#5C4E40] hover:text-[#261D16]'
                  }`}
                >
                  Metric
                </button>
              </div>
            </div>

            {/* Serving Size Multiplier Controls */}
            <div className="flex items-center justify-between bg-[#EBE3D6]/60 p-3 rounded-xl">
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold text-[#4A3B2C] uppercase tracking-wider">
                  Yield / Servings
                </span>
                <p className="text-xs text-[#5C4E40]">Original: {recipe.servings}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setServingMultiplier(Math.max(0.5, servingMultiplier - 0.5))}
                  className="p-1 rounded-lg bg-white border border-[#D2C4B1] hover:bg-[#FAF7F2] text-[#4A3B2C] cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-bold text-xs text-[#261D16] min-w-[36px] text-center font-mono">
                  {servingMultiplier}x
                </span>
                <button
                  type="button"
                  onClick={() => setServingMultiplier(servingMultiplier + 0.5)}
                  className="p-1 rounded-lg bg-white border border-[#D2C4B1] hover:bg-[#FAF7F2] text-[#4A3B2C] cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Checklist of Ingredients */}
            <ul className="space-y-2.5">
              {recipe.ingredients.map((ing, idx) => {
                const isChecked = checkedIngredients.has(ing.rawText);
                const display = scaleAndConvert(ing.rawText, servingMultiplier, unitSystem);

                return (
                  <li
                    key={idx}
                    onClick={() => toggleIngredientChecked(ing.rawText)}
                    className={`flex items-start gap-3 p-2.5 rounded-xl transition-all cursor-pointer select-none ${
                      isChecked
                        ? 'bg-[#E4EFE0]/60 text-[#7D6C5A] line-through'
                        : 'hover:bg-[#EBE3D6]/50 text-[#261D16]'
                    }`}
                  >
                    <button
                      type="button"
                      className="mt-0.5 shrink-0 text-[#4A3B2C] hover:opacity-80 cursor-pointer"
                    >
                      {isChecked ? (
                        <CheckCircle2 className="w-4 h-4 text-[#5C7250]" />
                      ) : (
                        <Circle className="w-4 h-4 text-[#A69480]" />
                      )}
                    </button>
                    <span className="text-xs sm:text-sm leading-relaxed">{display.displayText}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Scaled Nutrition Facts Card */}
          <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#D2C4B1] space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#4A3B2C] flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" />
              <span>Nutritional Estimate ({servingMultiplier}x scale)</span>
            </h3>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-[#EBE3D6]/60 p-2 rounded-xl">
                <span className="text-[10px] text-[#7D6C5A] block">Calories</span>
                <span className="font-bold text-[#261D16]">{nutrition.calories} kcal</span>
              </div>
              <div className="bg-[#EBE3D6]/60 p-2 rounded-xl">
                <span className="text-[10px] text-[#7D6C5A] block">Protein</span>
                <span className="font-bold text-[#261D16]">{nutrition.proteinGrams}g</span>
              </div>
              <div className="bg-[#EBE3D6]/60 p-2 rounded-xl">
                <span className="text-[10px] text-[#7D6C5A] block">Carbs</span>
                <span className="font-bold text-[#261D16]">{nutrition.carbsGrams}g</span>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions Column (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#FAF7F2] p-5 sm:p-6 rounded-2xl border border-[#D2C4B1] space-y-6">
            <div className="flex items-center justify-between border-b border-[#D2C4B1] pb-3">
              <h2 className="font-serif-heritage text-xl font-bold text-[#261D16]">
                Method & Preparation
              </h2>
              <span className="text-xs text-[#7D6C5A]">
                {recipe.instructions.length} step{recipe.instructions.length === 1 ? '' : 's'}
              </span>
            </div>

            {/* Instruction Steps */}
            <ol className="space-y-4">
              {recipe.instructions.map((inst, idx) => (
                <li key={idx} className="flex items-start gap-4">
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#4A3B2C] text-[#FAF7F2] text-xs font-bold font-mono shrink-0 shadow-sm mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="font-serif-heritage text-base sm:text-lg text-[#261D16] leading-relaxed pt-0.5 select-text">
                    {inst}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          {/* Original Family Heritage Notes */}
          {recipe.notes && (
            <div className="bg-[#EBE3D6] p-5 rounded-2xl border border-[#D2C4B1] space-y-2">
              <div className="flex items-center gap-2 text-[#4A3B2C]">
                <Sparkles className="w-4 h-4 text-[#B8452D]" />
                <h3 className="font-serif-heritage text-base font-bold">
                  Heirloom Kitchen Wisdom & Family Note
                </h3>
              </div>
              <p className="font-serif-heritage italic text-sm text-[#4A3B2C] leading-relaxed">
                "{recipe.notes}"
              </p>
            </div>
          )}

          {/* Spice Customization Selector */}
          <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#D2C4B1] space-y-3">
            <h3 className="font-serif-heritage text-base font-bold text-[#261D16] flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#B8452D]" />
              <span>Customize Spice Level</span>
            </h3>
            <p className="text-xs text-[#7D6C5A]">
              Calibrate this recipe to your family's heat preference:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {Object.values(SpiceLevel).map(lvl => {
                const info = SPICE_INFO[lvl];
                const isSelected = currentSpice === lvl;
                return (
                  <button
                    key={lvl}
                    id={`spice_opt_${lvl.toLowerCase()}`}
                    type="button"
                    onClick={() => setRecipeCustomSpice(recipe.id, lvl)}
                    className={`p-2.5 rounded-xl border text-center text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#B8452D] bg-[#DECFC0] text-[#261D16]'
                        : 'border-[#D2C4B1] bg-white text-[#5C4E40] hover:bg-[#F4EEE5]'
                    }`}
                  >
                    <span className="text-base block mb-0.5">{info.icon}</span>
                    <span className="block font-bold">{info.label}</span>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-[#7D6C5A] italic mt-1">
              Tip: {SPICE_INFO[currentSpice].tip}
            </p>
          </div>

          {/* Personal Cook's Journal Note */}
          <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#D2C4B1] space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-serif-heritage text-base font-bold text-[#261D16] flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-[#4A3B2C]" />
                <span>My Cooking Notes</span>
              </h3>
              {isNoteSaved && (
                <span className="text-xs text-[#5C7250] font-semibold animate-fade-in">
                  Saved to your cookbook!
                </span>
              )}
            </div>

            <textarea
              id="recipe_note_textarea"
              rows={3}
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              placeholder="Record your kitchen notes, oven calibration, extra herbs, or wine pairing..."
              className="w-full p-3 bg-white border border-[#D2C4B1] rounded-xl text-xs sm:text-sm text-[#261D16] placeholder:text-[#857566] focus:outline-none focus:ring-2 focus:ring-[#4A3B2C]"
            />

            <div className="flex justify-end">
              <button
                id="save_recipe_note_btn"
                type="button"
                onClick={handleSaveNote}
                className="px-4 py-2 bg-[#4A3B2C] text-[#FAF7F2] rounded-xl text-xs font-bold hover:bg-[#382B1E] transition-colors cursor-pointer"
              >
                Save Note
              </button>
            </div>
          </div>

          {/* Dietary Tags */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2">
            {autoTags.map(tag => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-full bg-[#EBE3D6] text-[#5C4E40] text-xs font-medium border border-[#D2C4B1]"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Sequential Recipe Navigation Bar (Previous / Next with Swipe Hint) */}
      <div className="pt-4 border-t border-[#D2C4B1] flex items-center justify-between gap-3 text-xs text-[#7D6C5A]">
        {prevRecipe ? (
          <button
            id="prev_recipe_btn"
            type="button"
            onClick={() => navigateTo({ type: 'detail', recipeId: prevRecipe.id })}
            className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FAF7F2] border border-[#D2C4B1] hover:bg-[#EBE3D6] text-[#261D16] font-semibold transition-colors max-w-[45%] truncate text-left cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 shrink-0 text-[#7D6C5A]" />
            <span className="truncate">{prevRecipe.title}</span>
          </button>
        ) : (
          <div />
        )}

        <span className="hidden sm:inline text-[11px] text-[#A69480] italic">
          Swipe left/right to browse recipes
        </span>

        {nextRecipe ? (
          <button
            id="next_recipe_btn"
            type="button"
            onClick={() => navigateTo({ type: 'detail', recipeId: nextRecipe.id })}
            className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FAF7F2] border border-[#D2C4B1] hover:bg-[#EBE3D6] text-[#261D16] font-semibold transition-colors max-w-[45%] truncate text-right cursor-pointer ml-auto"
          >
            <span className="truncate">{nextRecipe.title}</span>
            <ArrowRight className="w-4 h-4 shrink-0 text-[#7D6C5A]" />
          </button>
        ) : (
          <div />
        )}
      </div>

      {/* Modals */}
      <HandsFreeCookingModal recipe={recipe} />
      <ShareRecipeModal
        recipe={recipe}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </div>
  );
};
