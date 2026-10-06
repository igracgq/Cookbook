import React from 'react';
import { ImageOff } from 'lucide-react';
import { isStockPhotoUrl } from '../utils/photoResolver';

interface RecipePhotoProps {
  src?: string | null;
  alt: string;
  /** Tailwind aspect-ratio class for the frame, e.g. "aspect-[4/3]". */
  aspect?: string;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Illustrative (stock) photos fill the frame edge to edge (object-cover).
 *
 * Original cookbook photos show whole whatever their shape. The picture is fitted inside a
 * fixed-ratio frame (object-contain) and a blurred, enlarged copy of the same
 * photo fills the space around it, so portrait, square and wide photos all
 * sit in matching frames without cropping.
 */
export const RecipePhoto: React.FC<RecipePhotoProps> = ({ src, alt, aspect = 'aspect-[4/3]', className = '', children }) => (
  <div className={`relative w-full overflow-hidden bg-[#EBE3D6] ${aspect} ${className}`}>
    {src && isStockPhotoUrl(src) ? (
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />
    ) : src ? (
      <>
        <img
          src={src}
          alt=""
          aria-hidden="true"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover scale-125 blur-2xl opacity-60"
          loading="lazy"
        />
        <img
          src={src}
          alt={alt}
          referrerPolicy="no-referrer"
          className="relative w-full h-full object-contain"
          loading="lazy"
        />
      </>
    ) : (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-[#A69480]" role="img" aria-label="No photo for this recipe">
        <ImageOff className="w-7 h-7" />
        <span className="text-[11px] font-medium tracking-wide">No photo yet</span>
      </div>
    )}
    {children}
  </div>
);
