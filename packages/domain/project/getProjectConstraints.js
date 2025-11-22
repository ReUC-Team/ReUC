import * as DomainError from "../errors/index.js";
import { projectRepo } from "@reuc/infrastructure/projectRepo.js";
import * as InfrastructureError from "@reuc/infrastructure/errors/index.js";

/**
 * Retrieves the team role constraints for a specific project.
 *
 * @param {string} uuidProject - The UUID of the project.
 *
 * @throws {DomainError.NotFoundError} If the project or its type is not found.
 * @throws {DomainError.DomainError} For any unexpected errors.
 */
export async function getProjectConstraints(uuidProject) {
  try {
    const projectData = await projectRepo.getConstraintsForProject(uuidProject);

    if (!projectData || !projectData?.application?.applicationProjectType) {
      throw new DomainError.NotFoundError(
        `No ${uuidProject} found or has no valid project type.`,
        { details: { field: "uuidProject", rule: "not_found" } }
      );
    }

    // It should only have one based on the bussiness rules
    const type = projectData.application.applicationProjectType[0];

    return type.projectTypeId.roleConstraints;
  } catch (err) {
    if (err instanceof DomainError.DomainError) throw err;

    if (err instanceof InfrastructureError.InfrastructureError)
      throw new DomainError.DomainError(
        "The query of project constraints could not be completed due to a system error.",
        { cause: err }
      );

    console.error(`Domain error (getProjectConstraints):`, err);
    throw new DomainError.DomainError(
      "An unexpected error occurred while querying project constraints.",
      { cause: err }
    );
  }
}
