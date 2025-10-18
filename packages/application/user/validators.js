import { ValidationError } from "../errors/ValidationError.js";
import { validateString } from "../shared/validators.js";

/**
 * Validates the payload for the user update use case.
 * It iterates through the provided fields and applies the appropriate
 * validation function.
 *
 * @param {object} payload - The request payload.
 * @param {object} payload.firstName
 * @param {object} payload.middleName
 * @param {object} payload.lastName
 *
 * @throws {ValidationError} If any part of the payload is invalid.
 */
export function validateUpdatePayload(payload) {
  let allErrors = [];
  const nameFields = ["firstName", "middleName", "lastName"];

  for (const field of nameFields) {
    if (payload[field] !== undefined) {
      allErrors.push(...validateString(payload[field], field, "name"));
    }
  }

  if (allErrors.length > 0) {
    throw new ValidationError("Input validation failed.", {
      details: allErrors,
    });
  }
}
