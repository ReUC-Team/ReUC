import * as DomainError from "../errors/index.js";
import { getFileRule } from "@reuc/file-storage/shared/ruleUtils.js";
import { fileRepo } from "@reuc/infrastructure/fileRepo.js";
import * as InfrastructureError from "@reuc/infrastructure/errors/index.js";

/**
 * Retrieves a file linked to a specific entity and purpose.
 * @param {string} modelTarget - The name of the target model (e.g., "APPLICATION").
 * @param {string} uuidTarget - The UUID of the target entity.
 * @param {string} purpose - The purpose of the file link (e.g., "BANNER").
 * @param {string} [uuidFile] - The UUID of the specific file (required for "many" cardinality).
 *
 * @throws {DomainError.BusinessRuleError} If a invalid business rule.
 * @throws {DomainError.NotFoundError} If no file link is found.
 * @throws {DomainError.DomainError} For any unexpected errors.
 */
export async function getFileByTarget(
  modelTarget,
  uuidTarget,
  purpose,
  uuidFile = undefined
) {
  try {
    const rule = _ensureFileRuleExists(modelTarget, purpose);

    const file = await fileRepo.getFileByTarget(
      modelTarget,
      uuidTarget,
      purpose,
      uuidFile
    );

    if (!file) {
      throw new DomainError.NotFoundError(
        `A file for the specified target could not be found.`,
        { details: { resource: "file", modelTarget, purpose, uuidTarget } }
      );
    }

    return { rule, data: file };
  } catch (err) {
    if (err instanceof DomainError.DomainError) throw err;

    if (err instanceof InfrastructureError.InfrastructureError)
      throw new DomainError.DomainError(
        "The fetch of the file could not be completed due to a system error.",
        { cause: err }
      );

    console.error(`Domain error (getFileByTarget):`, err);
    throw new DomainError.DomainError(
      "An unexpected error occurred while fetching the file link.",
      { cause: err }
    );
  }
}

/**
 * Checks if the file rule exists on file-storage module and throws a NotFoundError if not.
 * This should never happen if the authFileTicketMiddleware ran, but as a safeguard
 * @private
 */
function _ensureFileRuleExists(model, purpose) {
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

  return rule;
}
