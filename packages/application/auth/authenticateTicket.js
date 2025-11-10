import * as ApplicationError from "../errors/index.js";
import { verifyFileTicket } from "@reuc/domain/user/session/verifyFileTicket.js";
import * as DomainError from "@reuc/domain/errors/index.js";

/**
 * Verifies a ticket to authenticate a file access link.
 *
 * @param {object} params
 * @param {string} params.model - The name of the target model (e.g., "APPLICATION").
 * @param {string} params.uuidmodel - The UUID of the target entity.
 * @param {string} params.purpose - The purpose of the file link (e.g., "BANNER").
 * @param {string} [params.uuidfile] - The UUID of the specific file (required for "many" cardinality).
 * @param {string} params.ticket - Short-lived token to be authenticate.
 * @param {object} params.tokenConfig - Configuration for tokens.
 * @param {string} params.tokenConfig.ticketSecret - The secret for the ticket token.
 *
 * @throws {ApplicationError.AuthenticationError} If the token is invalid or mismatched.
 * @throws {ApplicationError.ApplicationError} - For other unexpected errors.
 */
export function authenticateTicket({
  model,
  purpose,
  uuidmodel,
  uuidfile,
  ticket,
  tokenConfig,
}) {
  try {
    const decodedPayload = verifyFileTicket({
      model,
      purpose,
      uuidmodel,
      uuidfile,
      ticket,
      tokenConfig,
    });

    return { payload: decodedPayload };
  } catch (err) {
    if (err instanceof DomainError.AuthenticationError)
      throw new ApplicationError.AuthenticationError(
        "Authentication failed. Please request a new link.",
        { cause: err }
      );

    if (err instanceof DomainError.BusinessRuleError)
      throw new ApplicationError.ValidationError(
        "The request violates business rules.",
        { details: err.details, cause: err }
      );

    if (err instanceof DomainError.ValidationError)
      throw new ApplicationError.ValidationError(
        "The request data is invalid.",
        { details: err.details, cause: err }
      );

    console.error(`Application Error (auth.authenticateTicket):`, err);
    throw new ApplicationError.ApplicationError(
      "An unexpected error occurred during ticket authentication.",
      { cause: err }
    );
  }
}
