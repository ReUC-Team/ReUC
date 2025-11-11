import {
  validateDate,
  validateString,
  validateUuid,
  validateNumberOrNumberArray,
} from "../shared/validators.js";
import { ValidationError } from "../errors/ValidationError.js";
import { validateFile } from "@reuc/file-storage/shared/validations.js";

/**
 * Validates the entire payload for creating a new application, including the body and any uploaded files.
 * This function acts as a gatekeeper to ensure all data is well-formed before being passed to the domain layer.
 * @param {string} uuidAuthor - The UUID of the author.
 * @param {object} body - The request body payload.
 * @param {string} body.title - The main title of the application.
 * @param {string} body.shortDescription - A brief, one-sentence summary.
 * @param {string} body.description - A detailed description of the application's problem and solution.
 * @param {string} body.deadline - The application deadline in 'YYYY-MM-DD' format.
 * @param {string|string[]} [body.projectType] - A single ID or array of IDs for associated project types.
 * @param {string|string[]} [body.problemType] - A single ID or array of IDs for associated problem types.
 * @param {string|string[]} [body.faculty] - A single ID or array of IDs for associated faculties.
 * @param {string} [body.problemTypeOther] - A user-defined problem type if 'other' is selected.
 * @param {string} [body.selectedBannerUuid] - The UUID of a pre-selected default banner image.
 * @param {object} [customBannerFile] - The uploaded file banner from multer.
 * @param {string} [customBannerFile.mimetype] - The file mimetype.
 * @param {number} [customBannerFile.size] - The file size.
 * @param {Buffer} [customBannerFile.buffer] - The image buffer.
 * @param {Array<object>} [attachments] - The uploaded files attached from multer.
 * @param {string} [attachments[].mimetype] - The file mimetype.
 * @param {number} [attachments[].size] - The file size.
 * @param {Buffer} [attachments[].buffer] - The image buffer.
 *
 * @throws {ValidationError} If the payload is invalid.
 */
export function validateCreationPayload(
  uuidAuthor,
  body,
  customBannerFile,
  attachments
) {
  const allErrors = [];

  allErrors.push(...validateUuid(uuidAuthor, "uuidAuthor"));

  // ---- Body Validation ----
  allErrors.push(...validateString(body.title, "title", "title"));
  allErrors.push(
    ...validateString(body.shortDescription, "shortDescription", "prose")
  );
  allErrors.push(...validateString(body.description, "description", "prose"));
  allErrors.push(...validateDate(body.deadline, "deadline"));

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

  // --- Custom Banner File Validation ---
  if (body.selectedBannerUuid && customBannerFile) {
    // 1. ERROR: Both were provided
    allErrors.push({
      field: "customBannerFile",
      rule: "ambiguous_input",
    });
  } else if (body.selectedBannerUuid) {
    // 2. OK: Only UUID was provided
    allErrors.push(
      ...validateUuid(body.selectedBannerUuid, "selectedBannerUuid")
    );
  } else if (customBannerFile) {
    // 3. OK: Only custom file was provided
    allErrors.push(
      ...validateFile(customBannerFile, "customBannerFile", "images")
    );
  } else {
    // 4. ERROR: Neither was provided
    allErrors.push({
      field: "customBannerFile",
      rule: "missing_required_field",
    });
  }

  // --- Attachments Validation ---
  if (attachments && attachments.length > 0) {
    for (const file of attachments) {
      allErrors.push(...validateFile(file, "attachments", "attachment_files"));
    }
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
 * @param {string} [params.faculty] - The faculty name to filter by.
 * @param {number|string} [params.page] - The page number for pagination.
 * @param {number|string} [params.perPage] - The number of items per page.
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
