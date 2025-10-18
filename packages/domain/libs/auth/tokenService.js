import jwt from "jsonwebtoken";
import { AuthenticationError, DomainError } from "../../errors/index.js";

const ALGORITHM = "HS256";

/**
 * A service for generating and verifying JSON Web Tokens (JWT).
 * This service is pure and receives all configuration via arguments.
 */
export const tokenService = {
  /**
   * Generates a JSON Web Token.
   * @param {object} config - The configuration for token generation.
   * @param {object} config.payload - The data to embed in the token.
   * @param {string} config.payload.uuid_user - The unique identifier (UUID) of the user.
   * @param {string} config.payload.role - A colon-separated string containing the user's role and the role's UUID (e.g., "outsider:some-role-uuid").
   * @param {string} config.payload.ip - The user's IP address at the time of token creation.
   * @param {string} config.payload.ua - The user's User-Agent string.
   * @param {string} config.secret - The secret key for signing the token.
   * @param {string} config.expiresIn - The token's expiration time (e.g., "15m", "7d").
   *
   * @returns {string} The generated JWT string.
   * @throws {DomainError} If an error occurs during token signing.
   */
  generate({ payload, secret, expiresIn }) {
    try {
      return jwt.sign(payload, secret, {
        algorithm: ALGORITHM,
        expiresIn,
      });
    } catch (err) {
      console.error("Error (tokenService.generate):", err);
      throw new DomainError("Could not generate token.", { cause: err });
    }
  },

  /**
   * Verifies a JSON Web Token and returns its decoded payload.
   * @param {object} config - The configuration for token verification.
   * @param {string} config.token - The JWT string to verify.
   * @param {string} config.secret - The secret key used to sign the token.
   *
   * @returns {{uuid_user: string, role: string, ip: string, ua: string}} The decoded payload from the token.
   * @throws {AuthenticationError} If the token is expired, malformed, or has an invalid signature.
   */
  verify({ token, secret }) {
    try {
      return jwt.verify(token, secret, { algorithms: [ALGORITHM] });
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError)
        throw new AuthenticationError("Token has expired.", { cause: err });

      if (err instanceof jwt.JsonWebTokenError)
        throw new AuthenticationError("Invalid token.", { cause: err });

      console.error("Error (tokenService.verify):", err);
      throw new AuthenticationError(
        "Could not verify token due to an unexpected error.",
        { cause: err }
      );
    }
  },
};
