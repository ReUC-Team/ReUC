import { tokenService } from "../../libs/auth/tokenService.js";

/**
 * Verifies a refresh token and generates a new access token.
 *
 * @param {object} params - The refresh parameters.
 * @param {string} params.uuidUser- The UUID of the user.
 * @param {string} params.fileIdentifier - The private file identifier (e.g. MODEL_TARGET/PURPOSE/UUID_TARGET).
 * @param {"viewing" | "download"} params.audience - Context where the ticket will be used to.
 * @param {object} params.tokenConfig - Configuration for tokens.
 * @param {string} params.tokenConfig.ticketSecret - The secret for the ticket token.
 * @param {object} params.tokenConfig.ticketExpiresIn - The expiration for the new ticket token.
 * @param {string} params.tokenConfig.ticketExpiresIn.viewing
 * @param {string} params.tokenConfig.ticketExpiresIn.download
 *
 * @throws {Error} Configuration error for missing audience ticket expiration.
 */
export function generateFileTicket({
  uuidUser,
  audience,
  fileIdentifier,
  tokenConfig,
}) {
  const expiresIn = tokenConfig.ticketExpiresIn?.[audience];

  if (!expiresIn) {
    console.error(`Missing ticket expiration config for audience: ${audience}`);
    throw new Error(
      `Configuration error: No expiration time configured for audience: ${audience}`
    );
  }

  const payload = {
    sub: uuidUser,
    aud: `file:${audience}`,
    res: fileIdentifier,
  };

  return tokenService.generate({
    payload,
    secret: tokenConfig.ticketSecret,
    expiresIn,
  });
}
