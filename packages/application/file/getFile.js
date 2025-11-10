import { validateGetFileQuery } from "./validators.js";
import * as ApplicationError from "../errors/index.js";
import { getFileByTarget } from "@reuc/domain/file/getFileByTarget.js";
import * as DomainError from "@reuc/domain/errors/index.js";

/**
 * Retrieves a file linked to a specific entity and purpose.
 *
 * @param {object} params
 * @param {string} params.modelTarget - The name of the target model (e.g., "APPLICATION").
 * @param {string} params.uuidTarget - The UUID of the target entity.
 * @param {string} params.purpose - The purpose of the file link (e.g., "BANNER").
 * @param {string} [params.uuidFile] - The UUID of the specific file (required for "many" cardinality).
 *
 * @throws {ApplicationError.ValidationError} If the input parameters are invalid.
 * @throws {ApplicationError.NotFoundError} If the domain layer reports that the file link was not found.
 * @throws {ApplicationError.ApplicationError} For other unexpected errors.
 */
export async function getFile({
  modelTarget,
  uuidTarget,
  purpose,
  uuidFile = undefined,
}) {
  validateGetFileQuery({ modelTarget, uuidTarget, purpose, uuidFile });

  try {
    const fileData = await getFileByTarget(
      modelTarget,
      uuidTarget,
      purpose,
      uuidFile
    );

    return fileData;
  } catch (err) {
    if (err instanceof DomainError.BusinessRuleError)
      throw new ApplicationError.ValidationError(
        "The request violates business rules.",
        { details: err.details, cause: err }
      );

    if (err instanceof DomainError.NotFoundError)
      throw new ApplicationError.NotFoundError(
        "The requested resource was not found.",
        { details: err.details, cause: err }
      );

    if (err instanceof DomainError.DomainError)
      throw new ApplicationError.ApplicationError(
        "The request could not be processed due to a server error.",
        { cause: err }
      );

    console.error(`Application Error (file.getFile):`, err);
    throw new ApplicationError.ApplicationError(
      "An unexpected error occurred while retrieving the file.",
      { cause: err }
    );
  }
}
