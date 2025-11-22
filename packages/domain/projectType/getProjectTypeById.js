import * as DomainError from "../errors/index.js";
import { projectTypeRepo } from "@reuc/infrastructure/projectTypeRepo.js";
import * as InfrastructureError from "@reuc/infrastructure/errors/index.js";

/**
 * Retrieves a project type by its ID.
 * @param {number|string} projectTypeId - The number of records to return per page.
 *
 * @throws {DomainError.NotFoundError}
 * @throws {DomainError.DomainError} If a database or other unexpected error occurs.
 */
export async function getProjectTypeById(projectTypeId) {
  try {
    const type = await projectTypeRepo.findById(
      Number(projectTypeId) ? Number(projectTypeId) : 0
    );
    if (!type)
      throw new DomainError.NotFoundError(
        `Project Type with ID ${projectTypeId} could not be found.`,
        { details: { resource: "projectType", identifier: projectTypeId } }
      );

    return type;
  } catch (err) {
    if (err instanceof DomainError.DomainError) throw err;

    if (err instanceof InfrastructureError.InfrastructureError)
      throw new DomainError.DomainError(
        "The fetch of the project could not be completed due to a system error.",
        { cause: err }
      );

    console.error(`Domain error (getProjectTypeById):`, err);
    throw new DomainError.DomainError(
      "An unexpected error occurred while fetching project.",
      { cause: err }
    );
  }
}
