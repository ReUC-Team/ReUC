import outsider from "../outsider/index.js";
import * as ApplicationError from "../errors/index.js";
import { isProfileComplete } from "@reuc/domain/outsider/isProfileComplete.js";

/**
 * Checks if an outsider's profile is complete based on domain business rules.
 *
 * @param {object} params
 * @param {string} params.uuidOutsider - The UUID of the outsider to check.
 *
 * @throws {ApplicationError.ValidationError} If the UUID is invalid.
 * @throws {ApplicationError.NotFoundError} If the outsider is not found.
 * @throws {ApplicationError.ApplicationError} For other unexpected errors.
 */
export async function checkStatus({ uuidOutsider }) {
  try {
    const { outsider: outsiderData } = await outsider.getByUuid({
      uuidOutsider,
    });

    const status = isProfileComplete(outsiderData);

    return { status };
  } catch (err) {
    if (err instanceof ApplicationError.ApplicationError) throw err;

    console.error(`Application Error (profile.checkStatus):`, err);
    throw new ApplicationError.ApplicationError(
      "An unexpected error occurred while checking the profile status.",
      { cause: err }
    );
  }
}
