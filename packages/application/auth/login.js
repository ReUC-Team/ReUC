import { validateLoginPayload } from "./validators.js";
import * as ApplicationError from "../errors/index.js";
import { loginUser } from "@reuc/domain/user/loginUser.js";
import * as DomainError from "@reuc/domain/errors/index.js";

/**
 * Handles the user login process.
 *
 * @param {object} params
 * @param {object} params.data
 * @param {string} params.data.email - The user's email.
 * @param {string} params.data.password - The user's password.
 * @param {string} params.ip - The user's IP address.
 * @param {string} params.userAgent - The user's user agent.
 * @param {object} params.tokenConfig - Configuration for generating JWTs.
 * @param {string} params.tokenConfig.accessSecret
 * @param {string} params.tokenConfig.accessExpiresIn
 * @param {string} params.tokenConfig.refreshSecret
 * @param {string} params.tokenConfig.refreshExpiresIn
 *
 * @throws {ApplicationError.ValidationError} If input validation fails.
 * @throws {ApplicationError.AuthenticationError} If credentials are invalid.
 * @throws {ApplicationError.ApplicationError} - For other unexpected errors.
 */
export async function login({ data, ip, userAgent, tokenConfig }) {
  const email = data.email;
  const password = data.password;

  validateLoginPayload({ email, password });

  try {
    const { user, accessToken, refreshToken } = await loginUser({
      email,
      password,
      ip,
      userAgent,
      tokenConfig,
    });

    return { user, tokens: { accessToken, refreshToken } };
  } catch (err) {
    if (err instanceof DomainError.AuthenticationError)
      throw new ApplicationError.AuthenticationError(
        "Authentication failed. Please check your credentials.",
        { cause: err }
      );

    if (err instanceof DomainError.DomainError)
      throw new ApplicationError.ApplicationError(
        "The request could not be processed due to a server error.",
        { cause: err }
      );

    console.error(`Application Error (auth.login):`, err);
    throw new ApplicationError.ApplicationError(
      "An unexpected error occurred during login.",
      { cause: err }
    );
  }
}
