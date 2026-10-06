import React, { useState } from 'react';
import { Check, Plus, ShoppingCart, UtensilsCrossed, X } from 'lucide-react';
import { useCookbook } from '../context/CookbookContext';
import { ShareListButtons } from '../components/ShareListButtons';
import { itemLabel, listMessage } from '../utils/shareList';

export const ShoppingListScreen: React.FC = () => {
  const {
    shoppingList,
    addCustomShoppingItem,
    toggleShoppingItemBought,
    removeShoppingItem,
    clearShoppingList,
    moveBoughtToPantry,
    navigateTo
  } = useCookbook();

  const [inputVal, setInputVal] = useState('');
  const [confirmClear, setConfirmClear] = useState(false);

  const toBuy = shoppingList.filter(i => !i.bought);
  const bought = shoppingList.filter(i => i.bought);

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    addCustomShoppingItem(inputVal);
    setInputVal('');
  };

  return (
    <div id="shopping_list_screen" className="max-w-3xl mx-auto px-4 sm:px-6 py-6 pb-28 sm:pb-16 space-y-6">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBE3D6] text-[#7D6C5A] text-xs font-semibold tracking-wider uppercase border border-[#D2C4B1]">
          <ShoppingCart className="w-3.5 h-3.5 text-[#4A3B2C]" />
          Shopping List
        </span>
        <h2 className="font-serif-heritage text-3xl sm:text-4xl font-bold text-[#261D16]">What to Buy</h2>
        <p className="text-xs sm:text-sm text-[#5C4E40]">
          The ingredients you are missing for the recipes you picked, plus anything you add yourself. Tick items off as
          you put them in the basket.
        </p>
      </div>

      <form onSubmit={add} className="flex gap-2">
        <input
          id="shopping_add_input"
          type="text"
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          placeholder="Add an item (e.g., parchment paper, fresh basil)..."
          maxLength={100}
          className="flex-1 min-w-0 px-4 py-3 bg-white border border-[#D2C4B1] rounded-xl text-sm text-[#261D16] placeholder:text-[#857566] focus:outline-none focus:ring-2 focus:ring-[#4A3B2C]"
        />
        <button
          type="submit"
          className="flex items-center gap-1.5 px-4 py-3 bg-[#4A3B2C] text-[#FAF7F2] rounded-xl text-sm font-semibold hover:bg-[#382B1E] transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </form>

      {shoppingList.length === 0 ? (
        <div className="text-center py-14 px-4 bg-[#FAF7F2] rounded-2xl border border-dashed border-[#D2C4B1] space-y-3">
          <ShoppingCart className="w-10 h-10 text-[#A69480] mx-auto" />
          <h3 className="font-serif-heritage text-lg font-bold text-[#261D16]">Your list is empty</h3>
          <p className="text-xs text-[#7D6C5A] max-w-sm mx-auto">
            Pick a recipe in the Pantry Matcher and the ingredients you are missing can be added here.
          </p>
          <button
            type="button"
            onClick={() => navigateTo({ type: 'pantry' })}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#4A3B2C] text-[#FAF7F2] text-xs font-semibold rounded-xl hover:bg-[#382B1E] transition-colors cursor-pointer"
          >
            <UtensilsCrossed className="w-3.5 h-3.5" /> Open Pantry Matcher
          </button>
        </div>
      ) : (
        <>
          <div className="bg-[#FAF7F2] rounded-2xl border border-[#D2C4B1] p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#4A3B2C]">
                To buy ({toBuy.length})
              </h3>
              {!confirmClear ? (
                <button type="button" onClick={() => setConfirmClear(true)} className="text-xs text-[#7D6C5A] hover:text-[#B8452D] underline cursor-pointer">
                  Clear list
                </button>
              ) : (
                <span className="flex items-center gap-2 text-xs text-[#5C4E40]">
                  Remove everything?
                  <button type="button" onClick={() => { clearShoppingList(); setConfirmClear(false); }} className="px-2.5 py-1 rounded-lg bg-[#B8452D] text-white font-semibold cursor-pointer">Yes, clear</button>
                  <button type="button" onClick={() => setConfirmClear(false)} className="px-2.5 py-1 rounded-lg bg-[#EBE3D6] border border-[#D2C4B1] cursor-pointer">Keep</button>
                </span>
              )}
            </div>

            {toBuy.length === 0 ? (
              <p className="text-sm text-[#5C7250] font-semibold">Everything is in the basket.</p>
            ) : (
              <ul className="divide-y divide-[#E4DBCF]">
                {toBuy.map(item => (
                  <ShoppingRow key={item.key} label={itemLabel(item)} recipes={item.needs.map(n => n.recipe)} bought={false}
                    onToggle={() => toggleShoppingItemBought(item.key)} onRemove={() => removeShoppingItem(item.key)} />
                ))}
              </ul>
            )}

            {toBuy.length > 0 && (
              <div className="pt-3 border-t border-[#E4DBCF] space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#7D6C5A]">Send this list</p>
                <ShareListButtons
                  idPrefix="shopping_share"
                  subject="Shopping list (Heritage Cookbook)"
                  message={listMessage('Shopping list', toBuy.map(itemLabel))}
                />
              </div>
            )}
          </div>

          {bought.length > 0 && (
            <div className="bg-[#FAF7F2]/70 rounded-2xl border border-[#D2C4B1] p-4 sm:p-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#7D6C5A]">In the basket ({bought.length})</h3>
                <button
                  id="move_bought_to_pantry_btn"
                  type="button"
                  onClick={moveBoughtToPantry}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#4A3B2C] text-[#FAF7F2] text-xs font-bold hover:bg-[#382B1E] transition-colors cursor-pointer"
                >
                  <UtensilsCrossed className="w-3.5 h-3.5" /> Add to my pantry
                </button>
              </div>
              <ul className="divide-y divide-[#E4DBCF]">
                {bought.map(item => (
                  <ShoppingRow key={item.key} label={itemLabel(item)} recipes={item.needs.map(n => n.recipe)} bought
                    onToggle={() => toggleShoppingItemBought(item.key)} onRemove={() => removeShoppingItem(item.key)} />
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const ShoppingRow: React.FC<{
  label: string;
  recipes: string[];
  bought: boolean;
  onToggle: () => void;
  onRemove: () => void;
}> = ({ label, recipes, bought, onToggle, onRemove }) => (
  <li className="flex items-start gap-3 py-2.5">
    <button
      type="button"
      onClick={onToggle}
      aria-label={bought ? `Put ${label} back on the list` : `Mark ${label} as bought`}
      className={`mt-0.5 w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center cursor-pointer ${
        bought ? 'bg-[#5C7250] border-[#5C7250] text-white' : 'border-[#A69480] hover:border-[#4A3B2C]'
      }`}
    >
      {bought && <Check className="w-3 h-3" />}
    </button>
    <div className="flex-1 min-w-0">
      <p className={`text-sm break-words ${bought ? 'line-through text-[#857566]' : 'text-[#261D16]'}`}>{label}</p>
      {recipes.length > 0 && <p className="text-[11px] text-[#857566] break-words">for {recipes.join(', ')}</p>}
    </div>
    <button type="button" onClick={onRemove} aria-label={`Remove ${label}`} className="p-1 text-[#A69480] hover:text-[#B8452D] cursor-pointer">
      <X className="w-4 h-4" />
    </button>
  </li>
);
