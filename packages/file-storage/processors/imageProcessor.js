import sharp from "sharp";

export async function processImage(buffer, options = {}) {
  const { width = null, height = null, format = null, quality = 80 } = options;

  let pipeline = sharp(buffer);

  if (width || height) {
    pipeline = pipeline.resize(width, height, { fit: "inside" });
  }

  if (format) {
    pipeline = pipeline.toFormat(format, { quality });
  }

  return await pipeline.toBuffer();
}
