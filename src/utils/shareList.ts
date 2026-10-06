import { ShoppingItem } from '../types';

/** How an item reads on the list and in a message: one recipe's own wording, or the name with every amount. */
export function itemLabel(item: ShoppingItem): string {
  if (item.needs.length === 1) return item.needs[0].text;
  if (item.needs.length === 0) return item.name;
  return `${item.name} (${item.needs.map(n => n.text).join(' + ')})`;
}

/**
 * Plain text for a message: a title, then one bullet per item. When there are utensils or other things as well
 * as ingredients, the two get their own headings.
 */
export function listMessage(title: string, lines: string[], otherLines: string[] = []): string {
  const bullets = (l: string[]) => l.map(x => `• ${x}`).join('\n');
  const body =
    otherLines.length === 0
      ? bullets(lines)
      : [lines.length ? `Ingredients:\n${bullets(lines)}` : '', `Utensils & other:\n${bullets(otherLines)}`].filter(Boolean).join('\n\n');
  return `${title}\n\n${body}\n\nFrom the Ruffolo-Vitale Heritage Cookbook`;
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
