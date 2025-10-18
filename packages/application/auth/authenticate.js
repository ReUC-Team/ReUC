import * as ApplicationError from "../errors/index.js";
import { verifyAuthToken } from "@reuc/domain/user/session/verifyAuthToken.js";
import * as DomainError from "@reuc/domain/errors/index.js";

/**
 * Verifies an access token to authenticate a session.
 *
 * @param {object} params
 * @param {string} params.token - The access token to verify.
 * @param {string} params.ip - The user's IP address.
 * @param {string} params.userAgent - The user's user agent.
 * @param {object} params.tokenConfig - Configuration for token verification.
 * @param {string} params.tokenConfig.accessSecret
 *
 * @throws {ApplicationError.AuthenticationError} If the token is invalid or mismatched.
 * @throws {ApplicationError.ApplicationError} - For other unexpected errors.
 */
export async function authenticate({ token, ip, userAgent, tokenConfig }) {
  try {
    const decodedPayload = await verifyAuthToken({
      token,
      ip,
      userAgent,
      tokenConfig,
    });

    return decodedPayload;
  } catch (err) {
    if (err instanceof DomainError.AuthenticationError)
      throw new ApplicationError.AuthenticationError(
        "Authentication failed. Please log in again.",
        { cause: err }
      );

    console.error(`Application Error (auth.authenticate):`, err);
    throw new ApplicationError.ApplicationError(
      "An unexpected error occurred during authentication.",
      { cause: err }
    );
  }
}
