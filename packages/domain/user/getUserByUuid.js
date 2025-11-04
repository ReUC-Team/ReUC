import * as DomainError from "../errors/index.js";
import { userRepo } from "@reuc/infrastructure/userRepo.js";
import * as InfrastructureError from "@reuc/infrastructure/errors/index.js";

/**
 * Retrieves a user by their UUID.
 *
 * @throws {DomainError.ValidationError} If the input data is invalid.
 * @throws {DomainError.NotFoundError} User is not found.
 * @throws {DomainError.DomainError} For other unexpected errors.
 */
export async function getUserByUuid({ uuidUser }) {
  try {
    const user = await userRepo.findByUuid(uuidUser);

    if (!user)
      throw new DomainError.NotFoundError(
        `User with UUID ${uuidUser} could not be found.`,
        { details: { resource: "user", identifier: uuidUser } }
      );

    const { password, ...safeUser } = user;

    return safeUser;
  } catch (err) {
    if (err instanceof DomainError.DomainError) throw err;

    if (err instanceof InfrastructureError.InfrastructureError)
      throw new DomainError.DomainError(
        "The fetch of the user could not be completed due to a system error.",
        { cause: err }
      );

    console.error(`Domain error (getUserByUuid):`, err);
    throw new DomainError.DomainError(
      "An unexpected error occurred while fetching the user.",
      { cause: err }
    );
  }
}
