import { verifyTokenAndSession } from "./utils.js";
import * as DomainError from "../../errors/index.js";

/**
 * Verifies an access token and the integrity of the session.
 *
 * @param {object} params - The verification parameters.
 * @param {string} params.token - The access token to verify.
 * @param {string} params.ip - The current IP address of the user.
 * @param {string} params.userAgent - The current user agent of the user.
 * @param {object} params.tokenConfig - Configuration for verifying the JWT.
 * @param {string} params.tokenConfig.accessSecret - The secret key for the access token.
 *
 * @throws {DomainError.AuthenticationError} If the token is invalid, expired, or if session details do not match.
 */
export async function verifyAuthToken({ token, ip, userAgent, tokenConfig }) {
  return verifyTokenAndSession({
    token,
    secret: tokenConfig.accessSecret,
    ip,
    userAgent,
  });
}
