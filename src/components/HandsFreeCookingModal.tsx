import React, { useState, useEffect, useRef } from 'react';
import { useCookbook } from '../context/CookbookContext';
import {
  ChevronLeft,
  ChevronRight,
  X,
  Timer as TimerIcon,
  Utensils,
  CheckCircle2,
  Circle,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { Recipe } from '../types';
import { ModalPortal } from './ModalPortal';

interface HandsFreeCookingModalProps {
  recipe: Recipe;
}

export const HandsFreeCookingModal: React.FC<HandsFreeCookingModalProps> = ({ recipe }) => {
  const {
    isHandsFreeActive,
    handsFreeStepIndex,
    closeHandsFree,
    nextHandsFreeStep,
    prevHandsFreeStep,
    setHandsFreeStep,
    startTimer
  } = useCookbook();

  const [showIngredients, setShowIngredients] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  // Swipe gesture detection
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  // Close on Escape key press
  useEffect(() => {
    if (!isHandsFreeActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeHandsFree();
      } else if (e.key === 'ArrowRight') {
        nextHandsFreeStep(recipe.instructions.length);
      } else if (e.key === 'ArrowLeft') {
        prevHandsFreeStep();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isHandsFreeActive, closeHandsFree, nextHandsFreeStep, prevHandsFreeStep, recipe.instructions.length]);

  if (!isHandsFreeActive) return null;

  const totalSteps = recipe.instructions.length;
  const currentStepText = recipe.instructions[handsFreeStepIndex] || '';
  const isLastStep = handsFreeStepIndex === totalSteps - 1;

  const toggleStepCompleted = (idx: number) => {
    setCompletedSteps(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  // Check if step mentions minutes or time
  const timeMatch = currentStepText.match(/(\d+)\s*(?:-|to)?\s*(\d+)?\s*(minutes?|mins?|hours?|hrs?)/i);
  const detectedMinutes = timeMatch
    ? parseInt(timeMatch[2] || timeMatch[1], 10) * (timeMatch[3].toLowerCase().startsWith('h') ? 60 : 1)
    : null;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    // Detect horizontal swipe
    if (Math.abs(deltaX) > 60 && Math.abs(deltaY) < 60) {
      if (deltaX < 0) {
        // Swipe left -> Next step
        nextHandsFreeStep(totalSteps);
      } else {
        // Swipe right -> Prev step
        prevHandsFreeStep();
      }
    } else if (deltaY > 100 && Math.abs(deltaX) < 60) {
      // Swipe down -> Close hands-free modal
      closeHandsFree();
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  return (
    <ModalPortal>
    <div
      id="hands_free_cooking_modal"
      className="fixed inset-0 z-50 bg-[#1F1710]/90 backdrop-blur-md flex flex-col justify-between pt-[max(0.75rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] px-3 sm:px-8 text-[#FAF7F2] select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={e => {
        // If clicking the outer backdrop directly, close
        if (e.target === e.currentTarget) {
          closeHandsFree();
        }
      }}
    >
      {/* Top Bar - High Visibility Navigation & Exit */}
      <header className="flex items-center justify-between gap-3 max-w-4xl mx-auto w-full pt-1 pb-2 border-b border-[#FAF7F2]/15">
        {/* Prominent Back to Recipe Button */}
        <button
          id="exit_hands_free_header_btn"
          type="button"
          onClick={closeHandsFree}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FAF7F2] text-[#261D16] font-bold text-xs sm:text-sm hover:bg-[#EBE3D6] transition-transform active:scale-95 shadow-md shrink-0 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#4A3B2C]" />
          <span>Back to Recipe</span>
        </button>

        {/* Recipe Title & Mode Indicator */}
        <div className="text-center min-w-0 flex-1 px-2">
          <h2 className="font-serif-heritage text-sm sm:text-lg font-bold text-[#FAF7F2] truncate">
            {recipe.title}
          </h2>
          <p className="text-[10px] sm:text-xs text-[#FAF7F2]/70">
            Step {handsFreeStepIndex + 1} of {totalSteps} • Swipe left/right
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            id="toggle_ingredients_drawer_btn"
            type="button"
            onClick={() => setShowIngredients(!showIngredients)}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${
              showIngredients
                ? 'bg-[#EBE3D6] text-[#4A3B2C]'
                : 'bg-[#FAF7F2]/20 text-[#FAF7F2] border border-[#FAF7F2]/30 hover:bg-[#FAF7F2]/30'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ingredients</span>
            <span>({recipe.ingredients.length})</span>
          </button>

          <button
            id="close_hands_free_x_btn"
            type="button"
            onClick={closeHandsFree}
            title="Exit Hands-Free Mode (Esc)"
            className="p-2 rounded-xl bg-red-800/80 hover:bg-red-700 text-[#FAF7F2] border border-red-500/40 transition-colors shadow-sm cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col lg:flex-row items-center justify-center gap-4 sm:gap-6 my-2 sm:my-4 relative overflow-y-auto min-h-0">
        {/* Step Card */}
        <div className="flex-1 w-full bg-[#FAF7F2] text-[#261D16] rounded-3xl p-5 sm:p-10 shadow-2xl border border-[#D2C4B1] flex flex-col justify-between overflow-y-auto max-h-[70vh]">
          <div>
            <div className="flex items-center justify-between mb-3 sm:mb-5">
              <span className="px-3 py-1 rounded-full bg-[#4A3B2C] text-[#FAF7F2] text-xs sm:text-sm font-bold tracking-wider uppercase font-mono">
                Step {handsFreeStepIndex + 1} of {totalSteps}
              </span>

              <button
                type="button"
                onClick={() => toggleStepCompleted(handsFreeStepIndex)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EBE3D6] text-[#344E28] hover:bg-[#D4E0CD] text-xs sm:text-sm font-bold transition-colors cursor-pointer"
              >
                {completedSteps.has(handsFreeStepIndex) ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span className="text-emerald-800">Done</span>
                  </>
                ) : (
                  <>
                    <Circle className="w-4 h-4 text-[#7D6C5A]" />
                    <span>Mark Done</span>
                  </>
                )}
              </button>
            </div>

            {/* Instruction Body */}
            <p className="font-serif-heritage text-xl sm:text-3xl md:text-4xl text-[#261D16] leading-relaxed select-text font-medium">
              {currentStepText}
            </p>
          </div>

          {/* Step Timer & Final Step Banner */}
          <div className="mt-6 pt-4 border-t border-[#D2C4B1]/60 space-y-3">
            {detectedMinutes && (
              <div className="flex items-center justify-between bg-[#EBE3D6]/70 p-3 rounded-2xl">
                <span className="text-xs sm:text-sm text-[#5C4E40] font-medium">
                  ⏱ Suggested cooking time: ~{detectedMinutes} minutes
                </span>
                <button
                  id="step_timer_btn"
                  type="button"
                  onClick={() =>
                    startTimer(detectedMinutes, `Step ${handsFreeStepIndex + 1}: ${recipe.title}`)
                  }
                  className="flex items-center gap-1.5 px-3 py-2 bg-[#4A3B2C] text-[#FAF7F2] hover:bg-[#382B1E] text-xs font-bold rounded-xl transition-colors shadow-sm cursor-pointer"
                >
                  <TimerIcon className="w-4 h-4" />
                  <span>Start {detectedMinutes}m Timer</span>
                </button>
              </div>
            )}

            {isLastStep && (
              <div className="bg-[#E4EFE0] border border-[#A7CE9B] p-4 rounded-2xl text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-emerald-800 font-bold text-sm">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Final Step of {recipe.title}!</span>
                </div>
                <p className="text-xs text-emerald-900">
                  You have arrived at the final step of the recipe. Buon appetito!
                </p>
                <button
                  id="finish_cooking_exit_btn"
                  type="button"
                  onClick={closeHandsFree}
                  className="w-full sm:w-auto px-6 py-2.5 bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-bold hover:bg-emerald-900 transition-colors shadow-md cursor-pointer"
                >
                  ✓ Finish Cooking & Return to Recipe
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Side Panel for Ingredients (if toggled open) */}
        {showIngredients && (
          <div className="w-full lg:w-80 max-h-[300px] lg:max-h-[60vh] bg-[#FAF7F2] text-[#261D16] rounded-2xl p-4 sm:p-5 border border-[#D2C4B1] shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#D2C4B1]">
              <h3 className="font-serif-heritage text-sm sm:text-base font-bold text-[#261D16]">
                Ingredients Checklist
              </h3>
              <button
                type="button"
                onClick={() => setShowIngredients(false)}
                className="text-[#7D6C5A] hover:text-[#261D16]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-[#4A3B2C]">
              {recipe.ingredients.map((ing, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#A69480] font-bold">•</span>
                  <span>{ing.rawText}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Bottom Step Controls & Always-Visible Exit Option */}
      <footer className="max-w-4xl mx-auto w-full pt-2 pb-1">
        <div className="flex items-center justify-between gap-3">
          <button
            id="prev_step_btn"
            type="button"
            disabled={handsFreeStepIndex === 0}
            onClick={prevHandsFreeStep}
            className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-3 rounded-2xl bg-[#FAF7F2] text-[#261D16] font-bold text-xs sm:text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#EBE3D6] transition-colors shadow-md cursor-pointer shrink-0"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Previous</span>
          </button>

          {/* Quick Exit to Recipe Button - Centered & prominent */}
          <button
            id="exit_hands_free_bottom_btn"
            type="button"
            onClick={closeHandsFree}
            className="px-4 py-2.5 rounded-xl bg-[#FAF7F2]/15 hover:bg-[#FAF7F2]/25 text-[#FAF7F2] text-xs font-semibold border border-[#FAF7F2]/25 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Exit Cooking</span>
          </button>

          {/* Next / Finish Button */}
          {isLastStep ? (
            <button
              id="finish_step_btn"
              type="button"
              onClick={closeHandsFree}
              className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-3 rounded-2xl bg-emerald-700 text-white font-bold text-xs sm:text-sm hover:bg-emerald-800 transition-colors shadow-md cursor-pointer shrink-0"
            >
              <span>Finish</span>
              <CheckCircle2 className="w-5 h-5" />
            </button>
          ) : (
            <button
              id="next_step_btn"
              type="button"
              onClick={() => nextHandsFreeStep(totalSteps)}
              className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-3 rounded-2xl bg-[#4A3B2C] text-[#FAF7F2] font-bold text-xs sm:text-sm hover:bg-[#382B1E] transition-colors shadow-md cursor-pointer shrink-0"
            >
              <span>Next</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Step dots */}
        <div className="flex items-center justify-center gap-1.5 mt-2 overflow-x-auto py-1">
          {recipe.instructions.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setHandsFreeStep(idx)}
              title={`Jump to step ${idx + 1}`}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                idx === handsFreeStepIndex
                  ? 'w-6 bg-[#FAF7F2]'
                  : completedSteps.has(idx)
                  ? 'w-2 bg-emerald-400'
                  : 'w-2 bg-[#FAF7F2]/40 hover:bg-[#FAF7F2]/70'
              }`}
            />
          ))}
        </div>
      </footer>
    </div>
    </ModalPortal>
  );
};
