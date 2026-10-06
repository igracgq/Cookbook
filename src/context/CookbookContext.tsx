import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  allRecipes,
  commonPantryIngredients,
  findRecipeById,
  matchByIngredients,
  searchRecipes
} from '../data/cookbookDataSource';
import {
  DifficultyLevel,
  IndexViewMode,
  MatcherFilter,
  MatchResult,
  Recipe,
  RecipeCategory,
  RecipeQuickFilter,
  ScreenDestination,
  SpiceLevel,
  UnitSystem
} from '../types';
import { generateAutoTags } from '../utils/autoTagging';
import { calculateDifficulty, calculateNutrition, calculateSpiceLevel } from '../utils/recipeCalculator';

interface CookbookContextType {
  // Navigation
  currentScreen: ScreenDestination;
  navigateTo: (dest: ScreenDestination) => void;
  navigateBack: () => void;

  // Search & Filters
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: RecipeCategory | null;
  setSelectedCategory: (cat: RecipeCategory | null) => void;
  selectedFilter: RecipeQuickFilter;
  setSelectedFilter: (filter: RecipeQuickFilter) => void;
  selectedDifficulty: DifficultyLevel | null;
  setSelectedDifficulty: (diff: DifficultyLevel | null) => void;
  selectedAutoTag: string | null;
  setSelectedAutoTag: (tag: string | null) => void;
  filteredRecipes: Recipe[];

  // Favorites & Ratings
  favoriteRecipeIds: Set<string>;
  toggleFavorite: (recipeId: string) => void;
  userRatings: Record<string, number>;
  rateRecipe: (recipeId: string, rating: number) => void;
  getEffectiveRating: (recipe: Recipe) => [number, number];

  // Custom Photos & Notes
  customRecipePhotos: Record<string, string>;
  setCustomRecipePhoto: (recipeId: string, photoUri: string) => void;
  removeCustomRecipePhoto: (recipeId: string) => void;
  userNotes: Record<string, string>;
  saveRecipeNote: (recipeId: string, note: string) => void;

  // Custom Spice & Units
  recipeSpiceCustomization: Record<string, SpiceLevel>;
  setRecipeCustomSpice: (recipeId: string, spice: SpiceLevel) => void;
  getEffectiveSpiceLevel: (recipe: Recipe) => SpiceLevel;
  unitSystem: UnitSystem;
  setUnitSystem: (sys: UnitSystem) => void;

  // Pantry
  pantryItems: string[];
  addPantryIngredient: (name: string) => void;
  removePantryIngredient: (name: string) => void;
  clearAllPantry: () => void;
  seedCommonPantry: () => void;
  addRecipeIngredientsToPantry: (recipe: Recipe) => void;
  matcherFilter: MatcherFilter;
  setMatcherFilter: (filter: MatcherFilter) => void;
  pantryMatches: MatchResult[];

  // Index Screen
  indexMode: IndexViewMode;
  setIndexMode: (mode: IndexViewMode) => void;
  selectedLetter: string | null;
  setSelectedLetter: (letter: string | null) => void;

  // Timer
  timerTotalSeconds: number;
  timerSecondsRemaining: number;
  isTimerRunning: boolean;
  timerLabel: string;
  isTimerAlertTriggered: boolean;
  startTimer: (minutes: number, label?: string) => void;
  startRecipeTimer: (recipe: Recipe) => void;
  addTimerMinutes: (minutes: number) => void;
  pauseResumeTimer: () => void;
  resetTimer: () => void;
  dismissTimerAlert: () => void;

  // Hands Free
  isHandsFreeActive: boolean;
  handsFreeStepIndex: number;
  openHandsFree: (initialStep?: number) => void;
  closeHandsFree: () => void;
  nextHandsFreeStep: (totalSteps: number) => void;
  prevHandsFreeStep: () => void;
  setHandsFreeStep: (step: number) => void;

  // Print Export
  isPrintExportOpen: boolean;
  printExportRecipeId: string | null;
  openPrintExport: (recipeId?: string | null) => void;
  closePrintExport: () => void;

  // Serving scale
  servingMultiplier: number;
  setServingMultiplier: (mul: number) => void;
  checkedIngredients: Set<string>;
  toggleIngredientChecked: (rawText: string) => void;
  resetIngredientChecks: () => void;

  // Helper
  getRecipeById: (id: string) => Recipe | undefined;
}

const CookbookContext = createContext<CookbookContextType | null>(null);

const STORAGE_KEYS = {
  FAVORITES: 'heritage_cookbook_favorites',
  RATINGS: 'heritage_cookbook_ratings',
  PHOTOS: 'heritage_cookbook_photos',
  NOTES: 'heritage_cookbook_notes',
  PANTRY: 'heritage_cookbook_pantry',
  SPICE: 'heritage_cookbook_spice',
  UNIT_SYSTEM: 'heritage_cookbook_unit_system'
};

export const CookbookProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [currentScreen, setCurrentScreen] = useState<ScreenDestination>({ type: 'explore' });

  const navigateTo = (dest: ScreenDestination) => {
    setCurrentScreen(dest);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateBack = () => {
    if (currentScreen.type === 'detail') {
      setCurrentScreen({ type: 'explore' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<RecipeCategory | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<RecipeQuickFilter>(RecipeQuickFilter.ALL);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | null>(null);
  const [selectedAutoTag, setSelectedAutoTag] = useState<string | null>(null);

  // Favorites
  const [favoriteRecipeIds, setFavoriteRecipeIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      return saved ? new Set(JSON.parse(saved)) : new Set(['pasta_fresca', 'tiramisu_classic', 'bruschetta_classica']);
    } catch {
      return new Set(['pasta_fresca', 'tiramisu_classic', 'bruschetta_classica']);
    }
  });

  const toggleFavorite = (recipeId: string) => {
    setFavoriteRecipeIds(prev => {
      const next = new Set(prev);
      if (next.has(recipeId)) {
        next.delete(recipeId);
      } else {
        next.add(recipeId);
      }
      try {
        localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(Array.from(next)));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  // Ratings
  const [userRatings, setUserRatings] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RATINGS);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const rateRecipe = (recipeId: string, rating: number) => {
    setUserRatings(prev => {
      const next = { ...prev, [recipeId]: rating };
      try {
        localStorage.setItem(STORAGE_KEYS.RATINGS, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const getEffectiveRating = (recipe: Recipe): [number, number] => {
    const userRate = userRatings[recipe.id];
    if (userRate === undefined) {
      return [recipe.defaultRating, recipe.ratingCount];
    }
    const newCount = recipe.ratingCount + 1;
    const newAvg = (recipe.defaultRating * recipe.ratingCount + userRate) / newCount;
    return [Math.round(newAvg * 10) / 10, newCount];
  };

  // Custom Photos
  const [customRecipePhotos, setCustomRecipePhotos] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PHOTOS);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const setCustomRecipePhoto = (recipeId: string, photoUri: string) => {
    setCustomRecipePhotos(prev => {
      const next = { ...prev, [recipeId]: photoUri };
      try {
        localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const removeCustomRecipePhoto = (recipeId: string) => {
    setCustomRecipePhotos(prev => {
      const next = { ...prev };
      delete next[recipeId];
      try {
        localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  // Notes
  const [userNotes, setUserNotes] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTES);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const saveRecipeNote = (recipeId: string, note: string) => {
    setUserNotes(prev => {
      const next = { ...prev, [recipeId]: note };
      try {
        localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  // Spice Customization
  const [recipeSpiceCustomization, setRecipeSpiceCustomization] = useState<Record<string, SpiceLevel>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SPICE);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const setRecipeCustomSpice = (recipeId: string, spice: SpiceLevel) => {
    setRecipeSpiceCustomization(prev => {
      const next = { ...prev, [recipeId]: spice };
      try {
        localStorage.setItem(STORAGE_KEYS.SPICE, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const getEffectiveSpiceLevel = (recipe: Recipe): SpiceLevel => {
    return recipeSpiceCustomization[recipe.id] ?? calculateSpiceLevel(recipe);
  };

  // Unit System
  const [unitSystem, setUnitSystemState] = useState<UnitSystem>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.UNIT_SYSTEM);
      return saved === UnitSystem.METRIC ? UnitSystem.METRIC : UnitSystem.IMPERIAL;
    } catch {
      return UnitSystem.IMPERIAL;
    }
  });

  const setUnitSystem = (sys: UnitSystem) => {
    setUnitSystemState(sys);
    try {
      localStorage.setItem(STORAGE_KEYS.UNIT_SYSTEM, sys);
    } catch (e) {
      console.error(e);
    }
  };

  // Pantry
  const [pantryItems, setPantryItems] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PANTRY);
      return saved
        ? JSON.parse(saved)
        : ['garlic', 'olive oil', 'eggs', 'tomatoes', 'pasta', 'parmesan', 'flour', 'onion'];
    } catch {
      return ['garlic', 'olive oil', 'eggs', 'tomatoes', 'pasta', 'parmesan', 'flour', 'onion'];
    }
  });

  const [matcherFilter, setMatcherFilter] = useState<MatcherFilter>(MatcherFilter.ALL_MATCHES);

  const addPantryIngredient = (name: string) => {
    const clean = name.trim().toLowerCase();
    if (!clean) return;
    setPantryItems(prev => {
      if (prev.includes(clean)) return prev;
      const next = [...prev, clean];
      try {
        localStorage.setItem(STORAGE_KEYS.PANTRY, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const removePantryIngredient = (name: string) => {
    const clean = name.trim().toLowerCase();
    setPantryItems(prev => {
      const next = prev.filter(i => i !== clean);
      try {
        localStorage.setItem(STORAGE_KEYS.PANTRY, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const clearAllPantry = () => {
    setPantryItems([]);
    try {
      localStorage.setItem(STORAGE_KEYS.PANTRY, JSON.stringify([]));
    } catch (e) {
      console.error(e);
    }
  };

  const seedCommonPantry = () => {
    const seeds = ['eggs', 'garlic', 'olive oil', 'flour', 'sugar', 'parmesan', 'tomatoes', 'onion', 'pasta', 'ricotta', 'basil'];
    setPantryItems(prev => {
      const set = new Set([...prev, ...seeds]);
      const next = Array.from(set);
      try {
        localStorage.setItem(STORAGE_KEYS.PANTRY, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const addRecipeIngredientsToPantry = (recipe: Recipe) => {
    const items = recipe.ingredients.map(i => i.normalizedName.toLowerCase());
    setPantryItems(prev => {
      const set = new Set([...prev, ...items]);
      const next = Array.from(set);
      try {
        localStorage.setItem(STORAGE_KEYS.PANTRY, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const pantryMatches = useMemo(() => {
    const all = matchByIngredients(new Set(pantryItems));
    switch (matcherFilter) {
      case MatcherFilter.CAN_COOK_NOW:
        return all.filter(m => m.missingIngredients.length === 0);
      case MatcherFilter.MISSING_1_2:
        return all.filter(m => m.missingIngredients.length >= 1 && m.missingIngredients.length <= 2);
      case MatcherFilter.ALL_MATCHES:
      default:
        return all;
    }
  }, [pantryItems, matcherFilter]);

  // Index Mode
  const [indexMode, setIndexMode] = useState<IndexViewMode>(IndexViewMode.ALPHABETICAL_A_TO_Z);
  const [selectedLetter, setSelectedLetter] = useState<string | null>('A');

  // Filtered recipes
  const filteredRecipes = useMemo(() => {
    let list = searchRecipes(searchQuery, selectedCategory);

    if (selectedDifficulty) {
      list = list.filter(r => calculateDifficulty(r) === selectedDifficulty);
    }

    if (selectedAutoTag) {
      list = list.filter(r => generateAutoTags(r).includes(selectedAutoTag));
    }

    switch (selectedFilter) {
      case RecipeQuickFilter.ALL:
        return list;
      case RecipeQuickFilter.FAVORITES:
        return list.filter(r => favoriteRecipeIds.has(r.id));
      case RecipeQuickFilter.GLUTEN_FREE:
        return list.filter(r => r.diet?.includes('gluten-free'));
      case RecipeQuickFilter.VEGAN:
        return list.filter(r => r.diet?.includes('vegan'));
      case RecipeQuickFilter.SPICY:
        return list.filter(r => r.diet?.includes('spicy'));
      case RecipeQuickFilter.POULTRY:
        return list.filter(r => r.diet?.includes('poultry'));
      case RecipeQuickFilter.SEAFOOD:
        return list.filter(r => r.diet?.includes('seafood'));
      case RecipeQuickFilter.RED_MEAT:
        return list.filter(r => r.diet?.includes('red-meat'));
      case RecipeQuickFilter.EASY:
        return list.filter(r => calculateDifficulty(r) === DifficultyLevel.EASY);
      case RecipeQuickFilter.FAMILY_HERITAGE:
        return list.filter(r => {
          const c = r.contributor.toLowerCase();
          return c.includes('rosina') || c.includes('sandy') || c.includes('ornella') || c.includes('bruna') || c.includes('elvira') || c.includes('teresa');
        });
      case RecipeQuickFilter.VEGETARIAN:
        return list.filter(r => r.diet?.includes('vegetarian'));
      case RecipeQuickFilter.QUICK:
        return list.filter(r => {
          const ct = r.cookTime.toLowerCase();
          return (
            ct.includes('5 min') || ct.includes('10 min') || ct.includes('12 min') ||
            ct.includes('15 min') || ct.includes('20 min') || ct.includes('none') ||
            generateAutoTags(r).includes('Under 30 Min')
          );
        });
      default:
        return list;
    }
  }, [searchQuery, selectedCategory, selectedDifficulty, selectedAutoTag, selectedFilter, favoriteRecipeIds, userRatings]);

  // Enhanced Kitchen Timer
  const [timerTotalSeconds, setTimerTotalSeconds] = useState(0);
  const [timerSecondsRemaining, setTimerSecondsRemaining] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerLabel, setTimerLabel] = useState('Kitchen Timer');
  const [isTimerAlertTriggered, setIsTimerAlertTriggered] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timerSecondsRemaining > 0) {
      interval = setInterval(() => {
        setTimerSecondsRemaining(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            setIsTimerAlertTriggered(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSecondsRemaining]);

  const startTimer = (minutes: number, label = 'Kitchen Timer') => {
    const total = Math.max(10, minutes * 60);
    setTimerTotalSeconds(total);
    setTimerSecondsRemaining(total);
    setTimerLabel(label);
    setIsTimerRunning(true);
    setIsTimerAlertTriggered(false);
  };

  const startRecipeTimer = (recipe: Recipe) => {
    const clean = recipe.cookTime.toLowerCase();
    let mins = 15;
    if (clean.includes('hr') || clean.includes('hour')) {
      const m = clean.match(/(\d+)/);
      const hours = m ? parseInt(m[1], 10) : 1;
      mins = hours * 60;
    } else if (clean.includes('min')) {
      const matches = Array.from(clean.matchAll(/(\d+)/g)).map(m => parseInt(m[0], 10));
      mins = matches.length > 0 ? Math.max(...matches) : 15;
    }
    startTimer(mins, `${recipe.title} (${mins}m)`);
  };

  const addTimerMinutes = (minutes: number) => {
    const deltaSec = minutes * 60;
    setTimerSecondsRemaining(prev => {
      const next = Math.max(0, prev + deltaSec);
      if (next > timerTotalSeconds) {
        setTimerTotalSeconds(next);
      }
      return next;
    });
  };

  const pauseResumeTimer = () => {
    if (isTimerRunning) {
      setIsTimerRunning(false);
    } else if (timerSecondsRemaining > 0) {
      setIsTimerRunning(true);
      setIsTimerAlertTriggered(false);
    }
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimerSecondsRemaining(0);
    setTimerTotalSeconds(0);
    setIsTimerAlertTriggered(false);
  };

  const dismissTimerAlert = () => {
    setIsTimerAlertTriggered(false);
  };

  // Hands-Free Cooking Mode
  const [isHandsFreeActive, setIsHandsFreeActive] = useState(false);
  const [handsFreeStepIndex, setHandsFreeStepIndex] = useState(0);

  const openHandsFree = (initialStep = 0) => {
    setHandsFreeStepIndex(Math.max(0, initialStep));
    setIsHandsFreeActive(true);
  };

  const closeHandsFree = () => {
    setIsHandsFreeActive(false);
  };

  const nextHandsFreeStep = (totalSteps: number) => {
    setHandsFreeStepIndex(prev => Math.min(totalSteps - 1, prev + 1));
  };

  const prevHandsFreeStep = () => {
    setHandsFreeStepIndex(prev => Math.max(0, prev - 1));
  };

  const setHandsFreeStep = (step: number) => {
    setHandsFreeStepIndex(Math.max(0, step));
  };

  // Print Export Dialog
  const [isPrintExportOpen, setIsPrintExportOpen] = useState(false);
  const [printExportRecipeId, setPrintExportRecipeId] = useState<string | null>(null);

  const openPrintExport = (recipeId?: string | null) => {
    setPrintExportRecipeId(recipeId ?? null);
    setIsPrintExportOpen(true);
  };

  const closePrintExport = () => {
    setIsPrintExportOpen(false);
  };

  // Serving scale & checked ingredients in recipe detail
  const [servingMultiplier, setServingMultiplier] = useState(1.0);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(new Set());

  const toggleIngredientChecked = (rawText: string) => {
    setCheckedIngredients(prev => {
      const next = new Set(prev);
      if (next.has(rawText)) {
        next.delete(rawText);
      } else {
        next.add(rawText);
      }
      return next;
    });
  };

  const resetIngredientChecks = () => {
    setCheckedIngredients(new Set());
    setServingMultiplier(1.0);
  };

  const getRecipeById = (id: string) => findRecipeById(id);

  return (
    <CookbookContext.Provider
      value={{
        currentScreen,
        navigateTo,
        navigateBack,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedFilter,
        setSelectedFilter,
        selectedDifficulty,
        setSelectedDifficulty,
        selectedAutoTag,
        setSelectedAutoTag,
        filteredRecipes,
        favoriteRecipeIds,
        toggleFavorite,
        userRatings,
        rateRecipe,
        getEffectiveRating,
        customRecipePhotos,
        setCustomRecipePhoto,
        removeCustomRecipePhoto,
        userNotes,
        saveRecipeNote,
        recipeSpiceCustomization,
        setRecipeCustomSpice,
        getEffectiveSpiceLevel,
        unitSystem,
        setUnitSystem,
        pantryItems,
        addPantryIngredient,
        removePantryIngredient,
        clearAllPantry,
        seedCommonPantry,
        addRecipeIngredientsToPantry,
        matcherFilter,
        setMatcherFilter,
        pantryMatches,
        indexMode,
        setIndexMode,
        selectedLetter,
        setSelectedLetter,
        timerTotalSeconds,
        timerSecondsRemaining,
        isTimerRunning,
        timerLabel,
        isTimerAlertTriggered,
        startTimer,
        startRecipeTimer,
        addTimerMinutes,
        pauseResumeTimer,
        resetTimer,
        dismissTimerAlert,
        isHandsFreeActive,
        handsFreeStepIndex,
        openHandsFree,
        closeHandsFree,
        nextHandsFreeStep,
        prevHandsFreeStep,
        setHandsFreeStep,
        isPrintExportOpen,
        printExportRecipeId,
        openPrintExport,
        closePrintExport,
        servingMultiplier,
        setServingMultiplier,
        checkedIngredients,
        toggleIngredientChecked,
        resetIngredientChecks,
        getRecipeById
      }}
    >
      {children}
    </CookbookContext.Provider>
  );
};

export function useCookbook() {
  const context = useContext(CookbookContext);
  if (!context) {
    throw new Error('useCookbook must be used within a CookbookProvider');
  }
  return context;
}
