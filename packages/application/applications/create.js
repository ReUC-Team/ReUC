import * as ApplicationError from "../errors/index.js";
import { validateCreationPayload } from "./validators.js";
import { createApplication } from "@reuc/domain/application/createApplication.js";
import * as DomainError from "@reuc/domain/errors/index.js";

/**
 * Creates a new application.
 * @param {object} params
 * @param {string} params.uuidAuthor - The UUID of the author.
 * @param {object} params.body - The request body payload.
 * @param {string} params.body.title - The main title of the application.
 * @param {string} params.body.shortDescription - A brief, one-sentence summary.
 * @param {string} params.body.description - A detailed description of the application's problem and solution.
 * @param {string} params.body.deadline - The application deadline in 'YYYY-MM-DD' format.
 * @param {string|string[]} [params.body.projectType] - A single ID or array of IDs for associated project types.
 * @param {string|string[]} [params.body.problemType] - A single ID or array of IDs for associated problem types.
 * @param {string|string[]} [params.body.faculty] - A single ID or array of IDs for associated faculties.
 * @param {string} [params.body.problemTypeOther] - A user-defined problem type if 'other' is selected.
 * @param {string} [params.body.defaultImage] - The UUID of a pre-selected default banner image.
 * @param {object} [params.file] - The uploaded file object from multer.
 * @param {string} [params.file.mimetype] - The file mimetype.
 * @param {number} [params.file.size] - The file size.
 * @param {Buffer} [params.file.buffer] - The image buffer.
 *
 *
 * @throws {ApplicationError.ValidationError} If the input data is invalid.
 * @throws {ApplicationError.ConflictError} If a conflict occurs (e.g., invalid foreign key).
 * @throws {ApplicationError.ApplicationError} For other unexpected errors.
 */
export async function create({ uuidAuthor, body, file }) {
  validateCreationPayload(body, file);

  const { imageDefault, fileName, problemType, ...applicationData } = body;
  applicationData.problemType = (problemType || []).filter((e) => e !== "otro");

  try {
    const newApplication = await createApplication({
      uuidAuthor,
      application: applicationData,
      file: _prepareFilePayload({ imageDefault, fileName, file }),
    });

    return { application: newApplication };
  } catch (err) {
    if (err instanceof DomainError.ConflictError)
      throw new ApplicationError.ConflictError(
        "The application could not be created because a related resource was not found.",
        { details: err.details, cause: err }
      );

    if (err instanceof DomainError.ValidationError)
      throw new ApplicationError.ValidationError(
        "The application data is invalid.",
        { details: err.details, cause: err }
      );

    if (err instanceof DomainError.DomainError)
      throw new ApplicationError.ApplicationError(
        "The request could not be processed due to a server error.",
        { cause: err }
      );

    console.error(`Application Error (application.create):`, err);
    throw new ApplicationError.ApplicationError(
      "An unexpected error occurred while creating the application.",
      { cause: err }
    );
  }
}

/**
 * Prepares the file payload for the domain layer, distinguishing between
 * a default banner and a custom uploaded image.
 * @private
 */
function _prepareFilePayload({ imageDefault, fileName, file }) {
  if (imageDefault) {
    return { defaultImage: imageDefault, customImage: undefined };
  }

  return {
    defaultImage: undefined,
    customImage: {
      name: fileName || "application-banner-upload",
      file: {
        mimetype: file.mimetype,
        buffer: file.buffer,
        size: file.size,
      },
    },
  };
}
