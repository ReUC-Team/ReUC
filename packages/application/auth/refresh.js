import * as ApplicationError from "../errors/index.js";
import { refreshAuthToken } from "@reuc/domain/user/session/refreshAuthToken.js";
import * as DomainError from "@reuc/domain/errors/index.js";

/**
 * Refreshes an authentication session using a refresh token.
 *
 * @param {object} params
 * @param {string} params.token - The refresh token.
 * @param {string} params.ip - The user's IP address.
 * @param {string} params.userAgent - The user's user agent.
 * @param {object} params.tokenConfig - Configuration for token operations.
 * @param {string} params.tokenConfig.refreshSecret
 * @param {string} params.tokenConfig.accessSecret
 * @param {string} params.tokenConfig.accessExpiresIn
 *
 * @throws {ApplicationError.AuthenticationError} If the refresh token is invalid.
 * @throws {ApplicationError.ApplicationError} - For other unexpected errors.
 */
export async function refresh({ token, ip, userAgent, tokenConfig }) {
  try {
    const newAccessToken = await refreshAuthToken({
      token,
      ip,
      userAgent,
      tokenConfig,
    });

    return { accessToken: newAccessToken };
  } catch (err) {
    if (err instanceof DomainError.AuthenticationError)
      throw new ApplicationError.AuthenticationError(
        "Authentication failed. Please log in again.",
        { cause: err }
      );

    if (err instanceof DomainError.DomainError)
      throw new ApplicationError.ApplicationError(
        "The request could not be processed due to a server error.",
        { cause: err }
      );

    console.error(`Application Error (auth.refresh):`, err);
    throw new ApplicationError.ApplicationError(
      "An unexpected error occurred while refreshing the session.",
      { cause: err }
    );
  }
}
