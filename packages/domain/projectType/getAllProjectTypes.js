import * as DomainError from "../errors/index.js";
import { projectTypeRepo } from "@reuc/infrastructure/projectTypeRepo.js";
import * as InfrastructureError from "@reuc/infrastructure/errors/index.js";

/**
 * Retrieves all project types.
 *
 * @throws {DomainError.DomainError} For any unexpected errors.
 */
export async function getAllProjectTypes() {
  try {
    return await projectTypeRepo.getAll();
  } catch (err) {
    if (err instanceof InfrastructureError.InfrastructureError)
      throw new DomainError.DomainError(
        "The fetch of project types could not be completed due to a system error.",
        {
          cause: err,
        }
      );

    console.error(`Domain error (getAllProjectTypes):`, err);
    throw new DomainError.DomainError(
      "An unexpected error occurred while fetching project types.",
      { cause: err }
    );
  }
}
