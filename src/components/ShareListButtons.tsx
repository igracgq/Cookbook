import React, { useState } from 'react';
import { Check, Copy, Mail, MessageCircle, Send } from 'lucide-react';
import { sendByEmail, sendByText, sendByWhatsApp } from '../utils/shareList';

interface ShareListButtonsProps {
  /** Email subject. */
  subject: string;
  /** The message to send: the list as plain text. */
  message: string;
  disabled?: boolean;
  idPrefix: string;
}

const btn =
  'flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#EBE3D6] border border-[#D2C4B1] hover:bg-[#E4DBCF] text-xs font-semibold text-[#261D16] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

/** Send a list by email, text message or WhatsApp, or copy it. */
export const ShareListButtons: React.FC<ShareListButtonsProps> = ({ subject, message, disabled, idPrefix }) => {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(message).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }).catch(() => { /* clipboard not available */ });
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button id={`${idPrefix}_email`} type="button" disabled={disabled} onClick={() => sendByEmail(subject, message)} className={btn}>
        <span className="p-1 rounded-md bg-amber-700 text-white"><Mail className="w-3 h-3" /></span> Email
      </button>
      <button id={`${idPrefix}_text`} type="button" disabled={disabled} onClick={() => sendByText(message)} className={btn}>
        <span className="p-1 rounded-md bg-blue-600 text-white"><Send className="w-3 h-3" /></span> Text
      </button>
      <button id={`${idPrefix}_whatsapp`} type="button" disabled={disabled} onClick={() => sendByWhatsApp(message)} className={btn}>
        <span className="p-1 rounded-md bg-emerald-600 text-white"><MessageCircle className="w-3 h-3" /></span> WhatsApp
      </button>
      <button id={`${idPrefix}_copy`} type="button" disabled={disabled} onClick={copy} className={btn}>
        {copied ? (
          <><Check className="w-3.5 h-3.5 text-emerald-700" /> Copied!</>
        ) : (
          <><Copy className="w-3.5 h-3.5 text-[#7D6C5A]" /> Copy</>
        )}
      </button>
    </div>
  );
};
