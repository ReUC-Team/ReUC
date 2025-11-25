export const ALLOWED_MIME_TYPES = {
  images: ["image/jpeg", "image/png", "image/webp"],
  documents: [
    // PDF
    "application/pdf",
    // Word
    "application/msword", // .doc
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  ],
  attachment_files: [
    // Images
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/bmp",
    // PDF
    "application/pdf",
    // Word
    "application/msword", // .doc
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    // Excel
    "application/vnd.ms-excel", // .xls
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
    // PowerPoint
    "application/vnd.ms-powerpoint", // .ppt
    "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
    // Archives
    "application/zip",
    "application/x-7z-compressed", // .7z
    "application/vnd.rar", // .rar
    "application/gzip", // .gz
    "application/x-tar", // .tar
    // Text
    "text/plain", // .txt
    "text/csv", // .csv
  ],
};

export const MAX_FILE_SIZES_MB = {
  images: 5, // 5MB
  documents: 10, // 10MB
  attachment_files: 10, // 10MB
};

export const MODEL_FILE_RULES = {
  APPLICATION: {
    BANNER: {
      kind: "image",
      context: "viewing",
      cardinality: "one",
      maxSizeMB: MAX_FILE_SIZES_MB.images,
      allowedMime: ALLOWED_MIME_TYPES.images,
    },
    ATTACHMENT: {
      kind: "mixed",
      context: "download",
      cardinality: "many",
      maxSizeMB: MAX_FILE_SIZES_MB.attachment_files,
      allowedMime: ALLOWED_MIME_TYPES.attachment_files,
    },
  },
  PROJECT: {
    RESOURCE: {
      kind: "mixed",
      context: "download",
      cardinality: "many",
      maxSizeMB: MAX_FILE_SIZES_MB.attachment_files,
      allowedMime: ALLOWED_MIME_TYPES.attachment_files,
    },
  },
  // TODO: Reference for later inplemetation
  // USER: {
  //   AVATAR: { type: "image", maxSizeMB: 2, allowedMime: ["image/jpeg", "image/png"] },
  // },
};
