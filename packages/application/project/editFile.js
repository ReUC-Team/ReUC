import * as ApplicationError from "../errors/index.js";
import { validateUuid } from "../shared/validators.js";
import { validateFile } from "@reuc/file-storage/shared/validations.js";
import { editProjectFile } from "@reuc/domain/project/editProjectFile.js";
import * as DomainError from "@reuc/domain/errors/index.js";

/**
 * Edits an existing file resource in a project.
 * @param {object} params
 * @param {string} params.uuidProject - The UUID of the project.
 * @param {string} params.uuidRequestingUser - The UUID of the user requesting the edit.
 * @param {string} params.uuidResource - The UUID of the resource to edit.
 * @param {object} [params.file] - The new file object from multer (optional if just renaming, but required for now).
 * @param {string} [params.file.fieldname] - The file fieldname.
 * @param {string} [params.file.originalname] - The file originalname.
 * @param {string} [params.file.mimetype] - The file mimetype.
 * @param {number} [params.file.size] - The file size.
 * @param {Buffer} [params.file.buffer] - The image buffer.
 *
 * @throws {ApplicationError.ValidationError} If the input data is invalid.
 * @throws {ApplicationError.NotFoundError} If the resource or project is not found.
 * @throws {ApplicationError.AuthorizationError} If the user is not authorized.
 * @throws {ApplicationError.ApplicationError} For other unexpected errors.
 */
export async function editFile({
  uuidProject,
  uuidRequestingUser,
  uuidResource,
  file,
}) {
  const allErrors = [];

  allErrors.push(...validateUuid(uuidProject, "uuidProject"));
  allErrors.push(...validateUuid(uuidRequestingUser, "uuidRequestingUser"));
  allErrors.push(...validateUuid(uuidResource, "uuidResource"));
  allErrors.push(
    ...validateFile(file, file?.fieldname || "file", "attachment_files")
  );

  if (allErrors.length > 0)
    throw new ApplicationError.ValidationError("Input validation failed.", {
      details: allErrors,
    });

  try {
    const newResource = await editProjectFile({
      uuidProject,
      uuidRequestingUser,
      uuidResource,
      file: {
        name: file.originalname || "project-resource",
        file: {
          mimetype: file.mimetype,
          buffer: file.buffer,
          size: file.size,
        },
      },
    });

    return { resource: newResource };
  } catch (err) {
    if (err instanceof DomainError.NotFoundError)
      throw new ApplicationError.NotFoundError(
        "The requested resource was not found.",
        { details: err.details, cause: err }
      );

    if (err instanceof DomainError.AuthorizationError)
      throw new ApplicationError.AuthorizationError(
        "User not authorized to perform this action."
      );

    if (err instanceof DomainError.BusinessRuleError)
      throw new ApplicationError.ValidationError(
        "The request violates business rules.",
        { details: err.details, cause: err }
      );

    if (err instanceof DomainError.ValidationError)
      throw new ApplicationError.ValidationError(
        "The resource file data is invalid.",
        { details: err.details, cause: err }
      );

    if (err instanceof DomainError.DomainError)
      throw new ApplicationError.ApplicationError(
        "The request could not be processed due to a server error.",
        { cause: err }
      );

    console.error(`Application Error (project.editFile):`, err);
    throw new ApplicationError.ApplicationError(
      "An unexpected error occurred while editing the resource.",
      { cause: err }
    );
  }
}
