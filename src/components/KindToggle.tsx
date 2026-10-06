import React from 'react';

/** Choose whether an item you add is food or a utensil/other thing. */
export const KindToggle: React.FC<{ kind: 'ingredient' | 'other'; onChange: (k: 'ingredient' | 'other') => void }> = ({ kind, onChange }) => (
  <div className="flex items-center gap-1.5 text-[11px] text-[#7D6C5A]" role="radiogroup" aria-label="What kind of item">
    <span>It is a:</span>
    {([['ingredient', 'Ingredient'], ['other', 'Utensil or other']] as const).map(([k, label]) => (
      <button
        key={k}
        type="button"
        role="radio"
        aria-checked={kind === k}
        onClick={() => onChange(k)}
        className={`px-2.5 py-1 rounded-full border font-semibold cursor-pointer ${
          kind === k ? 'bg-[#4A3B2C] text-[#FAF7F2] border-[#4A3B2C]' : 'bg-[#EBE3D6]/70 border-[#D2C4B1] text-[#5C4E40] hover:bg-[#E4DBCF]'
        }`}
      >
        {label}
      </button>
    ))}
  </div>
);
