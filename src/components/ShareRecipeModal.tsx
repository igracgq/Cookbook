import React, { useState } from 'react';
import { Recipe } from '../types';
import {
  X,
  Share2,
  Copy,
  Check,
  MessageCircle,
  Mail,
  Send,
  ExternalLink,
  BookOpen
} from 'lucide-react';

interface ShareRecipeModalProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareRecipeModal: React.FC<ShareRecipeModalProps> = ({
  recipe,
  isOpen,
  onClose
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  if (!isOpen || !recipe) return null;

  const currentUrl = window.location.href;
  const shareTitle = `${recipe.title} - Ruffolo-Vitale Heritage Cookbook`;
  const shareSnippet = `Try this heirloom recipe for ${recipe.title}${
    recipe.italianTitle ? ` (${recipe.italianTitle})` : ''
  } from the Ruffolo-Vitale Heritage Cookbook!`;

  const fullRecipeText = `📖 ${recipe.title}${recipe.italianTitle ? ` (${recipe.italianTitle})` : ''}
${[recipe.servings && `Yield: ${recipe.servings}`, recipe.prepTime && `Prep: ${recipe.prepTime}`, recipe.cookTime && `Cook: ${recipe.cookTime}`].filter(Boolean).join(' | ')}

INGREDIENTS:
${recipe.ingredients.map(i => `• ${i.rawText}`).join('\n')}

INSTRUCTIONS:
${recipe.instructions.map((inst, idx) => `${idx + 1}. ${inst}`).join('\n')}

${recipe.notes ? `Heirloom Note: ${recipe.notes}\n` : ''}
From the Ruffolo-Vitale Heritage Cookbook.`;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareSnippet,
          url: currentUrl
        });
        onClose();
      } catch (err) {
        // User cancelled or share failed
      }
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  const handleCopyRecipeText = () => {
    navigator.clipboard.writeText(fullRecipeText).then(() => {
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    });
  };

  const shareViaWhatsApp = () => {
    const text = `${shareSnippet}\n\n${currentUrl}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const shareViaSMS = () => {
    const text = `${shareSnippet}\n\n${currentUrl}`;
    const url = `sms:?&body=${encodeURIComponent(text)}`;
    window.location.href = url;
  };

  const shareViaEmail = () => {
    const subject = `Recipe: ${recipe.title} (Heritage Cookbook)`;
    const body = `${shareSnippet}\n\nCheck out the full recipe here:\n${currentUrl}\n\n---\n\n${fullRecipeText}`;
    const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = url;
  };

  const shareViaTwitter = () => {
    const text = `Cooking ${recipe.title} from the Ruffolo-Vitale Heritage Cookbook! 🍝`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(currentUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const shareViaFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const hasNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

  return (
    <div
      id="share_recipe_modal"
      className="fixed inset-0 z-50 bg-[#261D16]/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-[#FAF7F2] rounded-3xl max-w-md w-full border border-[#D2C4B1] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-[#EBE3D6] border-b border-[#D2C4B1] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#4A3B2C] text-[#FAF7F2]">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-heritage text-lg font-bold text-[#261D16] leading-tight">
                Share Recipe
              </h3>
              <p className="text-xs text-[#7D6C5A] truncate max-w-[220px]">
                {recipe.title}
              </p>
            </div>
          </div>

          <button
            id="close_share_modal_btn"
            onClick={onClose}
            className="p-1.5 rounded-full text-[#7D6C5A] hover:bg-[#DDD2C2] hover:text-[#261D16] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Share Options */}
        <div className="p-6 space-y-5">
          {/* Native System Share Button (Best on iOS Safari & Android) */}
          {hasNativeShare && (
            <button
              id="native_share_btn"
              type="button"
              onClick={handleNativeShare}
              className="w-full py-3.5 px-4 bg-[#4A3B2C] text-[#FAF7F2] rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#382B1E] transition-colors shadow-sm"
            >
              <Send className="w-4 h-4" />
              <span>Share via Phone Apps (Messages, AirDrop, etc.)</span>
            </button>
          )}

          {/* Social & Messaging Channels Grid */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#7D6C5A] mb-2.5">
              Send Directly via Messaging & Social
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                id="share_whatsapp_btn"
                type="button"
                onClick={shareViaWhatsApp}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-[#EBE3D6]/70 border border-[#D2C4B1] hover:bg-[#E4DBCF] text-xs font-semibold text-[#261D16] transition-colors text-left"
              >
                <div className="p-1.5 rounded-lg bg-emerald-600 text-white">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <span>WhatsApp</span>
              </button>

              <button
                id="share_sms_btn"
                type="button"
                onClick={shareViaSMS}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-[#EBE3D6]/70 border border-[#D2C4B1] hover:bg-[#E4DBCF] text-xs font-semibold text-[#261D16] transition-colors text-left"
              >
                <div className="p-1.5 rounded-lg bg-blue-600 text-white">
                  <Send className="w-4 h-4" />
                </div>
                <span>Text / SMS</span>
              </button>

              <button
                id="share_email_btn"
                type="button"
                onClick={shareViaEmail}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-[#EBE3D6]/70 border border-[#D2C4B1] hover:bg-[#E4DBCF] text-xs font-semibold text-[#261D16] transition-colors text-left"
              >
                <div className="p-1.5 rounded-lg bg-amber-700 text-white">
                  <Mail className="w-4 h-4" />
                </div>
                <span>Email</span>
              </button>

              <button
                id="share_twitter_btn"
                type="button"
                onClick={shareViaTwitter}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-[#EBE3D6]/70 border border-[#D2C4B1] hover:bg-[#E4DBCF] text-xs font-semibold text-[#261D16] transition-colors text-left"
              >
                <div className="p-1.5 rounded-lg bg-neutral-800 text-white">
                  <span className="font-bold text-xs">𝕏</span>
                </div>
                <span>X / Twitter</span>
              </button>

              <button
                id="share_facebook_btn"
                type="button"
                onClick={shareViaFacebook}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-[#EBE3D6]/70 border border-[#D2C4B1] hover:bg-[#E4DBCF] text-xs font-semibold text-[#261D16] transition-colors text-left col-span-2"
              >
                <div className="p-1.5 rounded-lg bg-blue-700 text-white">
                  <ExternalLink className="w-4 h-4" />
                </div>
                <span>Facebook</span>
              </button>
            </div>
          </div>

          {/* Quick Copy Link & Full Recipe */}
          <div className="space-y-2 pt-2 border-t border-[#D2C4B1]">
            <button
              id="copy_share_link_btn"
              type="button"
              onClick={handleCopyLink}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-white border border-[#D2C4B1] hover:bg-[#FAF7F2] text-xs font-semibold text-[#261D16] transition-colors"
            >
              <div className="flex items-center gap-2">
                <Copy className="w-4 h-4 text-[#7D6C5A]" />
                <span>Copy Recipe Link</span>
              </div>
              {copiedLink ? (
                <span className="flex items-center gap-1 text-emerald-700 font-bold text-xs">
                  <Check className="w-3.5 h-3.5" /> Copied!
                </span>
              ) : (
                <span className="text-[11px] text-[#7D6C5A]">Click to copy URL</span>
              )}
            </button>

            <button
              id="copy_full_recipe_text_btn"
              type="button"
              onClick={handleCopyRecipeText}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-white border border-[#D2C4B1] hover:bg-[#FAF7F2] text-xs font-semibold text-[#261D16] transition-colors"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#7D6C5A]" />
                <span>Copy Full Recipe Text (For Chat)</span>
              </div>
              {copiedText ? (
                <span className="flex items-center gap-1 text-emerald-700 font-bold text-xs">
                  <Check className="w-3.5 h-3.5" /> Copied Text!
                </span>
              ) : (
                <span className="text-[11px] text-[#7D6C5A]">Ingredients & Steps</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
