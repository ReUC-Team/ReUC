import { ValidationError } from "../errors/ValidationError.js";
import { validateDate } from "../shared/validators.js";
import {
  validateFileSize,
  validateMimeType,
  validateBuffer,
} from "@reuc/file-storage/utils/validationUtils.js";
import { createApplication } from "@reuc/domain/application/createApplication.js";

function prepareFilePayload({ imageDefault, fileName, file }) {
  if (imageDefault) {
    return {
      defaultImage: imageDefault,
      customImage: undefined,
    };
  }

  if (!file?.buffer) {
    return {
      defaultImage: undefined,
      customImage: undefined,
    };
  }

  return {
    defaultImage: undefined,
    customImage: {
      name: fileName || "aplication-image-banner-upload",
      file: {
        mimetype: file.mimetype,
        buffer: file.buffer,
      },
    },
  };
}

export async function create({ uuidAuthor, body, file }) {
  const dateError = validateDate(body.deadline);
  if (dateError) throw new ValidationError(dateError);

  const { imageDefault, fileName, problemType, ...application } = body;

  if (!imageDefault) {
    const sizeError = validateFileSize(file);
    if (sizeError) throw new ValidationError(sizeError);

    const typeError = validateMimeType(file);
    if (typeError) throw new ValidationError(typeError);

    const bufferError = validateBuffer(file);
    if (bufferError) throw new ValidationError(bufferError);
  }

  application.problemType = (problemType || []).filter((e) => e !== "otro");

  const newApplication = await createApplication({
    uuidAuthor,
    application,
    file: prepareFilePayload({ imageDefault, fileName, file }),
  });

  return { application: newApplication };
}
