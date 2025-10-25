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
 * @param {object} params.file - The file data for the banner.
 *
 * @throws {DomainError.ValidationError} If the input data is invalid.
 * @throws {DomainError.BusinessRuleError} If a invalid business rule.
 * @throws {DomainError.DomainError} For any unexpected errors.
 */
export async function createApplication({ uuidAuthor, application, file }) {
  try {
    const newApplication = new Application({
      ...application,
      uuidOutsider: uuidAuthor,
      applicationProjectType: application.projectType,
      applicationFaculty: application.faculty,
      applicationProblemType: application.problemType,
      applicationProblemTypeOther: application.problemTypeOther,
    });

    const filePayload = _prepareFilePayload(file);

    return await applicationRepo.save(
      newApplication.toPrimitives(),
      filePayload
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
function _prepareFilePayload(file) {
  if (!file || (!file.defaultImage && !file.customImage?.file?.buffer))
    return {};

  let descriptor;
  let payload;

  if (file.defaultImage) {
    descriptor = new FileDescriptor({
      name: file.defaultImage,
      modelTarget: "APPLICATION",
      purpose: "BANNER",
      isDefault: true,
    });
  } else {
    descriptor = new FileDescriptor({
      name: file.customImage.name,
      modelTarget: "APPLICATION",
      purpose: "BANNER",
      isDefault: false,
    });
    payload = {
      buffer: file.customImage.file.buffer,
      mimetype: file.customImage.file.mimetype,
    };
  }

  const descriptorPrimitives = descriptor.toPrimitives();

  return {
    customImage: payload
      ? { fileDescriptor: descriptorPrimitives, filePayload: payload }
      : undefined,
    defaultImage: descriptor.isDefault ? descriptorPrimitives : undefined,
  };
}
