import { tokenService } from "../../libs/auth/tokenService.js";
import * as DomainError from "../../errors/index.js";

/**
 * A shared function for core token and session validation logic.
 * @param {object} params - The refresh parameters.
 * @param {string} params.token - The refresh token.
 * @param {string} params.secret - The secret for the token.
 * @param {string} params.ip - The current IP address of the user.
 * @param {string} params.userAgent - The current user agent of the user.
 *
 * @throws {DomainError.AuthenticationError}
 */
export function verifyTokenAndSession({ token, secret, ip, userAgent }) {
  if (!token) {
    throw new DomainError.AuthenticationError("Token is required.");
  }

  const payload = tokenService.verify({ token, secret });

  if (payload.ip !== ip || payload.ua !== userAgent) {
    throw new DomainError.AuthenticationError(
      "Session mismatch. Please log in again."
    );
  }

  return payload;
}
