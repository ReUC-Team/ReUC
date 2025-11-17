import {
  validateDate,
  validateString,
  validateUuid,
  validateNumberOrNumberArray,
  validatePaginationQuery,
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
function validateSignedNumber(value, fieldName) {
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
 * Validates the entire payload for creating a new application.
 * This function acts as a gatekeeper to ensure all data is well-formed before being passed to the domain layer.
 * @param {string} uuidApplication - The UUID of the application to approve.
 * @param {object} body - The request body payload.
 * @param {string} body.title - The main title of the project.
 * @param {string} body.shortDescription - A brief, one-sentence summary.
 * @param {string} body.description - A detailed description of the project's problem and solution.
 * @param {string|number} [body.estimatedEffortHours] - The project estimated hours to be complete.
 * @param {string|Date} body.estimatedDate - The project estimated date in 'YYYY-MM-DD' format.
 * @param {string|number} body.projectTypeId - A single ID for associated project type.
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
  allErrors.push(...validateSignedNumber(body.projectTypeId, "projectTypeId"));

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

/**
 * Validates a standard query parameters for get projects.
 *
 * @param {object} params
 * @param {string} params.uuidRequestingUser - The unique identifier for the user.
 * @param {number|string} [params.page] - The page number for pagination.
 * @param {number|string} [params.perPage] - The number of items per page.
 *
 * @throws {ValidationError} If the query parameters are invalid.
 */
export function validateGetProjectsQuery({
  uuidRequestingUser,
  page,
  perPage,
}) {
  const allErrors = [];

  allErrors.push(...validateUuid(uuidRequestingUser, "uuidRequestingUser"));
  allErrors.push(...validatePaginationQuery({ page, perPage }));

  if (allErrors.length > 0) {
    throw new ValidationError("Invalid query parameters.", allErrors);
  }
}

/**
 * Validates the entire payload for creating a new team for a project.
 * @param {string} uuidProject - The UUID of the project.
 * @param {object} body - The request body payload.
 * @param {Array<{ uuidUser: string, roleId: number }>} body.members - Array of members to add.
 *
 * @throws {ValidationError} If the payload is invalid.
 */
export function validateTeamCreationPayload(uuidProject, body) {
  const allErrors = [];

  allErrors.push(...validateUuid(uuidProject, "uuidProject"));

  // ---- Body Validation ----
  if (!body.members || !Array.isArray(body.members)) {
    allErrors.push({
      field: "members",
      rule: "missing_or_invalid",
    });
  } else if (body.members.length === 0) {
    allErrors.push({
      field: "members",
      rule: "min_length",
      expected: 1,
    });
  } else {
    body.members.forEach((member, i) => {
      allErrors.push(
        ...validateUuid(member.uuidUser, `members[${i}].uuidUser`)
      );

      allErrors.push(
        ...validateSignedNumber(member.roleId, `members[${i}].roleId`)
      );
    });
  }

  if (allErrors.length > 0) {
    throw new ValidationError("Input validation failed.", {
      details: allErrors,
    });
  }
}
