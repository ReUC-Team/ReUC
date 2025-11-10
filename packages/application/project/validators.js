import {
  validateDate,
  validateString,
  validateUuid,
  validateNumberOrNumberArray,
} from "../shared/validators.js";
import { ValidationError } from "../errors/ValidationError.js";

/**
 * Validate a field that can be a single number (as a string or number type).
 * It ensures the value is a valid signed numeric representation.
 *
 * @param {string|number} value - The value to validate.
 * @param {string} fieldName - The name of the field for error messages.
 *
 * @returns {Array<object>} - A list with all the errors object.
 * @example [{ field: "firstName", rule: "missing_or_empty" }]
 */
export function validateSignedNumber(value, fieldName) {
  const errors = [];
  const signedNumberRegex = /^-?[0-9]+$/;

  if (value === undefined) {
    errors.push({ field: fieldName, rule: "missing_or_empty" });
    return errors;
  }

  if (typeof value === "number") {
    if (!Number.isInteger(value)) {
      errors.push({
        field: fieldName,
        rule: "invalid_format",
        expected: "signed_integer",
      });
    }

    return errors;
  }

  if (typeof value === "string") {
    if (!signedNumberRegex.test(value.trim())) {
      errors.push({
        field: fieldName,
        rule: "invalid_format",
        expected: "signed_integer",
      });
    }

    return errors;
  }

  errors.push({
    field: fieldName,
    rule: "invalid_type",
    expected: "string_or_number",
  });

  return errors;
}

/**
 * Validates the entire payload for creating a new application, including the body and any uploaded files.
 * This function acts as a gatekeeper to ensure all data is well-formed before being passed to the domain layer.
 * @param {string} uuidApplication - The UUID of the application to approve.
 * @param {object} body - The request body payload.
 * @param {string} body.title - The main title of the project.
 * @param {string} body.shortDescription - A brief, one-sentence summary.
 * @param {string} body.description - A detailed description of the project's problem and solution.
 * @param {string|number} [body.estimatedEffortHours] - The project estimated hours to be complete.
 * @param {string|Date} body.estimatedDate - The project estimated date in 'YYYY-MM-DD' format.
 * @param {string|number|Array<string|number>} [body.projectType] - A single ID or array of IDs for associated project types.
 * @param {string|number|Array<string|number>} [body.problemType] - A single ID or array of IDs for associated problem types.
 * @param {string|number|Array<string|number>} [body.faculty] - A single ID or array of IDs for associated faculties.
 * @param {string} [body.problemTypeOther] - A user-defined problem type if 'other' is selected.
 *
 * @throws {ValidationError} If the payload is invalid.
 */
export function validateCreationPayload(uuidApplication, body) {
  const allErrors = [];

  allErrors.push(...validateUuid(uuidApplication, "uuidApplication"));

  // ---- Body Validation ----
  allErrors.push(...validateString(body.title, "title", "title"));
  allErrors.push(
    ...validateString(body.shortDescription, "shortDescription", "prose")
  );
  allErrors.push(...validateString(body.description, "description", "prose"));

  if (body.estimatedEffortHours !== undefined) {
    allErrors.push(
      ...validateSignedNumber(body.estimatedEffortHours, "estimatedEffortHours")
    );
  }

  allErrors.push(...validateDate(body.estimatedDate, "estimatedDate"));

  if (body.projectType !== undefined) {
    allErrors.push(
      ...validateNumberOrNumberArray(body.projectType, "projectType")
    );
  }

  if (body.problemType !== undefined) {
    allErrors.push(
      ...validateNumberOrNumberArray(body.problemType, "problemType")
    );
  }

  if (body.faculty !== undefined) {
    allErrors.push(...validateNumberOrNumberArray(body.faculty, "faculty"));
  }

  if (body.problemTypeOther !== undefined) {
    allErrors.push(
      ...validateString(body.problemTypeOther, "problemTypeOther", "prose")
    );
  }

  if (allErrors.length > 0) {
    throw new ValidationError("Input validation failed.", {
      details: allErrors,
    });
  }
}
