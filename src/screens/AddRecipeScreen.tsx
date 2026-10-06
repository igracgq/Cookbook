import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle2, ImagePlus, Loader2, LogIn, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCommunity } from '../context/CommunityContext';
import { useCookbook } from '../context/CookbookContext';
import { isUploadConfigured, validateImageFile } from '../services/cloudinary';
import { CATEGORY_INFO, RecipeCategory } from '../types';

export const RECIPE_LIMITS = { title: 120, line: 300, step: 1000, lines: 60, notes: 2000, short: 60 };

const splitLines = (text: string) => text.split('\n').map(l => l.trim()).filter(Boolean);

const field = 'w-full px-3 py-2 bg-[#FAF7F2] border border-[#D2C4B1] rounded-xl text-sm text-[#261D16] placeholder:text-[#857566] focus:outline-none focus:ring-2 focus:ring-[#4A3B2C]';
const label = 'block text-xs font-bold uppercase tracking-wider text-[#5C4E40] mb-1';

export const AddRecipeScreen: React.FC = () => {
  const { cloudAvailable, user, loading, signIn } = useAuth();
  const { addRecipe } = useCommunity();
  const { navigateTo } = useCookbook();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<RecipeCategory>(RecipeCategory.PASTA_AND_SAUCES);
  const [servings, setServings] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [notes, setNotes] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedTitle, setSavedTitle] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!photo) { setPreview(null); return; }
    const url = URL.createObjectURL(photo);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [photo]);

  const chooseFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    const problem = validateImageFile(f);
    if (problem) { setError(problem); return; }
    setError(null);
    setPhoto(f);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const ing = splitLines(ingredients);
    const steps = splitLines(instructions);
    if (!title.trim()) return setError('Please give the recipe a name.');
    if (title.trim().length > RECIPE_LIMITS.title) return setError(`The name can be at most ${RECIPE_LIMITS.title} characters.`);
    if (ing.length === 0) return setError('Please add at least one ingredient, one per line.');
    if (steps.length === 0) return setError('Please add at least one step, one per line.');
    if (ing.length > RECIPE_LIMITS.lines || steps.length > RECIPE_LIMITS.lines) return setError(`Please keep it to ${RECIPE_LIMITS.lines} lines each for ingredients and steps.`);
    if (ing.some(l => l.length > RECIPE_LIMITS.line)) return setError(`Each ingredient line can be at most ${RECIPE_LIMITS.line} characters.`);
    if (steps.some(l => l.length > RECIPE_LIMITS.step)) return setError(`Each step can be at most ${RECIPE_LIMITS.step} characters.`);
    if (notes.length > RECIPE_LIMITS.notes) return setError(`Notes can be at most ${RECIPE_LIMITS.notes} characters.`);
    setSaving(true);
    try {
      await addRecipe({ title, category, servings, prepTime, cookTime, ingredients: ing, instructions: steps, notes, photo });
      setSavedTitle(title.trim());
    } catch (err: any) {
      setError(err?.message || 'The recipe could not be saved. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const reset = () => {
    setTitle(''); setServings(''); setPrepTime(''); setCookTime(''); setIngredients(''); setInstructions(''); setNotes('');
    setPhoto(null); setSavedTitle(null); setError(null);
  };

  const shell = (children: React.ReactNode) => (
    <div id="add_recipe_screen" className="max-w-2xl mx-auto px-4 sm:px-6 py-6 pb-28 sm:pb-16 space-y-5">
      <div className="space-y-1">
        <h2 className="font-serif-heritage text-3xl font-bold text-[#261D16]">Add a recipe</h2>
        <p className="text-sm text-[#5C4E40]">Share a recipe with the family. Everyone using the cookbook will see it.</p>
      </div>
      {children}
    </div>
  );

  if (!cloudAvailable) {
    return shell(
      <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#D2C4B1] text-sm text-[#5C4E40] space-y-1">
        <p><strong>Sharing is not switched on yet.</strong></p>
        <p>The person who looks after this cookbook needs to connect it to Firebase and Cloudinary first. The steps are in <code>docs/SHARING_SETUP.md</code>.</p>
      </div>
    );
  }

  if (loading) return shell(<div className="h-24 rounded-2xl bg-[#EBE3D6] animate-pulse" />);

  if (!user) {
    return shell(
      <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#D2C4B1] space-y-3 text-sm text-[#5C4E40]">
        <p>Please sign in with your Google account to add a recipe. Anyone can read the cookbook, but only signed-in family members can add to it.</p>
        <button
          type="button"
          onClick={signIn}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#4A3B2C] text-[#FAF7F2] text-sm font-semibold hover:bg-[#382B1E] cursor-pointer"
        >
          <LogIn className="w-4 h-4" /> Sign in with Google
        </button>
      </div>
    );
  }

  if (savedTitle) {
    return shell(
      <div className="p-5 rounded-2xl bg-[#E4EFE0] border border-[#A7CE9B] space-y-3 text-sm text-[#2A441E]">
        <p className="flex items-center gap-2 font-semibold"><CheckCircle2 className="w-4 h-4" /> “{savedTitle}” is now in the cookbook.</p>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => navigateTo({ type: 'explore' })} className="px-3 py-1.5 rounded-xl bg-[#4A3B2C] text-[#FAF7F2] font-semibold cursor-pointer">Back to the cookbook</button>
          <button type="button" onClick={reset} className="px-3 py-1.5 rounded-xl bg-[#FAF7F2] border border-[#A7CE9B] font-semibold cursor-pointer">Add another</button>
        </div>
      </div>
    );
  }

  return shell(
    <form onSubmit={submit} className="space-y-4" noValidate>
      <div>
        <label className={label} htmlFor="new_title">Recipe name</label>
        <input id="new_title" className={field} value={title} maxLength={RECIPE_LIMITS.title} onChange={e => setTitle(e.target.value)} placeholder="Nonna's Sunday Gravy" />
      </div>
      <div>
        <label className={label} htmlFor="new_category">Section</label>
        <select id="new_category" className={field} value={category} onChange={e => setCategory(e.target.value as RecipeCategory)}>
          {Object.entries(CATEGORY_INFO).map(([key, info]) => (
            <option key={key} value={key}>{info.displayName}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className={label} htmlFor="new_servings">Serves</label>
          <input id="new_servings" className={field} value={servings} maxLength={RECIPE_LIMITS.short} onChange={e => setServings(e.target.value)} placeholder="6-8 servings" />
        </div>
        <div>
          <label className={label} htmlFor="new_prep">Prep time</label>
          <input id="new_prep" className={field} value={prepTime} maxLength={RECIPE_LIMITS.short} onChange={e => setPrepTime(e.target.value)} placeholder="20 mins" />
        </div>
        <div>
          <label className={label} htmlFor="new_cook">Cook time</label>
          <input id="new_cook" className={field} value={cookTime} maxLength={RECIPE_LIMITS.short} onChange={e => setCookTime(e.target.value)} placeholder="1 hr" />
        </div>
      </div>
      <div>
        <label className={label} htmlFor="new_ingredients">Ingredients <span className="normal-case font-normal text-[#857566]">(one per line)</span></label>
        <textarea id="new_ingredients" className={field} rows={7} value={ingredients} onChange={e => setIngredients(e.target.value)} placeholder={'2 cups flour\n3 eggs\nPinch of salt'} />
      </div>
      <div>
        <label className={label} htmlFor="new_steps">Steps <span className="normal-case font-normal text-[#857566]">(one per line)</span></label>
        <textarea id="new_steps" className={field} rows={7} value={instructions} onChange={e => setInstructions(e.target.value)} placeholder={'Mix the flour and eggs.\nRest the dough for 30 minutes.'} />
      </div>
      <div>
        <label className={label} htmlFor="new_notes">Notes <span className="normal-case font-normal text-[#857566]">(optional)</span></label>
        <textarea id="new_notes" className={field} rows={3} value={notes} maxLength={RECIPE_LIMITS.notes} onChange={e => setNotes(e.target.value)} placeholder="Who made it, when you serve it, tips…" />
      </div>

      <div>
        <span className={label}>Photo <span className="normal-case font-normal text-[#857566]">(optional, one per recipe)</span></span>
        {!isUploadConfigured ? (
          <p className="text-xs text-[#857566]">Photo uploads are not switched on yet, so this recipe will be saved without a picture.</p>
        ) : preview ? (
          <div className="flex items-start gap-3">
            <img src={preview} alt="Chosen photo" className="w-32 h-24 object-cover rounded-xl border border-[#D2C4B1]" />
            <button type="button" onClick={() => setPhoto(null)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EBE3D6] border border-[#D2C4B1] text-xs font-semibold text-[#4A3B2C] cursor-pointer">
              <Trash2 className="w-3.5 h-3.5" /> Remove photo
            </button>
          </div>
        ) : (
          <>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif" className="hidden" onChange={chooseFile} />
            <button type="button" onClick={() => fileRef.current?.click()} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#EBE3D6] border border-[#D2C4B1] text-xs font-semibold text-[#4A3B2C] hover:bg-[#E4DBCF] cursor-pointer">
              <ImagePlus className="w-4 h-4" /> Choose a photo
            </button>
            <p className="text-[11px] text-[#857566] mt-1">JPEG, PNG, WebP or HEIC. Big photos are shrunk before they are uploaded.</p>
          </>
        )}
      </div>

      {error && <p role="alert" className="text-sm text-[#B8452D] bg-[#FAF7F2] border border-[#B8452D]/40 rounded-xl p-3">{error}</p>}

      <button
        id="save_recipe_btn"
        type="submit"
        disabled={saving}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4A3B2C] text-[#FAF7F2] text-sm font-semibold hover:bg-[#382B1E] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
      >
        {saving && <Loader2 className="w-4 h-4 animate-spin" />}
        {saving ? (photo ? 'Uploading photo…' : 'Saving…') : 'Save recipe'}
      </button>
    </form>
  );
};
