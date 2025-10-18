/**
 * Validates that a string is a proper UUID v4.
 *
 * @param {string} uuid - The UUID string to validate.
 * @param {string} fieldName - The name of the field being validated (e.g., "firstName").
 *
 * @returns {Array<object>} - A list with all the errors object.
 * @example [{ field: "firstName", rule: "missing_or_empty" }]
 */
export function validateUuid(uuid, fieldName) {
  const errors = [];

  if (typeof uuid !== "string") {
    errors.push({
      field: fieldName,
      rule: "invalid_type",
      expected: "string",
    });

    return errors;
  }

  const RFC4122_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (!RFC4122_REGEX.test(uuid)) {
    errors.push({
      field: fieldName,
      rule: "invalid_format",
    });
  }

  return errors;
}

/**
 * Validates that a date string is in YYYY-MM-DD format and is in the future.
 *
 * @param {string} dateString – Date to validate.
 * @param {string} fieldName - The name of the field being validated (e.g., "firstName").
 *
 * @returns {Array<object>} - A list with all the errors object.
 * @example [{ field: "firstName", rule: "missing_or_empty" }]
 */
export function validateDate(dateString, fieldName) {
  const errors = [];

  if (typeof dateString !== "string") {
    errors.push({
      field: fieldName,
      rule: "invalid_type",
      expected: "string",
    });

    return errors;
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    errors.push({
      field: fieldName,
      rule: "invalid_format",
      expected: "YYYY-MM-DD",
    });

    return errors;
  }

  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Compare against the start of today

  if (isNaN(date.getTime())) {
    errors.push({
      field: fieldName,
      rule: "invalid_date",
    });
  } else if (date <= today) {
    errors.push({
      field: fieldName,
      rule: "date_must_be_future",
    });
  }

  return errors;
}

/**
 * Validates a string against a predefined whitelist of characters based on a security level.
 * This is the primary function for sanitizing most text-based inputs.
 *
 * Levels:
 * - 'name': For personal names. Allows letters, spaces, apostrophes, and hyphens.
 * - 'numeric': For string-based numbers like a University ID. Allows only digits.
 * - 'title': For organization names or project titles. Allows letters, numbers, and common punctuation.
 * - 'address': For locations/addresses. A slightly more permissive version of 'title'.
 * - 'prose': For long-form text like descriptions. Allows a wide range of punctuation, while blocking injection characters.
 *
 * @param {string} value - The string value to validate.
 * @param {string} fieldName - The name of the field being validated (e.g., "firstName").
 * @param {'name' | 'numeric' | 'title' | 'address' | 'prose'} level - The validation level to apply.
 *
 * @returns {Array<object>} - A list with all the errors object.
 * @example [{ field: "firstName", rule: "missing_or_empty" }]
 */
export function validateString(value, fieldName, level = "title") {
  const errors = [];

  if (typeof value !== "string" || value.trim() === "") {
    errors.push({
      field: fieldName,
      rule: "missing_or_empty",
    });

    return errors;
  }

  const whitelists = {
    name: /^[A-Za-z\u00C0-\u017F\s'-]+$/,
    numeric: /^[0-9]+$/,
    title: /^[A-Za-z0-9\u00C0-\u017F\s.,&'()-]+$/,
    address: /^[A-Za-z0-9\u00C0-\u017F\s.,&'#\/-]+$/,
    prose: /^[A-Za-z0-9\u00C0-\u017F\s.,&'()!?;:"-]+$/,
  };

  const selectedRegex = whitelists[level];

  if (!selectedRegex) {
    // This is a developer error, not a user error.
    throw new Error(`Invalid validation level provided: ${level}`);
  }

  if (!selectedRegex.test(value)) {
    errors.push({
      field: fieldName,
      rule: "invalid_characters",
      level,
    });
  }

  return errors;
}
