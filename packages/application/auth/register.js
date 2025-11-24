import * as ApplicationError from "../errors/index.js";
import { validateRegisterPayload } from "./validators.js";
import { registerUser } from "@reuc/domain/user/registerUser.js";
import * as DomainError from "@reuc/domain/errors/index.js";

/**
 * Handles the user registration process.
 *
 * @param {object} params
 * @param {object} params.body - The registration body data.
 * @param {string} params.body.email
 * @param {string} params.body.password
 * @param {string} params.body.confirmPassword
 * @param {string} [params.body.universityId] - University ID provided by the university, required if the email ends with `@ucol.mx`
 * @param {string} params.ip - The user's IP address.
 * @param {string} params.userAgent - The user's user agent.
 * @param {object} params.tokenConfig - Configuration for generating JWTs.
 * @param {string} params.tokenConfig.accessSecret
 * @param {string} params.tokenConfig.accessExpiresIn
 * @param {string} params.tokenConfig.refreshSecret
 * @param {string} params.tokenConfig.refreshExpiresIn
 *
 * @throws {ApplicationError.ValidationError} If input validation fails.
 * @throws {ApplicationError.ConflictError} If the email already exists.
 * @throws {ApplicationError.ApplicationError} - For other unexpected errors.
 */
export async function register({ body, ip, userAgent, tokenConfig }) {
  validateRegisterPayload(body);

  try {
    const { user, accessToken, refreshToken } = await registerUser({
      body,
      ip,
      userAgent,
      tokenConfig,
    });

    return { user, tokens: { accessToken, refreshToken } };
  } catch (err) {
    if (err instanceof DomainError.ConflictError)
      throw new ApplicationError.ConflictError(
        "The operation could not be completed due to a conflict with an existing resource.",
        { cause: err, details: err.details }
      );

    if (err instanceof DomainError.ValidationError)
      throw new ApplicationError.ValidationError("The user data is invalid.", {
        details: err.details,
        cause: err,
      });

    if (err instanceof DomainError.DomainError)
      throw new ApplicationError.ApplicationError(
        "The request could not be processed due to a server error.",
        { cause: err }
      );

    console.error(`Application Error (auth.register):`, err);
    throw new ApplicationError.ApplicationError(
      "An unexpected error occurred during registration.",
      { cause: err }
    );
  }
}
