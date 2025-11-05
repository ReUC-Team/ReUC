import * as ApplicationError from "../errors/index.js";
import user from "../user/index.js";
import outsider from "../outsider/index.js";

/**
 * Orchestrates the update of a user's combined profile, delegating the
 * update operations to the respective 'user' and 'outsider' modules.
 * This use case trusts that the underlying modules will perform their
 * own necessary format and business rule validations.
 *
 * @param {object} params
 * @param {string} params.uuidUser - The user's UUID.
 * @param {string} params.uuidOutsider - The outsider's (role) UUID.
 * @param {object} params.body - The data payload containing the updates.
 * @param {object} params.body.firstName
 * @param {object} params.body.middleName
 * @param {object} params.body.lastName
 * @param {string} params.body.phoneNumber
 * @param {string} params.body.location
 * @param {string} params.body.organizationName
 *
 * @throws {ApplicationError.ValidationError} If the data fails validation within the user or outsider modules.
 * @throws {ApplicationError.NotFoundError} If either the user or outsider entity is not found during the update.
 * @throws {ApplicationError.ApplicationError} For other unexpected errors.
 */
export async function update({ uuidUser, uuidOutsider, body }) {
  try {
    const [{ user: updatedUser }, { outsider: updatedOutsider }] =
      await Promise.all([
        user.update({ uuidUser, body }),
        outsider.update({ uuidOutsider, body }),
      ]);

    return {
      profile: {
        firstName: updatedUser.firstName,
        middleName: updatedUser.middleName,
        lastName: updatedUser.lastName,
        status: updatedUser.userStatus?.name || null, // se hizo nulleable
        organizationName: updatedOutsider.organizationName,
        phoneNumber: updatedOutsider.phoneNumber,
        location: updatedOutsider.location,
        description: updatedOutsider.description || null,
      },
    };
  } catch (err) {
    if (err instanceof ApplicationError.NotFoundError)
      throw new ApplicationError.NotFoundError(
        "Profile could not be retrieved. The specified user or role was not found.",
        { details: err.details, cause: err }
      );

    if (err instanceof ApplicationError.ApplicationError) throw err;

    console.error(`Application Error (profile.update):`, err);
    throw new ApplicationError.ApplicationError(
      "An unexpected error occurred while updating the profile.",
      { cause: err }
    );
  }
}
