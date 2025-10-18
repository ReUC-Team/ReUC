export const ALLOWED_MIME_TYPES = {
  images: ["image/jpeg", "image/png", "image/webp"],
  documents: ["application/pdf"],
};

export const MAX_FILE_SIZES_MB = {
  images: 5, // 5MB
  documents: 10, // 10MB
};

export const MODEL_FILE_RULES = {
  APPLICATION: {
    BANNER: {
      kind: "image",
      maxSizeMB: MAX_FILE_SIZES_MB.images,
      allowedMime: ALLOWED_MIME_TYPES.images,
    },
    DOCUMENT: {
      kind: "document",
      maxSizeMB: MAX_FILE_SIZES_MB.documents,
      allowedMime: ALLOWED_MIME_TYPES.documents,
    },
  },
  // TODO: Reference for later inplemetation
  // USER: {
  //   AVATAR: { type: "image", maxSizeMB: 2, allowedMime: ["image/jpeg", "image/png"] },
  // },
};
