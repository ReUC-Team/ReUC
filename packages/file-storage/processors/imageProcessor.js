import sharp from "sharp";

/**
 * Processes an image buffer to resize, reformat, and optimize it.
 * This function maintains the image's aspect ratio when resizing.
 *
 * @param {Buffer} buffer - The raw image buffer to be processed.
 * @param {object} [options] - An object containing processing options.
 * @param {number|null} [options.width=null] - The maximum target width in pixels.
 * @param {number|null} [options.height=null] - The maximum target height in pixels.
 * @param {string|null} [options.format=null] - The target format (e.g., 'jpeg', 'png', 'webp'). If null, original format is kept.
 * @param {number} [options.quality=80] - The image quality for lossy formats like 'jpeg' or 'webp' (1-100).
 *
 * @returns {Promise<{buffer: Buffer, mimetype: string, size:number}>} A promise that resolves to an object with the processed buffer and new metadata.
 */
export async function processImage(buffer, options) {
  const { width = null, height = null, format = null, quality = 80 } = options;

  let pipeline = sharp(buffer);

  if (width || height) {
    pipeline = pipeline.resize(width, height, {
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  if (format) {
    pipeline = pipeline.toFormat(format, { quality });
  }

  const { data, info } = await pipeline.toBuffer({ resolveWithObject: true });

  return {
    buffer: data,
    mimetype: `image/${info.format}`,
    size: info.size,
  };
}
