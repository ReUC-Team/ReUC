import * as DomainError from "../errors/index.js";
import { facultyRepo } from "@reuc/infrastructure/facultyRepo.js";
import * as InfrastructureError from "@reuc/infrastructure/errors/index.js";

/**
 * Retrieves all faculties.
 *
 * @throws {DomainError.DomainError} For any unexpected errors.
 */
export async function getAllFaculties() {
  try {
    return await facultyRepo.getAll();
  } catch (err) {
    if (err instanceof InfrastructureError.InfrastructureError)
      throw new DomainError.DomainError(
        "The fetch of faculties could not be completed due to a system error.",
        {
          cause: err,
        }
      );

    console.error(`Domain error (getAllFaculties):`, err);
    throw new DomainError.DomainError(
      "An unexpected error occurred while fetching faculties.",
      { cause: err }
    );
  }
}
