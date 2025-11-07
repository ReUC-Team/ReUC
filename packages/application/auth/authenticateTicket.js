import * as ApplicationError from "../errors/index.js";
import { verifyFileTicket } from "@reuc/domain/user/session/verifyFileTicket.js";
import * as DomainError from "@reuc/domain/errors/index.js";

/**
 * Verifies a ticket to authenticate a viewing link.
 *
 * @param {object} params - The refresh parameters.
 * @param {string} params.token - The refresh token.
 * @param {string} params.fileIdentifier - The private file identifier (e.g. MODEL_TARGET/PURPOSE/UUID_TARGET).
 * @param {"viewing" | "download"} params.audience - Context where the ticket will be used to.
 * @param {object} params.tokenConfig - Configuration for tokens.
 * @param {string} params.tokenConfig.ticketSecret - The secret for the ticket token.
 *
 * @throws {ApplicationError.AuthenticationError} If the token is invalid or mismatched.
 * @throws {ApplicationError.ApplicationError} - For other unexpected errors.
 */
export function authenticateTicket({
  token,
  fileIdentifier,
  audience,
  tokenConfig,
}) {
  try {
    const decodedPayload = verifyFileTicket({
      token,
      fileIdentifier,
      audience,
      tokenConfig,
    });

    return decodedPayload;
  } catch (err) {
    if (err instanceof DomainError.AuthenticationError)
      throw new ApplicationError.AuthenticationError(
        "Authentication failed. Please request a new viewing link.",
        { cause: err }
      );

    console.error(`Application Error (auth.authenticateTicket):`, err);
    throw new ApplicationError.ApplicationError(
      "An unexpected error occurred during ticket authentication.",
      { cause: err }
    );
  }
}
