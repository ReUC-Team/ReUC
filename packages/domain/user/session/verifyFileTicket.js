import { tokenService } from "../../libs/auth/tokenService.js";
import * as DomainError from "../../errors/index.js";

/**
 * Authenticates a file ticket.
 * @param {object} params - The refresh parameters.
 * @param {string} params.token - The refresh token.
 * @param {string} params.fileIdentifier - The private file identifier (e.g. MODEL_TARGET/PURPOSE/UUID_TARGET).
 * @param {"viewing" | "download"} params.audience - Context where the ticket will be used to.
 * @param {object} params.tokenConfig - Configuration for tokens.
 * @param {string} params.tokenConfig.ticketSecret - The secret for the ticket token.
 *
 * @returns {{ sub: string, aud: string, res: string }}
 * @throws {DomainError.AuthenticationError} If the token is missing or the ticket does not match the file identifier.
 */
export function verifyFileTicket({
  token,
  audience,
  fileIdentifier,
  tokenConfig,
}) {
  if (!token) {
    throw new DomainError.AuthenticationError("Token is required.");
  }

  const payload = tokenService.verify({
    token,
    secret: tokenConfig.ticketSecret,
    audience: `file:${audience}`,
  });

  if (payload.res !== fileIdentifier) {
    throw new DomainError.AuthenticationError(
      "Ticket mismatch. Please request a new viewing link."
    );
  }

  return payload;
}
