import { tokenService } from "../../libs/auth/tokenService.js";
import { verifyTokenAndSession } from "./utils.js";
import * as DomainError from "../../errors/index.js";

/**
 * Verifies a refresh token and generates a new access token.
 *
 * @param {object} params - The refresh parameters.
 * @param {string} params.token - The refresh token.
 * @param {string} params.ip - The current IP address of the user.
 * @param {string} params.userAgent - The current user agent of the user.
 * @param {object} params.tokenConfig - Configuration for tokens.
 * @param {string} params.tokenConfig.refreshSecret - The secret for the refresh token.
 * @param {string} params.tokenConfig.accessSecret - The secret for the new access token.
 * @param {string} params.tokenConfig.accessExpiresIn - The expiration for the new access token.
 *
 * @throws {DomainError.AuthenticationError} If the refresh token is invalid or session details mismatch.
 * @throws {DomainError.DomainError} For other unexpected errors.
 */
export async function refreshAuthToken({ token, ip, userAgent, tokenConfig }) {
  const payload = await verifyTokenAndSession({
    token,
    secret: tokenConfig.refreshSecret,
    ip,
    userAgent,
  });

  const newAccessTokenPayload = {
    uuid_user: payload.uuid_user,
    role: payload.role,
    ip: payload.ip,
    ua: payload.ua,
  };

  const newAccessToken = tokenService.generate({
    payload: newAccessTokenPayload,
    secret: tokenConfig.accessSecret,
    expiresIn: tokenConfig.accessExpiresIn,
  });

  return newAccessToken;
}
