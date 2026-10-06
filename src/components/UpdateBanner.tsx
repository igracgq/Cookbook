import React from 'react';
import { RefreshCw } from 'lucide-react';
import { useAppUpdate } from '../context/AppUpdateContext';

/** On phones, where the header has no room for another button: a bar offering the new version. */
export const UpdateBanner: React.FC = () => {
  const { status, applyUpdate } = useAppUpdate();
  if (status !== 'available') return null;
  return (
    <div id="update_banner" className="sm:hidden print:hidden bg-[#F6E7CF] border-b border-[#D9B67F] px-4 py-2 text-xs text-[#4A3B2C]">
      <div className="flex items-center gap-3">
        <RefreshCw className="w-4 h-4 shrink-0" />
        <span className="flex-1 min-w-0">A new version of the cookbook is ready.</span>
        <button
          id="update_app_btn"
          type="button"
          onClick={applyUpdate}
          className="px-3 py-1.5 rounded-lg bg-[#B8782B] text-white font-bold hover:bg-[#9A6422] transition-colors cursor-pointer shrink-0"
        >
          Update
        </button>
      </div>
    </div>
  );
};
