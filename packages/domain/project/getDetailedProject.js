import * as DomainError from "../errors/index.js";
import { projectRepo } from "@reuc/infrastructure/projectRepo.js";
import * as InfrastructureError from "@reuc/infrastructure/errors/index.js";

/**
 * Retrieves a detailed project.
 * @param {string} projectUuid
 *
 * @throws {DomainError.NotFoundError} If the project is not found.
 * @throws {DomainError.DomainError} If a database or other unexpected error occurs.
 */
export async function getDetailedProject(projectUuid) {
  try {
    const project = await projectRepo.getDetailedProject(projectUuid);

    if (!project)
      throw new DomainError.NotFoundError(
        `Project with UUID ${projectUuid} could not be found.`,
        { details: { resource: "project", identifier: projectUuid } }
      );

    return project;
  } catch (err) {
    if (err instanceof DomainError.DomainError) throw err;

    if (err instanceof InfrastructureError.InfrastructureError)
      throw new DomainError.DomainError(
        "The retrieval of the project could not be completed due to a system error.",
        { cause: err }
      );

    console.error(`Domain error (getDetailedProject):`, err);
    throw new DomainError.DomainError(
      "An unexpected error occurred while querying the project.",
      { cause: err }
    );
  }
}
