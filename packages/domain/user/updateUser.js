import { User } from "./User.js";
import * as DomainError from "../errors/index.js";
import { userRepo } from "@reuc/infrastructure/userRepo.js";
import * as InfrastructureError from "@reuc/infrastructure/errors/index.js";

/**
 * Updates a user's profile information.
 *
 * @throws {DomainError.ValidationError} If the input data is invalid.
 * @throws {DomainError.NotFoundError} User is not found or is
 * deleted (race conditions between the find and update calls).
 * @throws {DomainError.DomainError} For other unexpected errors.
 */
export async function updateUser({ uuidUser, body }) {
  try {
    const existingUser = await userRepo.findByUuid(uuidUser);
    if (!existingUser)
      throw new DomainError.NotFoundError(
        `User with UUID '${uuidUser}' could not be found.`,
        { details: { resource: "user", identifier: uuidUser } }
      );

    const userToUpdate = new User({ ...existingUser, ...body });
    const updates = userToUpdate.toPrimitives();

    delete updates.uuid_user;
    delete updates.email;
    delete updates.password;
    delete updates.lastLoginIp;
    delete updates.lastLoginAt;
    delete updates.status;

    if (Object.keys(updates).length === 0) return existingUser;

    return await userRepo.update(uuidUser, updates);
  } catch (err) {
    // Handles race condition where user is deleted between find and update.
    if (err instanceof InfrastructureError.NotFoundError)
      throw new DomainError.NotFoundError(
        `User with UUID '${uuidUser}' could not be found for update.`,
        { details: { resource: "user", identifier: uuidUser }, cause: err }
      );

    if (err instanceof DomainError.DomainError) throw err;

    if (err instanceof InfrastructureError.InfrastructureError)
      throw new DomainError.DomainError(
        "The update of the user could not be completed due to a system error.",
        { cause: err }
      );

    console.error(`Domain error (updateUser):`, err);
    throw new DomainError.DomainError(
      "An unexpected error occurred while updating the user.",
      { cause: err }
    );
  }
}
