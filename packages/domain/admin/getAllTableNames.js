import * as DomainError from "../errors/index.js";
import { adminRepo } from "@reuc/infrastructure/adminRepo.js";
import * as InfrastructureError from "@reuc/infrastructure/errors/index.js";

/**
 * Retrieves a list of all database table names.
 *
 * @throws {DomainError.DomainError} For any unexpected errors.
 */
export function getAllTableNames() {
  try {
    return adminRepo.getAllTableNames();
  } catch (err) {
    if (err instanceof InfrastructureError.InfrastructureError)
      throw new DomainError.DomainError(
        "The fetch of table names could not be completed due to a system error.",
        {
          cause: err,
        }
      );

    console.error(`Domain error (getAllTableNames):`, err);
    throw new DomainError.DomainError(
      "An unexpected error occurred while fetching table names.",
      { cause: err }
    );
  }
}
