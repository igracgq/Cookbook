import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  addDoc, collection, deleteDoc, doc, onSnapshot, serverTimestamp, setDoc, updateDoc, type DocumentData
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
  /** Changes a recipe the signed-in member added. A new photo replaces the old one; removePhoto clears it. */
  updateRecipe: (recipeId: string, input: NewRecipeInput & { removePhoto?: boolean }) => Promise<void>;
  deleteRecipe: (recipeId: string) => Promise<void>;
  /** Adds a photo to a recipe. Members can add as many as they like; each also appears in the Photos section. */
  shareRecipePhoto: (recipe: Recipe, file: File) => Promise<void>;
  /** Removes a member photo (the file stays in Cloudinary). Only allowed for its owner, or the cookbook owner. */
  removeMemberPhoto: (photo: { id: string; source: 'photo' | 'legacy' | 'recipe'; recipeId?: string }) => Promise<void>;
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
  const [photos, setPhotos] = useState<Record<string, { url: string; by: string; uid: string; at: number }>>({});
  const [memberPhotos, setMemberPhotos] = useState<Record<string, NonNullable<Recipe['memberPhotos']>>>({});

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
        const next: Record<string, { url: string; by: string; uid: string; at: number }> = {};
        snap.forEach(d => {
          const x = d.data();
          if (x.imageUrl) next[d.id] = {
            url: x.imageUrl,
            by: x.uploadedByName ?? '',
            uid: x.uploadedBy ?? '',
            // a photo just shared has no server time yet, so treat it as now
            at: typeof x.updatedAt?.toMillis === 'function' ? x.updatedAt.toMillis() : Date.now()
          };
        });
        setPhotos(next);
      },
      () => {}
    );
    const offMember = onSnapshot(
      collection(db, 'sharedPhotos'),
      snap => {
        const next: Record<string, NonNullable<Recipe['memberPhotos']>> = {};
        snap.forEach(d => {
          const x = d.data();
          if (!x.imageUrl || !x.recipeId) return;
          (next[x.recipeId] ??= []).push({
            id: d.id,
            url: x.imageUrl,
            by: x.uploadedByName ?? '',
            uid: x.uploadedBy ?? '',
            // a photo just added has no server time yet, so treat it as now
            at: typeof x.createdAt?.toMillis === 'function' ? x.createdAt.toMillis() : Date.now()
          });
        });
        setMemberPhotos(next);
      },
      () => {}
    );
    return () => { offRecipes(); offPhotos(); offMember(); };
  }, []);

  // Push the shared content into the recipe list the whole app reads from.
  useEffect(() => {
    setSharedContent(recipes, photos, memberPhotos);
    setVersion(v => v + 1);
  }, [recipes, photos, memberPhotos]);

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

  const updateRecipe = async (recipeId: string, input: NewRecipeInput & { removePhoto?: boolean }) => {
    const { db } = requireUser();
    const changes: Record<string, unknown> = {
      title: input.title.trim(),
      category: input.category,
      servings: input.servings.trim(),
      prepTime: input.prepTime.trim(),
      cookTime: input.cookTime.trim(),
      ingredients: input.ingredients,
      instructions: input.instructions,
      notes: input.notes.trim()
    };
    // Photo first, so the recipe is written once. Without a new photo the old one is kept, unless it was removed.
    if (input.photo) changes.imageUrl = (await uploadRecipePhoto(input.photo, 'heritage-cookbook/recipes')).url;
    else if (input.removePhoto) changes.imageUrl = '';
    // Only these fields are sent: who added the recipe and when stay as they were (the rules insist on it).
    await updateDoc(doc(db, 'recipes', recipeId), changes);
  };

  const deleteRecipe = async (recipeId: string) => {
    const { db } = requireUser();
    await deleteDoc(doc(db, 'recipes', recipeId));
  };

  const shareRecipePhoto = async (recipe: Recipe, file: File) => {
    const { user, db } = requireUser();
    const { url } = await uploadRecipePhoto(file, 'heritage-cookbook/photos');
    await addDoc(collection(db, 'sharedPhotos'), {
      recipeId: recipe.id,
      imageUrl: url,
      uploadedBy: user.uid,
      uploadedByName: user.displayName ?? 'Family member',
      createdAt: serverTimestamp()
    });
  };

  const removeMemberPhoto = async (photo: { id: string; source: 'photo' | 'legacy' | 'recipe'; recipeId?: string }) => {
    const { db } = requireUser();
    if (photo.source === 'photo') await deleteDoc(doc(db, 'sharedPhotos', photo.id.replace(/^photo_/, '')));
    else if (!photo.recipeId) throw new Error('Unknown recipe.');
    else if (photo.source === 'legacy') await deleteDoc(doc(db, 'recipePhotos', photo.recipeId));
    else await setDoc(doc(db, 'recipes', photo.recipeId), { imageUrl: '' }, { merge: true });
  };

  return (
    <CommunityContext.Provider value={{ contentVersion: version, addRecipe, updateRecipe, deleteRecipe, shareRecipePhoto, removeMemberPhoto }}>
      {children}
    </CommunityContext.Provider>
  );
};

export const useCommunity = (): CommunityContextType => {
  const ctx = useContext(CommunityContext);
  if (!ctx) throw new Error('useCommunity must be used inside CommunityProvider');
  return ctx;
};
