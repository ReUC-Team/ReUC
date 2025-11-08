import { ValidationError } from "../errors/ValidationError.js";
import { validateUuid, validateString } from "../shared/validators.js";

/**
 * Validates the payload for the getFile use case.
 * Ensures all required parameters are present and correctly formatted.
 *
 * @param {object} payload
 * @param {string} payload.modelTarget - The name of the target model (e.g., "APPLICATION").
 * @param {string} payload.uuidTarget - The UUID of the target entity.
 * @param {string} payload.purpose - The purpose of the file link (e.g., "BANNER").
 * @param {string} [payload.uuidFile] - The UUID of the specific file (required for "many" cardinality).
 *
 * @throws {ValidationError} If the payload is invalid.
 */
export function validateGetFileQuery({
  modelTarget,
  uuidTarget,
  purpose,
  uuidFile,
}) {
  let allErrors = [];

  const requiredFields = { modelTarget, uuidTarget, purpose };
  for (const [field, value] of Object.entries(requiredFields)) {
    if (!value) {
      allErrors.push({
        field,
        rule: "missing_required_field",
      });
    }
  }

  if (allErrors.length > 0) {
    throw new ValidationError("Missing required query parameters.", {
      details: allErrors,
    });
  }

  allErrors.push(...validateString(modelTarget, "modelTarget", "name"));
  allErrors.push(...validateUuid(uuidTarget, "uuidTarget"));
  allErrors.push(...validateString(purpose, "purpose", "name"));

  if (uuidFile !== undefined) {
    allErrors.push(...validateUuid(uuidFile, "uuidFile"));
  }

  if (allErrors.length > 0) {
    throw new ValidationError("Input validation failed.", {
      details: allErrors,
    });
  }
}
