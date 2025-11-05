import user from "../user/index.js";
import outsider from "../outsider/index.js";
import * as ApplicationError from "../errors/index.js";

/**
 * Retrieves a combined user profile by aggregating data from the user and outsider entities.
 *
 * @param {object} params
 * @param {string} params.uuidUser - The unique identifier for the user.
 * @param {string} params.uuidOutsider - The unique identifier for the outsider role.
 *
 * @throws {ApplicationError.ValidationError} If the data fails validation within the user or outsider modules.
 * @throws {ApplicationError.NotFoundError} If either the user or outsider entity is not found.
 * @throws {ApplicationError.ApplicationError} For other unexpected errors.
 */
export async function getByUuids({ uuidUser, uuidOutsider }) {
  try {
    const [{ user: userData }, { outsider: outsiderData }] = await Promise.all([
      user.getByUuid({ uuidUser }),
      outsider.getByUuid({ uuidOutsider }),
    ]);

    return {
      profile: {
        firstName: userData.firstName,
        middleName: userData.middleName,
        lastName: userData.lastName,
        status: userData.userStatus?.name || null,
        organizationName: outsiderData.organizationName,
        phoneNumber: outsiderData.phoneNumber,
        location: outsiderData.location,
        description: outsiderData.description || null,
      },
    };
  } catch (err) {
    if (err instanceof ApplicationError.NotFoundError)
      throw new ApplicationError.NotFoundError(
        "Profile could not be retrieved. The specified user or role was not found.",
        { details: err.details, cause: err }
      );

    if (err instanceof ApplicationError.ApplicationError) throw err;

    console.error(`Application Error (profile.getByUuids):`, err);
    throw new ApplicationError.ApplicationError(
      "An unexpected error occurred while fetching the profile.",
      { cause: err }
    );
  }
}
