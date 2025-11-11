import { Application } from "./Application.js";
import { FileDescriptor } from "../file/FileDescriptor.js";
import * as DomainError from "../errors/index.js";
import { applicationRepo } from "@reuc/infrastructure/applicationRepo.js";
import * as InfrastructureError from "@reuc/infrastructure/errors/index.js";

/**
 * Creates a new application, including its associated banner file.
 * @param {object} params
 * @param {string} params.uuidAuthor - The UUID of the outsider creating the application.
 * @param {object} params.application - The core data for the application.
 * @param {object} params.banner - The banner file data.
 * @param {Array<object>} params.attachments - The attachment files data.
 *
 * @throws {DomainError.ValidationError} If the input data is invalid.
 * @throws {DomainError.BusinessRuleError} If a invalid business rule.
 * @throws {DomainError.DomainError} For any unexpected errors.
 */
export async function createApplication({
  uuidAuthor,
  application,
  banner,
  attachments,
}) {
  try {
    const newApplication = new Application({
      ...application,
      uuidAuthor,
      applicationProjectType: application.projectType,
      applicationFaculty: application.faculty,
      applicationProblemType: application.problemType,
      applicationCustomProblemType: application.problemTypeOther,
    });

    const bannerPayload = _prepareBannerPayload(banner);
    const attachmentsPayload = _prepareAttachmentsPayload(attachments);

    return await applicationRepo.save(
      newApplication.toPrimitives(),
      bannerPayload,
      attachmentsPayload
    );
  } catch (err) {
    if (err instanceof InfrastructureError.ForeignKeyConstraintError) {
      const field = err.details?.field || "related resource";

      throw new DomainError.BusinessRuleError(
        `The creation of the application failed because the provided '${field}' doest not exist.`,
        { cause: err, details: err.details }
      );
    }

    if (err instanceof DomainError.DomainError) throw err;

    if (err instanceof InfrastructureError.InfrastructureError)
      throw new DomainError.DomainError(
        "The creation of the application could not be completed due to a system error.",
        { cause: err }
      );

    console.error(`Domain error (createApplication):`, err);
    throw new DomainError.DomainError(
      "An unexpected error occurred while creating the application.",
      { cause: err }
    );
  }
}

/**
 * A private helper to create a FileDescriptor and prepare the payload for the repository.
 * @private
 */
function _prepareBannerPayload(banner) {
  if (
    !banner ||
    (!banner.defaultBannerUuid && !banner.customBanner?.file?.buffer)
  )
    return {};

  let descriptor;
  let payload;

  if (banner.defaultBannerUuid) {
    descriptor = new FileDescriptor({
      defaultBannerUuid: banner.defaultBannerUuid,
      modelTarget: "APPLICATION",
      purpose: "BANNER",
      isDefault: true,
    });
  } else {
    descriptor = new FileDescriptor({
      name: banner.customBanner.name,
      modelTarget: "APPLICATION",
      purpose: "BANNER",
      isDefault: false,
    });
    payload = {
      mimetype: banner.customBanner.file.mimetype,
      buffer: banner.customBanner.file.buffer,
    };
  }

  const descriptorPrimitives = descriptor.toPrimitives();

  return {
    customBanner: payload
      ? { fileDescriptor: descriptorPrimitives, filePayload: payload }
      : undefined,
    defaultBannerUuid: descriptor.isDefault ? descriptorPrimitives : undefined,
  };
}

/**
 * Prepares the attachment payload for the repository.
 * @private
 */
function _prepareAttachmentsPayload(attachments) {
  if (!attachments || attachments.length === 0) {
    return [];
  }

  const payloadArray = [];

  for (const file of attachments) {
    let descriptor;
    let payload;

    descriptor = new FileDescriptor({
      name: file.name,
      modelTarget: "APPLICATION",
      purpose: "ATTACHMENT",
    });
    payload = {
      mimetype: file.file.mimetype,
      buffer: file.file.buffer,
    };

    let descriptorPrimitives = descriptor.toPrimitives();

    payloadArray.push({
      fileDescriptor: descriptorPrimitives,
      filePayload: payload,
    });
  }

  return payloadArray;
}
