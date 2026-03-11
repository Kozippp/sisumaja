import imageCompression from 'browser-image-compression';

const OPTIMIZABLE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

/**
 * Optimizes an image for web: converts to WebP, resizes if needed, reduces file size.
 * Returns the original file if optimization fails or file type is not optimizable (e.g. SVG).
 */
export async function optimizeImage(file: File): Promise<File> {
  if (!OPTIMIZABLE_TYPES.includes(file.type)) {
    return file;
  }

  try {
    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: 'image/webp' as const,
      initialQuality: 0.8,
    };

    const result = await imageCompression(file, options);

    if (result instanceof File) {
      return result;
    }

    const baseName = file.name.replace(/\.[^.]+$/, '');
    return new File([result], `${baseName}.webp`, { type: 'image/webp' });
  } catch {
    return file;
  }
}
