import * as DomainError from "../errors/index.js";
import { problemTypeRepo } from "@reuc/infrastructure/problemTypeRepo.js";
import * as InfrastructureError from "@reuc/infrastructure/errors/index.js";

/**
 * Retrieves all predefined (`isPredefined`) problem types.
 *
 * @throws {DomainError.DomainError} For any unexpected errors.
 */
export async function getPredefinedProblemTypes() {
  try {
    return await problemTypeRepo.getAllPredefined();
  } catch (err) {
    if (err instanceof InfrastructureError.InfrastructureError)
      throw new DomainError.DomainError(
        "The fetch of predefinied problem types could not be completed due to a system error.",
        {
          cause: err,
        }
      );

    console.error(`Domain error (getPredefinedProblemTypes):`, err);
    throw new DomainError.DomainError(
      "An unexpected error occurred while fetching predefinied problem types.",
      { cause: err }
    );
  }
}
