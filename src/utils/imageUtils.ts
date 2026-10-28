/**
 * Image processing utilities for mobile medicine photos.
 * Compresses camera photos to lightweight base64 data URLs to protect localStorage limits.
 */

export async function compressAndResizeImage(
  file: File,
  maxWidth: number = 600,
  maxHeight: number = 600,
  quality: number = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect-ratio preserved dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Export as JPEG with controlled quality
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.onerror = () => reject(new Error('Failed to load image file.'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.readAsDataURL(file);
  });
}

// Preset realistic medical pill photo renderings (Data URIs)
export const SAMPLE_MEDICINE_PHOTOS = [
  {
    id: 'sample_round_white',
    label: 'White Round Tablet (Scored)',
    dataUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><defs><radialGradient id="grad1" cx="35%" cy="35%" r="65%"><stop offset="0%" stop-color="%23ffffff"/><stop offset="70%" stop-color="%23e2e8f0"/><stop offset="100%" stop-color="%23cbd5e1"/></radialGradient><filter id="shadow"><feDropShadow dx="0" dy="10" stdDeviation="12" flood-opacity="0.25"/></filter></defs><rect width="300" height="300" fill="%23f8fafc"/><circle cx="150" cy="150" r="100" fill="url(%23grad1)" filter="url(%23shadow)"/><line x1="150" y1="65" x2="150" y2="235" stroke="%2394a3b8" stroke-width="4" stroke-linecap="round"/><circle cx="150" cy="150" r="92" fill="none" stroke="%23ffffff" stroke-width="2" opacity="0.6"/></svg>',
  },
  {
    id: 'sample_blue_capsule',
    label: 'Teal/Blue Dual Capsule',
    dataUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><defs><linearGradient id="capTeal" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%230ea5e9"/><stop offset="100%" stop-color="%230369a1"/></linearGradient><linearGradient id="capWhite" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%23ffffff"/><stop offset="100%" stop-color="%23e2e8f0"/></linearGradient><filter id="shadow2"><feDropShadow dx="4" dy="12" stdDeviation="10" flood-opacity="0.25"/></filter></defs><rect width="300" height="300" fill="%23f8fafc"/><g transform="rotate(-35 150 150)" filter="url(%23shadow2)"><path d="M90,110 C90,80 110,60 150,60 C190,60 210,80 210,110 L210,150 L90,150 Z" fill="url(%23capTeal)"/><path d="M90,150 L210,150 L210,190 C210,220 190,240 150,240 C110,240 90,220 90,190 Z" fill="url(%23capWhite)"/><line x1="90" y1="150" x2="210" y2="150" stroke="%230284c7" stroke-width="3"/></g></svg>',
  },
  {
    id: 'sample_purple_oval',
    label: 'Purple Oval Tablet',
    dataUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><defs><linearGradient id="purpleGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%23a855f7"/><stop offset="100%" stop-color="%237e22ce"/></linearGradient><filter id="shadow3"><feDropShadow dx="0" dy="10" stdDeviation="12" flood-opacity="0.25"/></filter></defs><rect width="300" height="300" fill="%23f8fafc"/><g transform="rotate(30 150 150)" filter="url(%23shadow3)"><rect x="80" y="105" width="140" height="90" rx="45" fill="url(%23purpleGrad)"/><line x1="150" y1="110" x2="150" y2="190" stroke="%236b21a8" stroke-width="3" stroke-linecap="round"/><text x="110" y="157" fill="%23f3e8ff" font-family="sans-serif" font-size="20" font-weight="bold" opacity="0.65">20</text></g></svg>',
  },
  {
    id: 'sample_amber_syrup',
    label: 'Oral Suspension Bottle',
    dataUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><defs><linearGradient id="bottleAmber" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="%23b45309"/><stop offset="50%" stop-color="%23d97706"/><stop offset="100%" stop-color="%2392400e"/></linearGradient><filter id="shadow4"><feDropShadow dx="0" dy="10" stdDeviation="10" flood-opacity="0.2"/></filter></defs><rect width="300" height="300" fill="%23f8fafc"/><g filter="url(%23shadow4)"><rect x="120" y="55" width="60" height="25" rx="5" fill="%23ffffff" stroke="%23cbd5e1" stroke-width="3"/><rect x="100" y="80" width="100" height="170" rx="15" fill="url(%23bottleAmber)"/><rect x="110" y="115" width="80" height="100" rx="5" fill="%23ffffff"/><text x="125" y="145" fill="%230284c7" font-family="sans-serif" font-size="14" font-weight="bold">Rx</text><line x1="120" y1="160" x2="180" y2="160" stroke="%2394a3b8" stroke-width="2"/><line x1="120" y1="175" x2="170" y2="175" stroke="%2394a3b8" stroke-width="2"/><line x1="120" y1="190" x2="160" y2="190" stroke="%2394a3b8" stroke-width="2"/></g></svg>',
  },
];
