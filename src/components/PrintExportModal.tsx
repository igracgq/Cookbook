import React, { useState } from 'react';
import { useCookbook } from '../context/CookbookContext';
import {
  X,
  Printer,
  BookOpen,
  ExternalLink,
  Download,
  Copy,
  Check,
  FileText
} from 'lucide-react';
import {
  allRecipes,
  findRecipeById,
  roastingGuides,
  volumeConversions
} from '../data/cookbookDataSource';
import { RecipeCategory } from '../types';

export const PrintExportModal: React.FC = () => {
  const { isPrintExportOpen, printExportRecipeId, closePrintExport } = useCookbook();

  const [printScope, setPrintScope] = useState<'single' | 'category' | 'all'>(
    printExportRecipeId ? 'single' : 'all'
  );
  const [selectedCategory, setSelectedCategory] = useState<RecipeCategory>(
    RecipeCategory.PASTA_AND_SAUCES
  );
  const [includeHistory, setIncludeHistory] = useState(true);
  const [includeCharts, setIncludeCharts] = useState(true);
  const [copiedText, setCopiedText] = useState(false);

  if (!isPrintExportOpen) return null;

  const currentRecipe = printExportRecipeId ? findRecipeById(printExportRecipeId) : null;

  const getRecipesToPrint = () => {
    if (printScope === 'single' && currentRecipe) {
      return [currentRecipe];
    }
    if (printScope === 'category') {
      return allRecipes.filter(r => r.category === selectedCategory);
    }
    return allRecipes;
  };

  const printableRecipes = getRecipesToPrint();

  // Generate self-contained HTML for printing in a new tab/window
  const generatePrintableHtml = () => {
    const recipesHtml = printableRecipes
      .map(
        r => `
      <div class="recipe-card">
        <div class="recipe-header">
          <div>
            <h2 class="recipe-title">${r.title}</h2>
            ${r.italianTitle ? `<p class="recipe-subtitle">${r.italianTitle}</p>` : ''}
          </div>
          ${r.contributor && r.contributor !== 'Family Cookbook' ? `<span class="recipe-contributor">By ${r.contributor}</span>` : ''}
        </div>

        <div class="meta-row">
          ${[
            r.servings ? `<span>Yield: ${r.servings}</span>` : '',
            r.prepTime ? `<span>Prep: ${r.prepTime}</span>` : '',
            r.cookTime ? `<span>Cook: ${r.cookTime}</span>` : '',
            `<span>Category: ${r.category.replace(/_/g, ' ')}</span>`
          ].filter(Boolean).join('<span>•</span>')}
        </div>

        <div class="columns">
          <div class="col">
            <h3 class="section-title">Ingredients</h3>
            <ul class="ingredient-list">
              ${r.ingredients.map(ing => `<li>• ${ing.rawText}</li>`).join('')}
            </ul>
          </div>

          <div class="col">
            <h3 class="section-title">Instructions</h3>
            <ol class="instructions-list">
              ${r.instructions.map(inst => `<li>${inst}</li>`).join('')}
            </ol>
          </div>
        </div>

        ${
          r.notes
            ? `<div class="heirloom-note">
                <strong>Heirloom Family Note:</strong> ${r.notes}
               </div>`
            : ''
        }
      </div>
    `
      )
      .join('');

    const historyHtml = includeHistory
      ? `
      <div class="foreword">
        <h1 class="main-title">Ruffolo-Vitale Heritage Cookbook</h1>
        <p class="main-subtitle">A Family Heirloom Collection of Calabrian & Italian Traditions</p>
        <p class="history-text">
          Dedicated with enduring love to our parents, nonni, aunts, and uncles who brought their traditions,
          warmth, and hearth from Calabria to our family tables. Every recipe preserved in these pages represents
          generations of Sunday dinners, holiday celebrations, and stories whispered over simmering tomato sauce.
        </p>
      </div>
    `
      : '';

    const chartsHtml = includeCharts
      ? `
      <div class="appendix">
        <h2 class="section-title" style="margin-top: 2rem;">Meat Roasting Guidelines</h2>
        <table class="roast-table">
          <thead>
            <tr>
              <th>Cut</th>
              <th>Weight</th>
              <th>Roasting Time</th>
              <th>Internal Temp</th>
            </tr>
          </thead>
          <tbody>
            ${roastingGuides
              .map(
                g => `
              <tr>
                <td><strong>${g.meatType}</strong></td>
                <td>${g.weight}</td>
                <td>${g.hours}</td>
                <td>${g.internalTemp}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>

        <h2 class="section-title">Volume & Measurement Conversions</h2>
        <div class="conv-grid">
          ${volumeConversions
            .map(
              v => `
            <div class="conv-item">${v.imperial} = ${v.metric}</div>
          `
            )
            .join('')}
        </div>
      </div>
    `
      : '';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Ruffolo-Vitale Heritage Cookbook - Printable Keepsake</title>
  <style>
    @page {
      size: letter portrait;
      margin: 1.5cm;
    }
    * {
      box-sizing: border-box;
    }
    body {
      font-family: 'Cormorant Garamond', Garamond, 'Times New Roman', Georgia, serif;
      color: #1a1a1a;
      background: #ffffff;
      margin: 0;
      padding: 20px;
      line-height: 1.5;
    }
    .print-actions {
      text-align: center;
      padding: 15px;
      background: #f3ede2;
      border: 1px solid #d4c5b1;
      border-radius: 10px;
      margin-bottom: 25px;
    }
    .print-btn {
      background: #4A3B2C;
      color: #FAF7F2;
      border: none;
      padding: 10px 24px;
      font-size: 15px;
      font-weight: bold;
      border-radius: 8px;
      cursor: pointer;
      font-family: sans-serif;
    }
    .print-btn:hover {
      background: #2e241b;
    }
    .main-title {
      font-size: 28px;
      text-transform: uppercase;
      letter-spacing: 2px;
      text-align: center;
      margin-bottom: 4px;
      color: #2b1f17;
    }
    .main-subtitle {
      font-style: italic;
      text-align: center;
      color: #665544;
      margin-top: 0;
      margin-bottom: 20px;
      font-size: 16px;
    }
    .history-text {
      font-size: 15px;
      line-height: 1.6;
      max-width: 700px;
      margin: 0 auto 30px;
      text-align: center;
      font-style: italic;
    }
    .recipe-card {
      margin-bottom: 40px;
      padding-bottom: 25px;
      border-bottom: 1px solid #c9b9a6;
      page-break-after: always;
      break-after: page;
    }
    .recipe-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      border-bottom: 2px solid #4A3B2C;
      padding-bottom: 6px;
      margin-bottom: 10px;
    }
    .recipe-title {
      font-size: 24px;
      margin: 0;
      color: #2b1f17;
      font-weight: bold;
    }
    .recipe-subtitle {
      font-style: italic;
      color: #665544;
      margin: 2px 0 0 0;
      font-size: 14px;
    }
    .recipe-contributor {
      font-family: sans-serif;
      font-size: 12px;
      font-weight: bold;
      color: #4A3B2C;
    }
    .meta-row {
      display: flex;
      gap: 12px;
      font-family: sans-serif;
      font-size: 11px;
      color: #665544;
      margin-bottom: 16px;
    }
    .columns {
      display: flex;
      gap: 30px;
      margin-bottom: 15px;
    }
    .col {
      flex: 1;
    }
    .section-title {
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #4A3B2C;
      margin-top: 0;
      margin-bottom: 8px;
      border-bottom: 1px solid #e0d4c5;
      padding-bottom: 4px;
    }
    .ingredient-list {
      list-style: none;
      padding: 0;
      margin: 0;
      font-size: 14px;
      line-height: 1.6;
    }
    .instructions-list {
      margin: 0;
      padding-left: 20px;
      font-size: 14px;
      line-height: 1.6;
    }
    .heirloom-note {
      background: #faf6f0;
      border-left: 3px solid #4A3B2C;
      padding: 8px 12px;
      font-size: 13px;
      font-style: italic;
      margin-top: 15px;
    }
    .roast-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
      font-size: 13px;
    }
    .roast-table th, .roast-table td {
      border: 1px solid #d4c5b1;
      padding: 6px 10px;
      text-align: left;
    }
    .roast-table th {
      background: #f3ede2;
      font-family: sans-serif;
      font-size: 11px;
      text-transform: uppercase;
    }
    .conv-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      font-family: sans-serif;
      font-size: 12px;
    }
    .conv-item {
      padding: 6px;
      border: 1px solid #d4c5b1;
      background: #faf6f0;
    }
    @media print {
      .print-actions {
        display: none !important;
      }
      body {
        padding: 0;
      }
    }
  </style>
</head>
<body>
  <div class="print-actions">
    <button class="print-btn" onclick="window.print()">🖨️ Click to Print or Save to PDF</button>
    <p style="font-family: sans-serif; font-size: 12px; color: #665544; margin: 8px 0 0;">
      In the print dialog, choose "Save as PDF" to create a downloadable PDF cookbook!
    </p>
  </div>

  ${historyHtml}
  ${recipesHtml}
  ${chartsHtml}

  <script>
    // Auto trigger print when page opens
    window.addEventListener('load', () => {
      setTimeout(() => {
        window.print();
      }, 500);
    });
  </script>
</body>
</html>`;
  };

  const handleOpenPrintTab = () => {
    const html = generatePrintableHtml();
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
    } else {
      // If popup was blocked, fallback to blob URL
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    }
  };

  const handleDownloadHtml = () => {
    const html = generatePrintableHtml();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Heritage_Cookbook_${printScope}_${new Date().toISOString().slice(0, 10)}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleNativePrint = () => {
    try {
      window.print();
    } catch {
      handleOpenPrintTab();
    }
  };

  const handleCopyText = () => {
    const text = printableRecipes
      .map(
        r => `
📖 ${r.title}${r.italianTitle ? ` (${r.italianTitle})` : ''}
${[r.contributor && r.contributor !== 'Family Cookbook' ? `Contributor: ${r.contributor}` : '', r.servings ? `Servings: ${r.servings}` : '', r.cookTime ? `Cook: ${r.cookTime}` : ''].filter(Boolean).join(' | ')}

INGREDIENTS:
${r.ingredients.map(i => `• ${i.rawText}`).join('\n')}

INSTRUCTIONS:
${r.instructions.map((inst, idx) => `${idx + 1}. ${inst}`).join('\n')}
${r.notes ? `\nHeirloom Note: ${r.notes}` : ''}
----------------------------------------`
      )
      .join('\n\n');

    navigator.clipboard.writeText(text).then(() => {
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    });
  };

  return (
    <div
      id="print_export_modal"
      className="fixed inset-0 z-50 bg-[#261D16]/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={closePrintExport}
    >
      <div
        className="bg-[#FAF7F2] rounded-3xl max-w-2xl w-full border border-[#D2C4B1] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-[#EBE3D6] border-b border-[#D2C4B1] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#4A3B2C] text-[#FAF7F2]">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif-heritage text-lg font-bold text-[#261D16] leading-tight">
                Print & Keepsake PDF Export
              </h2>
              <p className="text-xs text-[#7D6C5A]">
                Print on paper or export to PDF in traditional heirloom layout
              </p>
            </div>
          </div>

          <button
            id="close_print_modal_btn"
            type="button"
            onClick={closePrintExport}
            className="p-1.5 rounded-full text-[#7D6C5A] hover:bg-[#DDD2C2] hover:text-[#261D16] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Scope Selector */}
          <div>
            <label className="block text-xs font-bold text-[#4A3B2C] uppercase tracking-wider mb-2">
              Export Selection
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {currentRecipe && (
                <button
                  type="button"
                  onClick={() => setPrintScope('single')}
                  className={`p-3 rounded-2xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                    printScope === 'single'
                      ? 'border-[#4A3B2C] bg-[#EBE3D6] text-[#261D16] shadow-sm'
                      : 'border-[#D2C4B1] bg-white text-[#5C4E40] hover:bg-[#F4EEE5]'
                  }`}
                >
                  <p className="font-bold">Current Recipe</p>
                  <p className="text-[11px] text-[#7D6C5A] truncate mt-0.5">
                    {currentRecipe.title}
                  </p>
                </button>
              )}

              <button
                type="button"
                onClick={() => setPrintScope('category')}
                className={`p-3 rounded-2xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                  printScope === 'category'
                    ? 'border-[#4A3B2C] bg-[#EBE3D6] text-[#261D16] shadow-sm'
                    : 'border-[#D2C4B1] bg-white text-[#5C4E40] hover:bg-[#F4EEE5]'
                }`}
              >
                <p className="font-bold">By Section</p>
                <p className="text-[11px] text-[#7D6C5A] mt-0.5">Choose category</p>
              </button>

              <button
                type="button"
                onClick={() => setPrintScope('all')}
                className={`p-3 rounded-2xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                  printScope === 'all'
                    ? 'border-[#4A3B2C] bg-[#EBE3D6] text-[#261D16] shadow-sm'
                    : 'border-[#D2C4B1] bg-white text-[#5C4E40] hover:bg-[#F4EEE5]'
                }`}
              >
                <p className="font-bold">Entire Cookbook</p>
                <p className="text-[11px] text-[#7D6C5A] mt-0.5">All {allRecipes.length} recipes</p>
              </button>
            </div>
          </div>

          {/* Category Dropdown if scope === category */}
          {printScope === 'category' && (
            <div>
              <label className="block text-xs font-bold text-[#4A3B2C] uppercase tracking-wider mb-1.5">
                Choose Category
              </label>
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value as RecipeCategory)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#D2C4B1] rounded-xl text-xs font-medium text-[#261D16] focus:outline-none focus:ring-2 focus:ring-[#4A3B2C]"
              >
                {Object.values(RecipeCategory).map(cat => (
                  <option key={cat} value={cat}>
                    {cat.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Heritage Add-ons */}
          <div>
            <label className="block text-xs font-bold text-[#4A3B2C] uppercase tracking-wider mb-2">
              Heirloom Additions
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2.5 text-xs text-[#261D16] cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeHistory}
                  onChange={e => setIncludeHistory(e.target.checked)}
                  className="rounded text-[#4A3B2C] focus:ring-[#4A3B2C] w-4 h-4 border-[#D2C4B1]"
                />
                <span>Include Ruffolo-Vitale Family Dedication & History (Foreword)</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-[#261D16] cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeCharts}
                  onChange={e => setIncludeCharts(e.target.checked)}
                  className="rounded text-[#4A3B2C] focus:ring-[#4A3B2C] w-4 h-4 border-[#D2C4B1]"
                />
                <span>Include Meat Roasting Reference Tables & Measurement Guides</span>
              </label>
            </div>
          </div>

          {/* Summary Preview Box */}
          <div className="p-4 bg-[#EBE3D6] rounded-2xl border border-[#D2C4B1] text-xs text-[#5C4E40] space-y-1">
            <p className="font-bold text-[#261D16]">Print & PDF Ready:</p>
            <p>
              • <strong>{printableRecipes.length}</strong> recipe
              {printableRecipes.length === 1 ? '' : 's'} formatted for 8.5x11 inch printing
            </p>
            {includeHistory && <p>• Family Dedication & Calabrian History Foreword</p>}
            {includeCharts && <p>• Roasting & Measurement Appendix</p>}
          </div>

          {/* Alternative Quick Export Tools */}
          <div className="flex flex-wrap gap-2 pt-1 border-t border-[#D2C4B1]">
            <button
              id="download_print_html_btn"
              type="button"
              onClick={handleDownloadHtml}
              className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-[#FAF7F2] border border-[#D2C4B1] text-[#4A3B2C] text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Printable File (.html)</span>
            </button>

            <button
              id="copy_print_text_btn"
              type="button"
              onClick={handleCopyText}
              className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-[#FAF7F2] border border-[#D2C4B1] text-[#4A3B2C] text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              {copiedText ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="text-emerald-700">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Recipe Text</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer with High-Reliability Action Buttons */}
        <div className="px-6 py-4 bg-[#EBE3D6] border-t border-[#D2C4B1] flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={closePrintExport}
            className="px-4 py-2 text-xs font-semibold text-[#5C4E40] hover:text-[#261D16] cursor-pointer"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            {/* Primary Print Button: Opens clean printable window with auto-print & PDF save */}
            <button
              id="open_print_new_tab_btn"
              type="button"
              onClick={handleOpenPrintTab}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#4A3B2C] text-[#FAF7F2] rounded-xl text-xs font-bold hover:bg-[#382B1E] transition-transform active:scale-95 shadow-md cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Generate PDF or Print</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
