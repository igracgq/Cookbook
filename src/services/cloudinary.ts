/**
 * Recipe photo upload to Cloudinary.
 *
 * Only image files are accepted, large photos are resized in the browser first, and the upload goes to
 * Cloudinary with an unsigned upload preset. The returned https URL is what gets saved in Firestore;
 * no image data is ever stored in Firestore or Firebase Storage.
 */
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
export const MAX_INPUT_BYTES = 15 * 1024 * 1024; // refuse anything bigger before even decoding it
const MAX_EDGE = 1600; // longest side after resizing
const JPEG_QUALITY = 0.82;

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
export const isUploadConfigured = !!(cloudName && uploadPreset);

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type.toLowerCase())) {
    return 'Please choose a photo (JPEG, PNG, WebP or HEIC). Other file types are not accepted.';
  }
  if (file.size > MAX_INPUT_BYTES) {
    return 'That photo is larger than 15 MB. Please pick a smaller one.';
  }
  return null;
}

/** Shrink to at most MAX_EDGE on the longest side and re-encode as JPEG. */
export function resizeImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('That photo could not be read. Try a JPEG or PNG.'));
    };
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, MAX_EDGE / Math.max(img.width, img.height));
      const w = Math.max(1, Math.round(img.width * scale));
      const h = Math.max(1, Math.round(img.height * scale));
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Your browser could not process the photo.'));
      ctx.fillStyle = '#ffffff'; // PNGs with transparency become white, not black
      ctx.fillRect(0, 0, w, h);
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, w, h);
      canvas.toBlob(
        b => (b ? resolve(b) : reject(new Error('Your browser could not process the photo.'))),
        'image/jpeg',
        JPEG_QUALITY
      );
    };
    img.src = url;
  });
}

export interface UploadedImage {
  url: string;
  publicId: string;
}

/** Validate, resize and upload one photo. `folder` keeps recipe photos together in the Cloudinary library. */
export async function uploadRecipePhoto(file: File, folder = 'heritage-cookbook'): Promise<UploadedImage> {
  if (!isUploadConfigured) throw new Error('Photo uploads are not set up yet.');
  const problem = validateImageFile(file);
  if (problem) throw new Error(problem);

  const blob = await resizeImage(file);
  const body = new FormData();
  body.append('file', blob, 'photo.jpg');
  body.append('upload_preset', uploadPreset!);
  body.append('folder', folder);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: 'POST', body });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.secure_url) {
    throw new Error(data?.error?.message ? `Upload failed: ${data.error.message}` : 'The photo could not be uploaded. Please try again.');
  }
  return { url: data.secure_url as string, publicId: data.public_id as string };
}
