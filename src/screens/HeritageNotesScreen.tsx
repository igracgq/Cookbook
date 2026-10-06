import React, { useState } from 'react';
import { useCookbook } from '../context/CookbookContext';
import { FAMILY_PHOTO_URL, FAMILY_GALLERY_URLS } from '../utils/photoResolver';
import { RecipePhoto } from '../components/RecipePhoto';
import { useAppUpdate } from '../context/AppUpdateContext';
import {
  helpfulHints,
  roastingGuides,
  temperatureConversions,
  volumeConversions
} from '../data/cookbookDataSource';
import {
  BookHeart,
  Sparkles,
  Flame,
  Scale,
  Lightbulb,
  Printer,
  Heart
} from 'lucide-react';

export const HeritageNotesScreen: React.FC = () => {
  const { openPrintExport } = useCookbook();
  const { supported: updatesSupported, status: updateStatus, checkForUpdate, applyUpdate } = useAppUpdate();
  const [activeTab, setActiveTab] = useState<'family' | 'roasting' | 'conversions' | 'hints'>('family');

  return (
    <div id="heritage_notes_screen" className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-28 sm:pb-16 space-y-8">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBE3D6] text-[#7D6C5A] text-xs font-semibold tracking-wider uppercase border border-[#D2C4B1]">
          <BookHeart className="w-3.5 h-3.5 text-[#4A3B2C]" />
          Heirloom Archives & Kitchen Wisdom
        </span>
        <h2 className="font-serif-heritage text-3xl sm:text-4xl font-bold text-[#261D16]">
          Ruffolo-Vitale Family Heritage
        </h2>
        <p className="text-xs sm:text-sm text-[#5C4E40]">
          Dedication forewords, Nonna's time-tested culinary wisdom, roasting guides, and volume conversions passed down through generations.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 border-b border-[#D2C4B1] pb-3">
        <button
          id="tab_family_story"
          onClick={() => setActiveTab('family')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold shrink-0 transition-all ${
            activeTab === 'family'
              ? 'bg-[#4A3B2C] text-[#FAF7F2] shadow-sm'
              : 'bg-[#EBE3D6] text-[#5C4E40] hover:bg-[#E4DBCF]'
          }`}
        >
          <Heart className="w-4 h-4 text-red-400" />
          <span>Family Dedication</span>
        </button>

        <button
          id="tab_roasting_guides"
          onClick={() => setActiveTab('roasting')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold shrink-0 transition-all ${
            activeTab === 'roasting'
              ? 'bg-[#4A3B2C] text-[#FAF7F2] shadow-sm'
              : 'bg-[#EBE3D6] text-[#5C4E40] hover:bg-[#E4DBCF]'
          }`}
        >
          <Flame className="w-4 h-4 text-amber-500" />
          <span>Roasting Charts</span>
        </button>

        <button
          id="tab_conversions"
          onClick={() => setActiveTab('conversions')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold shrink-0 transition-all ${
            activeTab === 'conversions'
              ? 'bg-[#4A3B2C] text-[#FAF7F2] shadow-sm'
              : 'bg-[#EBE3D6] text-[#5C4E40] hover:bg-[#E4DBCF]'
          }`}
        >
          <Scale className="w-4 h-4 text-blue-500" />
          <span>Conversions</span>
        </button>

        <button
          id="tab_helpful_hints"
          onClick={() => setActiveTab('hints')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold shrink-0 transition-all ${
            activeTab === 'hints'
              ? 'bg-[#4A3B2C] text-[#FAF7F2] shadow-sm'
              : 'bg-[#EBE3D6] text-[#5C4E40] hover:bg-[#E4DBCF]'
          }`}
        >
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <span>Nonna's Secrets</span>
        </button>
      </div>

      {/* 1. Family Dedication Card */}
      {activeTab === 'family' && (
        <div className="bg-[#FAF7F2] rounded-3xl border border-[#D2C4B1] overflow-hidden shadow-sm space-y-6">
          <RecipePhoto src={FAMILY_PHOTO_URL} alt="The Ruffolo-Vitale family gathered together" aspect="aspect-[20/9]" plain />
          <div className="px-6 sm:px-8 pt-6 space-y-1.5">
            <span className="inline-block px-3 py-1 rounded-full bg-[#EBE3D6] border border-[#D2C4B1] text-[#4A3B2C] text-xs font-bold uppercase tracking-wider">
              Preserved Forever
            </span>
            <h3 className="font-serif-heritage text-2xl sm:text-4xl font-bold text-[#261D16]">
              The Hearth & Table of Ruffolo-Vitale
            </h3>
            <p className="text-xs sm:text-sm text-[#7D6C5A]">
              From San Lucido and Cosenza, Calabria to the Sunday family table.
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-5 text-sm sm:text-base text-[#4A3B2C] leading-relaxed">
            <p className="font-serif-heritage italic text-lg sm:text-xl text-[#261D16] border-l-4 border-[#4A3B2C] pl-4 py-1">
              "This cookbook is lovingly dedicated to our mothers, fathers, nonne, and zii who carried recipes in their hands, memories in their hearts, and endless love to our tables."
            </p>

            <p>
              In our family, food has never simply been sustenance—it is our history, our language, and the living memory of Calabria. Before written measurements or digital timers, recipes were measured in pinches, handfuls, and patience. The fragrance of garlic gently sautéing in olive oil, fresh yeast blooming on a Sunday morning, and scalille frying for Christmas morning anchor our shared memories across generations.
            </p>

            <p>
              Every recipe recorded in these 329 pages—from Nonna Rosina's handmade fresh egg pasta to Sandy's classic Easter fiadone—was preserved so that our children and grandchildren will always know the taste of home.
            </p>

            {FAMILY_GALLERY_URLS.map(url => (
              <div key={url} className="rounded-2xl overflow-hidden border border-[#D2C4B1]">
                <RecipePhoto src={url} alt="Family members in the kitchen" aspect="aspect-[16/9]" plain />
              </div>
            ))}

            <div className="pt-4 flex items-center justify-between border-t border-[#D2C4B1]">
              <span className="text-xs text-[#7D6C5A] font-medium">
                Preserved in the original Ruffolo-Vitale Family Cookbook
              </span>
              <button
                onClick={() => openPrintExport()}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#4A3B2C] text-[#FAF7F2] text-xs font-bold rounded-xl hover:bg-[#382B1E] transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print Keepsake Edition</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Meat Roasting Guidelines */}
      {activeTab === 'roasting' && (
        <div className="bg-[#FAF7F2] p-6 rounded-2xl border border-[#D2C4B1] space-y-4">
          <div className="flex items-center gap-2 border-b border-[#D2C4B1] pb-3">
            <Flame className="w-5 h-5 text-[#B8452D]" />
            <h3 className="font-serif-heritage text-xl font-bold text-[#261D16]">
              Meat Roasting Time & Internal Temperature Guide
            </h3>
          </div>
          <p className="text-xs text-[#7D6C5A]">
            Reference tables from pages 14–18 of the original cookbook. Always insert meat thermometer into center of thickest muscle away from bone.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-left border border-[#D2C4B1] rounded-xl overflow-hidden">
              <thead className="bg-[#EBE3D6] text-[#4A3B2C] uppercase font-bold text-[11px] tracking-wider">
                <tr>
                  <th className="p-3 border-b border-[#D2C4B1]">Cut of Meat</th>
                  <th className="p-3 border-b border-[#D2C4B1]">Weight</th>
                  <th className="p-3 border-b border-[#D2C4B1]">Approximate Time</th>
                  <th className="p-3 border-b border-[#D2C4B1]">Internal Meat Temp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4DBCF]">
                {roastingGuides.map((guide, idx) => (
                  <tr key={idx} className="hover:bg-[#EBE3D6]/50 transition-colors">
                    <td className="p-3 font-semibold text-[#261D16]">{guide.meatType}</td>
                    <td className="p-3 text-[#5C4E40]">{guide.weight}</td>
                    <td className="p-3 text-[#5C4E40]">{guide.hours}</td>
                    <td className="p-3 font-mono font-bold text-[#B8452D]">
                      {guide.internalTemp}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. Conversions */}
      {activeTab === 'conversions' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Volume */}
          <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#D2C4B1] space-y-3">
            <div className="flex items-center gap-2 border-b border-[#D2C4B1] pb-2 text-[#4A3B2C]">
              <Scale className="w-4 h-4" />
              <h3 className="font-serif-heritage text-lg font-bold text-[#261D16]">
                Liquid & Dry Volume Measures
              </h3>
            </div>
            <div className="space-y-1.5 text-xs sm:text-sm">
              {volumeConversions.map((conv, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-[#EBE3D6] transition-colors"
                >
                  <span className="font-semibold text-[#261D16]">{conv.imperial}</span>
                  <span className="font-mono text-[#7D6C5A]">{conv.metric}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Temperature */}
          <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#D2C4B1] space-y-3">
            <div className="flex items-center gap-2 border-b border-[#D2C4B1] pb-2 text-[#B8452D]">
              <Flame className="w-4 h-4" />
              <h3 className="font-serif-heritage text-lg font-bold text-[#261D16]">
                Oven Temperatures (°F to °C)
              </h3>
            </div>
            <div className="space-y-1.5 text-xs sm:text-sm">
              {temperatureConversions.map((conv, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-[#EBE3D6] transition-colors"
                >
                  <span className="font-semibold text-[#261D16]">{conv.imperial}</span>
                  <span className="font-mono font-bold text-[#B8452D]">{conv.metric}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. Helpful Hints */}
      {activeTab === 'hints' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-700" />
            <h3 className="font-serif-heritage text-xl font-bold text-[#261D16]">
              Nonna's Time-Honored Kitchen Secrets
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {helpfulHints.map((hint, idx) => (
              <div
                key={idx}
                className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#D2C4B1] space-y-2 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-[#7D6C5A] mb-1">
                    <span className="font-bold text-[#4A3B2C] uppercase tracking-wider text-[10px]">
                      Tip #{idx + 1}
                    </span>
                    <span className="font-mono">p. {hint.cookbookPage}</span>
                  </div>
                  <h4 className="font-serif-heritage text-base font-bold text-[#261D16]">
                    {hint.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#5C4E40] leading-relaxed mt-1">
                    {hint.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* App updates */}
      {updatesSupported && (
        <div id="app_update_row" className="flex flex-wrap items-center justify-center gap-3 pt-6 text-xs text-[#7D6C5A]">
          <span id="app_update_status">
            {updateStatus === 'checking' && 'Checking for a new version…'}
            {updateStatus === 'latest' && 'You have the latest version.'}
            {updateStatus === 'available' && 'A new version is ready.'}
            {updateStatus === 'error' && 'Could not check just now. Are you online?'}
            {updateStatus === 'idle' && 'Updates are checked automatically.'}
          </span>
          {updateStatus === 'available' ? (
            <button type="button" onClick={applyUpdate} className="px-3 py-1.5 rounded-lg bg-[#B8782B] text-white font-bold cursor-pointer">Update now</button>
          ) : (
            <button id="check_updates_btn" type="button" onClick={checkForUpdate} disabled={updateStatus === 'checking'} className="px-3 py-1.5 rounded-lg bg-[#EBE3D6] border border-[#D2C4B1] font-semibold text-[#4A3B2C] hover:bg-[#E4DBCF] disabled:opacity-60 cursor-pointer">Check for updates</button>
          )}
        </div>
      )}
    </div>
  );
};
