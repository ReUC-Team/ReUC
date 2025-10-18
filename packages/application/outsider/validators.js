import { ValidationError } from "../errors/ValidationError.js";
import { validateString } from "../shared/validators.js";

/**
 * Validates a phone number string for format constraints.
 *
 * @param {string} phone - The phone number to validate.
 *
 * @returns {Array<object>} - A list with all the errors object.
 * @example [{ field: "firstName", rule: "missing_or_empty" }]
 */
function validatePhone(phone) {
  const errors = [];

  if (typeof phone !== "string") {
    errors.push({
      field: "phoneNumber",
      rule: "invalid_type",
      expected: "string",
    });

    return errors;
  }

  const trimmed = phone.trim();
  const digits = trimmed.replace(/[\s\-\(\).]/g, "");

  if (!/^\+?\d{9,15}$/.test(digits)) {
    errors.push({
      field: "phoneNumber",
      rule: "invalid_format",
      expected: "9-15 digits, optionally prefixed with +",
    });
  }

  return errors;
}

/**
 * Validates the payload for the outsider update use case.
 * It iterates through the provided fields and applies the appropriate
 * validation function.
 *
 * @param {object} body - The request body payload.
 * @param {string} body.phoneNumber
 * @param {string} body.location
 * @param {string} [body.organizationName]
 *
 * @throws {ValidationError} If any part of the payload is invalid.
 */
export function validateUpdatePayload(body) {
  let allErrors = [];

  if (body.phoneNumber !== undefined) {
    allErrors.push(...validatePhone(body.phoneNumber));
  }

  if (body.location !== undefined) {
    allErrors.push(...validateString(body.location, "location", "address"));
  }

  if (body.organizationName !== undefined) {
    allErrors.push(
      ...validateString(body.organizationName, "organizationName", "title")
    );
  }

  if (allErrors.length > 0) {
    throw new ValidationError("Input validation failed.", {
      details: allErrors,
    });
  }
}
