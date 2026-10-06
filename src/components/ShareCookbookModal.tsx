import React, { useState } from 'react';
import { Check, Copy, Mail, MessageCircle, Printer, Send, Share2, ExternalLink, X } from 'lucide-react';
import { ModalPortal } from './ModalPortal';

interface ShareCookbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Close this pop-up and open the print and PDF export. */
  onPrint: () => void;
}

const channel =
  'flex items-center gap-2.5 p-3 rounded-xl bg-[#EBE3D6]/70 border border-[#D2C4B1] hover:bg-[#E4DBCF] text-xs font-semibold text-[#261D16] transition-colors text-left cursor-pointer';

/** Share the whole cookbook (its web address) by email, WhatsApp, Facebook, Instagram, text or X, or print it. */
export const ShareCookbookModal: React.FC<ShareCookbookModalProps> = ({ isOpen, onClose, onPrint }) => {
  const [copied, setCopied] = useState(false);
  const [instagramNote, setInstagramNote] = useState(false);

  if (!isOpen) return null;

  const appUrl = `${window.location.origin}${import.meta.env.BASE_URL}`;
  const title = 'The Ruffolo-Vitale Heritage Cookbook';
  const snippet = `Take a look at the ${title}, our family's collection of heirloom recipes.`;
  const message = `${snippet}\n\n${appUrl}`;
  const hasNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

  const nativeShare = async () => {
    try {
      await navigator.share({ title, text: snippet, url: appUrl });
      onClose();
    } catch {
      /* cancelled */
    }
  };
  const copyLink = () => {
    navigator.clipboard.writeText(appUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }).catch(() => { /* clipboard not available */ });
  };
  const viaWhatsApp = () => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  const viaText = () => { window.location.href = `sms:?&body=${encodeURIComponent(message)}`; };
  const viaEmail = () => {
    window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${snippet}\n\nOpen it here:\n${appUrl}`)}`;
  };
  const viaTwitter = () =>
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${snippet}`)}&url=${encodeURIComponent(appUrl)}`, '_blank', 'noopener,noreferrer');
  const viaFacebook = () =>
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(appUrl)}`, '_blank', 'noopener,noreferrer');
  // Instagram has no web address for sharing a link, so copy the message and open Instagram.
  const viaInstagram = () => {
    navigator.clipboard.writeText(message).catch(() => {}).finally(() => {
      setInstagramNote(true);
      setTimeout(() => setInstagramNote(false), 6000);
      window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer');
    });
  };

  return (
    <ModalPortal>
      <div
        id="share_cookbook_modal"
        className="fixed inset-0 z-50 bg-[#261D16]/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
        onClick={onClose}
      >
        <div
          role="dialog"
          aria-label="Share the cookbook"
          className="bg-[#FAF7F2] rounded-3xl max-w-md w-full border border-[#D2C4B1] shadow-2xl overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          <div className="px-6 py-4 bg-[#EBE3D6] border-b border-[#D2C4B1] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#4A3B2C] text-[#FAF7F2]">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif-heritage text-lg font-bold text-[#261D16] leading-tight">Share the Cookbook</h3>
                <p className="text-xs text-[#7D6C5A]">Send the family cookbook to someone</p>
              </div>
            </div>
            <button
              id="close_share_cookbook_btn"
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="p-1.5 rounded-full text-[#7D6C5A] hover:bg-[#DDD2C2] hover:text-[#261D16] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-5">
            {hasNativeShare && (
              <button
                id="share_cookbook_native_btn"
                type="button"
                onClick={nativeShare}
                className="w-full py-3.5 px-4 bg-[#4A3B2C] text-[#FAF7F2] rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#382B1E] transition-colors shadow-sm cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Share via Phone Apps</span>
              </button>
            )}

            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#7D6C5A] mb-2.5">Send it with</p>
              <div className="grid grid-cols-2 gap-2.5">
                <button id="share_cookbook_email" type="button" onClick={viaEmail} className={channel}>
                  <div className="p-1.5 rounded-lg bg-amber-700 text-white"><Mail className="w-4 h-4" /></div>
                  <span>Email</span>
                </button>
                <button id="share_cookbook_whatsapp" type="button" onClick={viaWhatsApp} className={channel}>
                  <div className="p-1.5 rounded-lg bg-emerald-600 text-white"><MessageCircle className="w-4 h-4" /></div>
                  <span>WhatsApp</span>
                </button>
                <button id="share_cookbook_facebook" type="button" onClick={viaFacebook} className={channel}>
                  <div className="p-1.5 rounded-lg bg-blue-700 text-white"><ExternalLink className="w-4 h-4" /></div>
                  <span>Facebook</span>
                </button>
                <button id="share_cookbook_instagram" type="button" onClick={viaInstagram} className={channel}>
                  <div className="p-1.5 rounded-lg bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white">
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="3" y="3" width="18" height="18" rx="5" />
                      <circle cx="12" cy="12" r="4" />
                      <circle cx="17.3" cy="6.7" r="0.6" fill="currentColor" />
                    </svg>
                  </div>
                  <span>Instagram</span>
                </button>
                <button id="share_cookbook_text" type="button" onClick={viaText} className={channel}>
                  <div className="p-1.5 rounded-lg bg-blue-600 text-white"><Send className="w-4 h-4" /></div>
                  <span>Text / SMS</span>
                </button>
                <button id="share_cookbook_twitter" type="button" onClick={viaTwitter} className={channel}>
                  <div className="p-1.5 rounded-lg bg-neutral-800 text-white"><span className="font-bold text-xs">𝕏</span></div>
                  <span>X / Twitter</span>
                </button>
              </div>
              {instagramNote && (
                <p role="status" className="mt-2.5 text-[11px] leading-snug text-emerald-800">
                  Link and message copied. Paste them into a story, post or message in Instagram.
                </p>
              )}
            </div>

            <div className="space-y-2 pt-2 border-t border-[#D2C4B1]">
              <button
                id="share_cookbook_copy_link"
                type="button"
                onClick={copyLink}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-white border border-[#D2C4B1] hover:bg-[#FAF7F2] text-xs font-semibold text-[#261D16] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Copy className="w-4 h-4 text-[#7D6C5A]" />
                  <span>Copy the cookbook link</span>
                </div>
                {copied ? (
                  <span className="flex items-center gap-1 text-emerald-700 font-bold text-xs"><Check className="w-3.5 h-3.5" /> Copied!</span>
                ) : (
                  <span className="text-[11px] text-[#7D6C5A]">Click to copy</span>
                )}
              </button>
              <button
                id="share_cookbook_print_btn"
                type="button"
                onClick={onPrint}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-white border border-[#D2C4B1] hover:bg-[#FAF7F2] text-xs font-semibold text-[#261D16] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Printer className="w-4 h-4 text-[#7D6C5A]" />
                  <span>Print the cookbook</span>
                </div>
                <span className="text-[11px] text-[#7D6C5A]">Paper or PDF</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};
