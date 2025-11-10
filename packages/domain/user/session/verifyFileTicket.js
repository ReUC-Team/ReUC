import { tokenService } from "../../libs/auth/tokenService.js";
import * as DomainError from "../../errors/index.js";
import { getFileRule } from "@reuc/file-storage/shared/ruleUtils.js";

/**
 * Authenticates a file ticket.
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
 * @returns {{ sub: string, aud: string, res: string }} The decoded user payload (e.g., { sub: "..." })
 * @throws {DomainError.AuthenticationError} If the ticket is invalid or have a mismatch data.
 * @throws {DomainError.BusinessRuleError} If the rule is not found.
 * @throws {DomainError.ValidationError} If data is missing (e.g., uuidfile).
 */
export function verifyFileTicket({
  model,
  purpose,
  uuidmodel,
  uuidfile,
  ticket,
  tokenConfig,
}) {
  // 1. Check if ticket exist
  if (!ticket) {
    throw new DomainError.AuthenticationError("Token is required.");
  }

  // 2. Get the business rule
  const rule = getFileRule(model, purpose);
  if (!rule || !rule.context) {
    throw new DomainError.BusinessRuleError(
      `File purpose '${purpose}' is not available for the model '${model}'.`,
      {
        details: {
          rule: "invalid_model_purpose_combination",
          modelTarget: model,
          purpose,
        },
      }
    );
  }

  // 3. Build the correct fileIdentifier
  let fileIdentifier;
  if (rule.cardinality === "many") {
    if (!uuidfile) {
      throw new DomainError.ValidationError(
        `Missing required file UUID for model '${model}' and purpose '${purpose}'.`,
        {
          details: {
            field: "uuidfile",
            rule: "missing_or_empty",
            modelTarget: model,
            purpose,
            cardinality: rule.cardinality,
          },
        }
      );
    }

    fileIdentifier = `file/${model}/${purpose}/${uuidmodel}/${uuidfile}`;
  } else {
    fileIdentifier = `file/${model}/${purpose}/${uuidmodel}`;
  }

  // 4. Verify the ticket with the token service
  const expectedAudience = `file:${rule.context}`;
  const decodedPayload = tokenService.verify({
    token: String(ticket),
    secret: tokenConfig.ticketSecret,
    audience: expectedAudience,
  });

  // 5. Check if ticket is valid for this file
  if (decodedPayload.res !== fileIdentifier) {
    throw new DomainError.AuthenticationError(
      "Ticket mismatch. Please request a new link."
    );
  }

  return decodedPayload;
}
