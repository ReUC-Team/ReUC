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
 * @param {string|Array<string>} [params.body.projectType] - A single ID or array of IDs for associated project types.
 * @param {string|Array<string>} [params.body.problemType] - A single ID or array of IDs for associated problem types.
 * @param {string|Array<string>} [params.body.faculty] - A single ID or array of IDs for associated faculties.
 * @param {string} [params.body.problemTypeOther] - A user-defined problem type if 'other' is selected.
 * @param {string} [params.body.selectedBannerUuid] - The UUID of a pre-selected default banner image.
 * @param {object} [params.customBannerFile] - The uploaded file banner from multer.
 * @param {string} [params.customBannerFile.mimetype] - The file mimetype.
 * @param {number} [params.customBannerFile.size] - The file size.
 * @param {Buffer} [params.customBannerFile.buffer] - The image buffer.
 * @param {Array<object>} [params.attachments] - The uploaded files attached from multer.
 * @param {string} [params.attachments[].mimetype] - The file mimetype.
 * @param {number} [params.attachments[].size] - The file size.
 * @param {Buffer} [params.attachments[].buffer] - The image buffer.
 *
 * @throws {ApplicationError.ValidationError} If the input data is invalid.
 * @throws {ApplicationError.ConflictError} If a conflict occurs (e.g., invalid foreign key).
 * @throws {ApplicationError.ApplicationError} For other unexpected errors.
 */
export async function create({
  uuidAuthor,
  body,
  customBannerFile,
  attachments,
}) {
  const filteredProblemType = Array.isArray(body.problemType)
    ? body.problemType.filter((id) => id !== "otro")
    : body.problemType === "otro"
    ? []
    : body.problemType;

  const bodyForValidation = { ...body, problemType: filteredProblemType };

  validateCreationPayload(
    uuidAuthor,
    bodyForValidation,
    customBannerFile,
    attachments
  );

  const { selectedBannerUuid, problemType, ...applicationData } = body;
  applicationData.problemType = filteredProblemType;

  try {
    const newApplication = await createApplication({
      uuidAuthor,
      application: applicationData,
      banner: _prepareBannerPayload({ selectedBannerUuid, customBannerFile }),
      attachments: _prepareAttachmentsPayload({ attachments }),
    });

    return { application: newApplication };
  } catch (err) {
    if (err instanceof DomainError.BusinessRuleError)
      throw new ApplicationError.ValidationError(
        "The request violates business rules.",
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
 * Prepares the banner payload for the domain layer, distinguishing between
 * a default banner and a custom uploaded image.
 * @private
 */
function _prepareBannerPayload({ selectedBannerUuid, customBannerFile }) {
  if (selectedBannerUuid) {
    return { defaultBannerUuid: selectedBannerUuid, customBanner: undefined };
  }

  return {
    defaultBannerUuid: undefined,
    customBanner: {
      name: customBannerFile.originalname || "application-banner-upload",
      file: {
        mimetype: customBannerFile.mimetype,
        buffer: customBannerFile.buffer,
        size: customBannerFile.size,
      },
    },
  };
}

/**
 * Prepares the attachment payload for the domain layer.
 * @private
 */
function _prepareAttachmentsPayload({ attachments }) {
  let attachmentsPayload = [];

  if (!attachments || attachments.length === 0) {
    return attachmentsPayload;
  }

  for (const [idx, file] of attachments.entries()) {
    attachmentsPayload.push({
      name: file.originalname || `application-attachment${idx}-upload`,
      file: {
        mimetype: file.mimetype,
        buffer: file.buffer,
        size: file.size,
      },
    });
  }

  return attachmentsPayload;
}
