import React from 'react';
import { photoUrl } from '../utils/photoResolver';

/**
 * The pen-and-ink sketch under the search bar: five utensils hang from a rail and swing slowly, and steam rises from the pot.
 * The picture is cut into layers (public/images/cook_cover_bottom_static.png is everything except the utensils, and
 * cook_utensil_1..5.png are the utensils on their own). Positions are in pixels of the original 508 x 370 picture and are
 * shown as percentages, so it scales with the width. The animations are in index.css and stop for people who have
 * "reduce motion" switched on in their phone or computer.
 */
const W = 508;
const H = 370;

// left/top/width/height of each utensil's picture, and where it hangs (the hook), all in original pixels.
// swing = how far it swings each way (degrees), secs = time for one slow swing, delay = so they never move in step.
const UTENSILS = [
  { n: 1, left: 88, top: 59, w: 43, h: 146, px: 20.8, py: 3, swing: 3.4, secs: 4.6, delay: -0.8 },
  { n: 2, left: 147, top: 60, w: 60, h: 143, px: 36.3, py: 3, swing: 2.6, secs: 5.4, delay: -2.9 },
  { n: 3, left: 220, top: 54, w: 60, h: 153, px: 29.9, py: 3, swing: 3.0, secs: 4.2, delay: -1.7 },
  { n: 4, left: 291, top: 54, w: 58, h: 153, px: 26.3, py: 3, swing: 2.8, secs: 5.0, delay: -3.6 },
  { n: 5, left: 361, top: 54, w: 36, h: 152, px: 19.7, py: 3, swing: 3.8, secs: 3.8, delay: -0.3 }
];

const pct = (v: number, of: number) => `${(v / of) * 100}%`;

// Three thin wisps of steam above the pot's lid (the knob is at about x 412, y 290).
const STEAM = [
  { d: 'M404 283 C398 271 410 263 404 251 S410 233 405 224', delay: '0s', secs: '4.2s' },
  { d: 'M413 281 C407 269 419 259 413 247 S420 227 414 217', delay: '1.5s', secs: '4.6s' },
  { d: 'M422 283 C416 273 427 265 421 255 S427 239 423 231', delay: '2.9s', secs: '4.0s' }
];

export const KitchenSketch: React.FC = () => (
  <div
    className="relative w-[238px] max-w-full select-none [mask-image:linear-gradient(to_bottom,#000_82%,transparent)]"
    style={{ aspectRatio: `${W} / ${H}` }}
    aria-hidden="true"
  >
    <img src={photoUrl('cook_cover_bottom_static', 'png')} alt="" draggable={false} loading="eager" className="absolute inset-0 w-full h-full" />

    {UTENSILS.map(u => (
      <img
        key={u.n}
        src={photoUrl(`cook_utensil_${u.n}`, 'png')}
        alt=""
        draggable={false}
        loading="eager"
        className="cookbook-swing absolute"
        style={{
          left: pct(u.left, W),
          top: pct(u.top, H),
          width: pct(u.w, W),
          height: pct(u.h, H),
          transformOrigin: `${(u.px / u.w) * 100}% ${(u.py / u.h) * 100}%`,
          animationDuration: `${u.secs}s`,
          animationDelay: `${u.delay}s`,
          ['--swing' as string]: `${u.swing}deg`
        }}
      />
    ))}

    <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 ${W} ${H}`} fill="none">
      {STEAM.map((s, i) => (
        <path
          key={i}
          d={s.d}
          className="cookbook-steam"
          stroke="#5C4E40"
          strokeWidth="2.8"
          strokeLinecap="round"
          style={{ animationDelay: s.delay, animationDuration: s.secs }}
        />
      ))}
    </svg>
  </div>
);
