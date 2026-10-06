/** The reactions under a photo. The `type` names are what is stored (and allowed by firestore.rules). */
export type ReactionType = 'like' | 'love' | 'yum' | 'haha' | 'celebrate' | 'clap';

export const REACTIONS: Array<{ type: ReactionType; emoji: string; label: string }> = [
  { type: 'like', emoji: '👍', label: 'Like' },
  { type: 'love', emoji: '❤️', label: 'Love' },
  { type: 'yum', emoji: '😋', label: 'Yum' },
  { type: 'haha', emoji: '😂', label: 'Haha' },
  { type: 'celebrate', emoji: '🙌', label: 'Hooray' },
  { type: 'clap', emoji: '👏', label: 'Applause' }
];

/** The quick-pick tray in the comment box: the same emoji as the reactions, plus a few that suit food photos. */
export const COMMENT_EMOJIS: string[] = [...REACTIONS.map(r => r.emoji), '😍', '🔥', '🤤', '🥰'];
