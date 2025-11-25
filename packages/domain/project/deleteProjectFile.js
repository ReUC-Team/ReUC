import * as DomainError from "../errors/index.js";
import { projectRepo } from "@reuc/infrastructure/projectRepo.js";
import * as InfrastructureError from "@reuc/infrastructure/errors/index.js";

/**
 * Soft deletes a file resource from a project.
 * @param {object} params
 * @param {string} params.uuidProject - The UUID of the project.
 * @param {string} params.uuidRequestingUser - The UUID of the user deleting.
 * @param {string} params.uuidResource - The UUID of the resource to delete.
 *
 * @throws {DomainError.NotFoundError} If the project or file is not found.
 * @throws {DomainError.AuthorizationError} If the user is not a team member.
 * @throws {DomainError.BusinessRuleError} If a business rule is violated.
 * @throws {DomainError.DomainError} For any unexpected errors.
 */
export async function deleteProjectFile({
  uuidProject,
  uuidRequestingUser,
  uuidResource,
}) {
  try {
    const projectData = await projectRepo.getForValidation(uuidProject);
    if (!projectData) {
      throw new DomainError.NotFoundError(
        `Project with UUID '${uuidProject}' could not be found to delete resources.`,
        { details: { resource: "project", identifier: uuidProject } }
      );
    }

    const teamMembers = projectData.teamMembers.map((tm) => tm.uuidUser);
    if (!teamMembers.includes(uuidRequestingUser)) {
      throw new DomainError.AuthorizationError(
        "Only a team member of the project can delete resources from this project."
      );
    }

    return await projectRepo.deleteFileResource(
      uuidResource,
      uuidProject,
      uuidRequestingUser
    );
  } catch (err) {
    if (err instanceof InfrastructureError.NotFoundError)
      throw new DomainError.NotFoundError(
        `File resource with UUID ${uuidResource} could not be found to delete.`,
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
        `The delete of the resource failed because the provided '${field}' does not exist.`,
        { cause: err, details: err.details }
      );
    }

    if (err instanceof DomainError.DomainError) throw err;

    if (err instanceof InfrastructureError.InfrastructureError)
      throw new DomainError.DomainError(
        "The delete of the resource could not be completed due to a system error.",
        { cause: err }
      );

    console.error(`Domain error (deleteProjectFile):`, err);
    throw new DomainError.DomainError(
      "An unexpected error occurred while deleting the resource.",
      { cause: err }
    );
  }
}
