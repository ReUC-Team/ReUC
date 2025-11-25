import { FileDescriptor } from "../file/FileDescriptor.js";
import * as DomainError from "../errors/index.js";
import { projectRepo } from "@reuc/infrastructure/projectRepo.js";
import * as InfrastructureError from "@reuc/infrastructure/errors/index.js";

/**
 * Edits a file resource in a project.
 * @param {object} params
 * @param {string} params.uuidProject - The UUID of the project.
 * @param {string} params.uuidRequestingUser - The UUID of the user editing.
 * @param {string} params.uuidResource - The UUID of the resource to edit.
 * @param {object} [params.file] - The uploaded file object.
 * @param {string} [params.file.name] - The file name.
 * @param {object} [params.file.file]
 * @param {string} [params.file.file.mimetype] - The file mimetype.
 * @param {number} [params.file.file.size] - The file size.
 * @param {Buffer} [params.file.file.buffer] - The image buffer.
 *
 * @throws {DomainError.NotFoundError} If the project or file is not found.
 * @throws {DomainError.AuthorizationError} If the user is not a team member.
 * @throws {DomainError.ValidationError} If the input data is invalid.
 * @throws {DomainError.BusinessRuleError} If a business rule is violated.
 * @throws {DomainError.DomainError} For any unexpected errors.
 */
export async function editProjectFile({
  uuidProject,
  uuidRequestingUser,
  uuidResource,
  file,
}) {
  try {
    const projectData = await projectRepo.getForValidation(uuidProject);
    if (!projectData) {
      throw new DomainError.NotFoundError(
        `Project with UUID '${uuidProject}' could not be found to edit resources.`,
        { details: { resource: "project", identifier: uuidProject } }
      );
    }

    const teamMembers = projectData.teamMembers.map((tm) => tm.uuidUser);
    if (!teamMembers.includes(uuidRequestingUser)) {
      throw new DomainError.AuthorizationError(
        "Only a team member of the project can edit resources in this project."
      );
    }

    const descriptor = new FileDescriptor({
      name: file.name,
      modelTarget: "PROJECT",
      purpose: "RESOURCE",
    });

    const resourcePayload = {
      fileDescriptor: descriptor.toPrimitives(),
      filePayload: {
        mimetype: file.file.mimetype,
        buffer: file.file.buffer,
      },
    };

    return await projectRepo.updateFileResource(
      uuidResource,
      uuidProject,
      uuidRequestingUser,
      resourcePayload
    );
  } catch (err) {
    if (err instanceof InfrastructureError.NotFoundError)
      throw new DomainError.NotFoundError(
        `File resource with UUID ${uuidResource} could not be found to update from.`,
        {
          details: {
            resource: "file",
            uuidFile: uuidResource,
            uuidUser: uuidRequestingUser,
          },
          cause: err,
        }
      );

    if (err instanceof InfrastructureError.ForeignKeyConstraintError) {
      const field = err.details?.field || "related resource";

      throw new DomainError.BusinessRuleError(
        `The edit of the resource failed because the provided '${field}' doest not exist.`,
        { cause: err, details: err.details }
      );
    }

    if (err instanceof DomainError.DomainError) throw err;

    if (err instanceof InfrastructureError.InfrastructureError)
      throw new DomainError.DomainError(
        "The edit of the resource could not be completed due to a system error.",
        { cause: err }
      );

    console.error(`Domain error (editProjectFile):`, err);
    throw new DomainError.DomainError(
      "An unexpected error occurred while editing the resource.",
      { cause: err }
    );
  }
}
