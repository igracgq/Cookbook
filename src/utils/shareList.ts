import { ShoppingItem } from '../types';

/** How an item reads on the list and in a message: one recipe's own wording, or the name with every amount. */
export function itemLabel(item: ShoppingItem): string {
  if (item.needs.length === 1) return item.needs[0].text;
  if (item.needs.length === 0) return item.name;
  return `${item.name} (${item.needs.map(n => n.text).join(' + ')})`;
}

/** Plain text for a message: a title, an optional "for recipe" line, then one bullet per item. */
export function listMessage(title: string, lines: string[]): string {
  return `${title}\n\n${lines.map(l => `• ${l}`).join('\n')}\n\nFrom the Ruffolo-Vitale Heritage Cookbook`;
}

export const sendByEmail = (subject: string, body: string) => {
  window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};
export const sendByText = (body: string) => {
  window.location.href = `sms:?&body=${encodeURIComponent(body)}`;
};
export const sendByWhatsApp = (body: string) => {
  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(body)}`, '_blank', 'noopener,noreferrer');
};
