// Black & white mode: the resume color is pure black (see lib/themes.ts)
export const BW_ACCENT = "#000000";

export const isBlackAndWhite = (accent: string) =>
  accent.trim().toLowerCase() === BW_ACCENT;

// Converts a photo (data URL) to grayscale, entirely in the browser.
// If anything fails, it returns the original photo.
export function toGrayscale(src: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(src);
        ctx.drawImage(img, 0, 0);
        const px = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const d = px.data;
        for (let i = 0; i < d.length; i += 4) {
          const g = Math.round(0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]);
          d[i] = d[i + 1] = d[i + 2] = g;
        }
        ctx.putImageData(px, 0, 0);
        resolve(canvas.toDataURL("image/jpeg", 0.92));
      } catch {
        resolve(src);
      }
    };
    img.onerror = () => resolve(src);
    img.src = src;
  });
}