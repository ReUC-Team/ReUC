import { ValidationError } from "../errors/ValidationError.js";
import { validateString, validateUuid } from "../shared/validators.js";

/**
 * Validates the payload for the user update use case.
 * It iterates through the provided fields and applies the appropriate
 * validation function.
 *
 * @param {string} uuidUser - The user UUID
 * @param {object} payload - The request payload.
 * @param {string} payload.firstName
 * @param {string} payload.middleName
 * @param {string} payload.lastName
 *
 * @throws {ValidationError} If any part of the payload is invalid.
 */
export function validateUpdatePayload(uuidUser, payload) {
  let allErrors = [];
  const nameFields = ["firstName", "middleName", "lastName"];

  allErrors.push(...validateUuid(uuidUser, "uuidUser"));

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
