import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { collection, deleteDoc, doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from './AuthContext';

/**
 * Star ratings from every member. Each rating lives in recipeRatings/{recipeId}__{uid} (one per member per recipe),
 * and the whole collection is read once and averaged here, so the recipe list and each recipe can show
 * "4.3 average from 12 ratings" without any extra reads.
 */
export interface RatingSummary {
  average: number;
  count: number;
}

interface RatingsContextType {
  summaryFor: (recipeId: string) => RatingSummary;
  /** The signed-in member's own stars for a recipe, or 0. */
  myRating: (recipeId: string) => number;
  /** Set (1-5) or, with 0, take back the member's rating. */
  rate: (recipeId: string, stars: number) => Promise<void>;
}

const RatingsContext = createContext<RatingsContextType | null>(null);

export const RatingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [all, setAll] = useState<Array<{ recipeId: string; uid: string; stars: number }>>([]);

  useEffect(() => {
    if (!db) return;
    return onSnapshot(
      collection(db, 'recipeRatings'),
      snap => setAll(
        snap.docs
          .map(d => ({ recipeId: String(d.data().recipeId ?? ''), uid: String(d.data().uid ?? ''), stars: Number(d.data().stars) }))
          .filter(r => r.recipeId && r.stars >= 1 && r.stars <= 5)
      ),
      () => {}
    );
  }, []);

  const { sums, mine } = useMemo(() => {
    const sums = new Map<string, { total: number; count: number }>();
    const mine = new Map<string, number>();
    for (const r of all) {
      const s = sums.get(r.recipeId) ?? { total: 0, count: 0 };
      s.total += r.stars; s.count += 1;
      sums.set(r.recipeId, s);
      if (user && r.uid === user.uid) mine.set(r.recipeId, r.stars);
    }
    return { sums, mine };
  }, [all, user?.uid]);

  const summaryFor = useCallback((recipeId: string): RatingSummary => {
    const s = sums.get(recipeId);
    return s ? { average: s.total / s.count, count: s.count } : { average: 0, count: 0 };
  }, [sums]);

  const myRating = useCallback((recipeId: string) => mine.get(recipeId) ?? 0, [mine]);

  const rate = useCallback(async (recipeId: string, stars: number) => {
    if (!user || !db) throw new Error('Please sign in first.');
    const ref = doc(db, 'recipeRatings', `${recipeId}__${user.uid}`);
    if (stars < 1) await deleteDoc(ref);
    else await setDoc(ref, { recipeId, uid: user.uid, stars: Math.round(Math.min(5, stars)), updatedAt: serverTimestamp() });
  }, [user?.uid]);

  return <RatingsContext.Provider value={{ summaryFor, myRating, rate }}>{children}</RatingsContext.Provider>;
};

export const useRatings = (): RatingsContextType => {
  const ctx = useContext(RatingsContext);
  if (!ctx) throw new Error('useRatings must be used inside RatingsProvider');
  return ctx;
};
