import { validateDate, validateString } from "../shared/validators.js";
import { ValidationError } from "../errors/ValidationError.js";
import { validateFile } from "@reuc/file-storage/shared/validations.js";

/**
 * A helper function to validate a field that can be a single ID (as a string or number)
 * or an array of such IDs. It ensures the value is a valid numeric representation.
 * @private
 * @param {string|number|Array<string|number>} value - The value to validate.
 * @param {string} fieldName - The name of the field for error messages.
 *
 * @returns {Array<object>} - A list with all the errors object.
 * @example [{ field: "firstName", rule: "missing_or_empty" }]
 */
function _validateIdOrIdArray(value, fieldName) {
  const errors = [];

  const validateSingleId = (id) => {
    errors.push(...validateString(String(id), fieldName, "numeric"));
  };

  if (Array.isArray(value)) {
    if (value.length === 0) {
      errors.push({ field: fieldName, rule: "min_length", expected: 1 });
    } else {
      value.forEach(validateSingleId);
    }
  } else if (value !== undefined && value !== null) {
    validateSingleId(value);
  }

  return errors;
}

/**
 * Validates the entire payload for creating a new application, including the body and any uploaded files.
 * This function acts as a gatekeeper to ensure all data is well-formed before being passed to the domain layer.
 * @param {object} body - The request body payload.
 * @param {string} body.title - The main title of the application.
 * @param {string} body.shortDescription - A brief, one-sentence summary.
 * @param {string} body.description - A detailed description of the application's problem and solution.
 * @param {string} body.deadline - The application deadline in 'YYYY-MM-DD' format.
 * @param {string|string[]} [body.projectType] - A single ID or array of IDs for associated project types.
 * @param {string|string[]} [body.problemType] - A single ID or array of IDs for associated problem types.
 * @param {string|string[]} [body.faculty] - A single ID or array of IDs for associated faculties.
 * @param {string} [body.problemTypeOther] - A user-defined problem type if 'other' is selected.
 * @param {string} [body.defaultImage] - The UUID of a pre-selected default banner image.
 * @param {object} [file] - The uploaded file object from multer, required if `body.imageDefault` is not provided.
 * @param {string} [file.mimetype] - The file mimetype.
 * @param {number} [file.size] - The file size.
 * @param {Buffer} [file.buffer] - The image buffer.
 *
 * @throws {ValidationError} If the payload is invalid.
 */
export function validateCreationPayload(body, file) {
  const allErrors = [];

  allErrors.push(...validateString(body.title, "title", "title"));
  allErrors.push(
    ...validateString(body.shortDescription, "shortDescription", "prose")
  );
  allErrors.push(...validateString(body.description, "description", "prose"));
  allErrors.push(...validateDate(body.deadline, "deadline"));

  if (!body.imageDefault && !file) {
    allErrors.push({ field: "file", rule: "missing_required_field" });
  }

  if (!body.imageDefault && file) {
    allErrors.push(...validateFile(file, "images"));
  }

  if (body.projectType !== undefined) {
    allErrors.push(..._validateIdOrIdArray(body.projectType, "projectType"));
  }

  if (body.problemType !== undefined) {
    allErrors.push(..._validateIdOrIdArray(body.problemType, "problemType"));
  }

  if (body.faculty !== undefined) {
    allErrors.push(..._validateIdOrIdArray(body.faculty, "faculty"));
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
 * Validates the query parameters for exploring applications.
 *
 * @param {object} params
 * @param {string} [faculty] - The faculty name to filter by.
 * @param {number|string} [page] - The page number for pagination.
 * @param {number|string} [perPage] - The number of items per page.
 *
 * @throws {ValidationError} If the query parameters are invalid.
 */
export function validateExploreQuery({ faculty, page, perPage }) {
  const allErrors = [];

  if (faculty !== undefined) {
    allErrors.push(...validateString(faculty, "faculty", "name"));
  }

  if (page !== undefined) {
    const pageNum = Number(page);

    if (!Number.isInteger(pageNum) || pageNum < 1) {
      allErrors.push({
        field: "page",
        rule: "invalid_format",
        expected: "positive integer",
      });
    }
  }

  if (perPage !== undefined) {
    const perPageNum = Number(perPage);
    if (!Number.isInteger(perPageNum) || perPageNum < 1) {
      allErrors.push({
        field: "perPage",
        rule: "invalid_format",
        expected: "positive integer",
      });
    }
  }

  if (allErrors.length > 0) {
    throw new ValidationError("Invalid query parameters.", allErrors);
  }
}
