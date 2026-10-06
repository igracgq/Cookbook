import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  collection, deleteDoc, doc, onSnapshot, serverTimestamp, setDoc, type DocumentData
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { setSharedContent } from '../data/cookbookDataSource';
import { uploadRecipePhoto } from '../services/cloudinary';
import { useAuth } from './AuthContext';
import { Recipe, RecipeCategory } from '../types';

/** What the "Add a recipe" form collects. */
export interface NewRecipeInput {
  title: string;
  category: RecipeCategory;
  servings: string;
  prepTime: string;
  cookTime: string;
  ingredients: string[];
  instructions: string[];
  notes: string;
  photo?: File | null;
}

interface CommunityContextType {
  /** Changes whenever shared recipes or photos change, so screens and memos can refresh. */
  contentVersion: number;
  addRecipe: (input: NewRecipeInput) => Promise<string>;
  deleteRecipe: (recipeId: string) => Promise<void>;
  /** One shared photo per recipe: this adds it, or replaces it if you are the one who shared it. */
  shareRecipePhoto: (recipe: Recipe, file: File) => Promise<void>;
  removeSharedPhoto: (recipe: Recipe) => Promise<void>;
  /** Who shared the photo currently shown for a recipe (uid), if any. */
  photoOwners: Record<string, string>;
}

const CommunityContext = createContext<CommunityContextType | null>(null);

const normalise = (line: string) =>
  line.toLowerCase().replace(/^[\d\s/.,½¼¾⅓⅔-]+/, '').replace(/\b(?:cups?|tbsp|tsp|tablespoons?|teaspoons?|oz|ounces?|lbs?|pounds?|g|kg|ml|l)\b\.?/g, '').replace(/\s+/g, ' ').trim() || line.toLowerCase();

function toRecipe(id: string, d: DocumentData): Recipe {
  return {
    id,
    title: d.title ?? 'Untitled',
    italianTitle: '',
    cookbookPage: 0,
    category: d.category ?? RecipeCategory.APPETIZERS,
    contributor: d.authorName || 'Family member',
    servings: d.servings ?? '',
    prepTime: d.prepTime ?? '',
    cookTime: d.cookTime ?? '',
    ingredients: (d.ingredients ?? []).map((t: string) => ({ rawText: t, normalizedName: normalise(t) })),
    instructions: d.instructions ?? [],
    notes: d.notes ?? '',
    tags: ['Shared recipe'],
    defaultRating: 0,
    ratingCount: 0,
    photos: [],
    imageUrl: d.imageUrl || undefined,
    imageBy: d.authorName || undefined,
    community: true,
    authorUid: d.authorUid,
    // a just-added recipe has no server time yet, so treat it as now
    addedAt: typeof d.createdAt?.toMillis === 'function' ? d.createdAt.toMillis() : Date.now()
  };
}

export const CommunityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [version, setVersion] = useState(0);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [photos, setPhotos] = useState<Record<string, { url: string; by: string; uid: string }>>({});

  useEffect(() => {
    if (!db) return;
    const offRecipes = onSnapshot(
      collection(db, 'recipes'),
      snap => setRecipes(snap.docs.map(d => toRecipe(d.id, d.data()))),
      () => {} // offline or rules problem: keep showing the cookbook as it is
    );
    const offPhotos = onSnapshot(
      collection(db, 'recipePhotos'),
      snap => {
        const next: Record<string, { url: string; by: string; uid: string }> = {};
        snap.forEach(d => {
          const x = d.data();
          if (x.imageUrl) next[d.id] = { url: x.imageUrl, by: x.uploadedByName ?? '', uid: x.uploadedBy ?? '' };
        });
        setPhotos(next);
      },
      () => {}
    );
    return () => { offRecipes(); offPhotos(); };
  }, []);

  // Push the shared content into the recipe list the whole app reads from.
  useEffect(() => {
    setSharedContent(recipes, Object.fromEntries(Object.entries(photos).map(([k, v]) => [k, { url: v.url, by: v.by }])));
    setVersion(v => v + 1);
  }, [recipes, photos]);

  const requireUser = () => {
    if (!user || !db) throw new Error('Please sign in first.');
    return { user, db };
  };

  const addRecipe = async (input: NewRecipeInput) => {
    const { user, db } = requireUser();
    const ref = doc(collection(db, 'recipes'));
    // Photo first, so the recipe document is written once, with its image URL in it.
    let imageUrl = '';
    if (input.photo) imageUrl = (await uploadRecipePhoto(input.photo, 'heritage-cookbook/recipes')).url;
    await setDoc(ref, {
      title: input.title.trim(),
      category: input.category,
      servings: input.servings.trim(),
      prepTime: input.prepTime.trim(),
      cookTime: input.cookTime.trim(),
      ingredients: input.ingredients,
      instructions: input.instructions,
      notes: input.notes.trim(),
      imageUrl,
      authorUid: user.uid,
      authorName: user.displayName ?? 'Family member',
      createdAt: serverTimestamp()
    });
    return ref.id;
  };

  const deleteRecipe = async (recipeId: string) => {
    const { db } = requireUser();
    await deleteDoc(doc(db, 'recipes', recipeId));
  };

  const shareRecipePhoto = async (recipe: Recipe, file: File) => {
    const { user, db } = requireUser();
    const { url } = await uploadRecipePhoto(file, 'heritage-cookbook/photos');
    if (recipe.community) {
      // A shared recipe keeps its one photo in its own document.
      await setDoc(doc(db, 'recipes', recipe.id), { imageUrl: url }, { merge: true });
    } else {
      await setDoc(doc(db, 'recipePhotos', recipe.id), {
        imageUrl: url,
        uploadedBy: user.uid,
        uploadedByName: user.displayName ?? 'Family member',
        updatedAt: serverTimestamp()
      });
    }
  };

  const removeSharedPhoto = async (recipe: Recipe) => {
    const { db } = requireUser();
    if (recipe.community) await setDoc(doc(db, 'recipes', recipe.id), { imageUrl: '' }, { merge: true });
    else await deleteDoc(doc(db, 'recipePhotos', recipe.id));
  };

  const photoOwners = Object.fromEntries(Object.entries(photos).map(([k, v]) => [k, v.uid]));

  return (
    <CommunityContext.Provider value={{ contentVersion: version, addRecipe, deleteRecipe, shareRecipePhoto, removeSharedPhoto, photoOwners }}>
      {children}
    </CommunityContext.Provider>
  );
};

export const useCommunity = (): CommunityContextType => {
  const ctx = useContext(CommunityContext);
  if (!ctx) throw new Error('useCommunity must be used inside CommunityProvider');
  return ctx;
};
