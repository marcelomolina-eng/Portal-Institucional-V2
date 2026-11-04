/**
 * Image compression and resizing utility for browser uploads.
 * Converts large camera photos (often 3-15MB) into lightweight WebP/JPEG images
 * restricted to max 400x400px (typically 15-45KB), preventing localStorage quota crashes.
 */

export interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 to 1.0
  maxInputSizeBytes?: number; // E.g. 10MB
}

export async function compressAndResizeImage(
  file: File,
  options: CompressOptions = {}
): Promise<string> {
  const {
    maxWidth = 400,
    maxHeight = 400,
    quality = 0.82,
    maxInputSizeBytes = 10 * 1024 * 1024 // 10MB hard ceiling for initial file
  } = options;

  if (!file.type.startsWith('image/')) {
    throw new Error('El archivo seleccionado no es una imagen válida.');
  }

  if (file.size > maxInputSizeBytes) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    throw new Error(`La imagen es demasiado pesada (${sizeMb} MB). Selecciona una imagen de menos de 10 MB.`);
  }

  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      try {
        URL.revokeObjectURL(objectUrl);

        let { width, height } = img;

        // Calculate aspect-ratio preserved dimensions
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        // Avoid zero dimensions
        width = Math.max(1, width);
        height = Math.max(1, height);

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('No se pudo inicializar el contexto de imagen 2D del navegador.');
        }

        // High quality rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Draw and resize
        ctx.drawImage(img, 0, 0, width, height);

        // Try WebP first for best compression/quality ratio
        let dataUrl = canvas.toDataURL('image/webp', quality);

        // Fallback to JPEG if browser doesn't support WebP export
        if (!dataUrl.startsWith('data:image/webp')) {
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        resolve(dataUrl);
      } catch (err) {
        reject(err instanceof Error ? err : new Error('Error al procesar la imagen.'));
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('No se pudo leer el archivo de imagen. Es posible que el formato esté dañado.'));
    };

    img.src = objectUrl;
  });
}
