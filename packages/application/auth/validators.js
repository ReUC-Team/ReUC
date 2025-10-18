import { ValidationError } from "../errors/ValidationError.js";
import { validateString } from "../shared/validators.js";

/**
 * Validates an email address for proper format.
 *
 * @param {string} email - The email to validate.
 *
 * @returns {Array<object>} - A list with all the errors object.
 * @example [{ field: "firstName", rule: "missing_or_empty" }]
 */
export function validateEmail(email) {
  const errors = [];

  if (typeof email !== "string" || email.trim() === "") {
    errors.push({ field: "email", rule: "missing_or_empty" });

    return errors;
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(email.toLowerCase())) {
    errors.push({ field: "email", rule: "invalid_format" });
  }

  return errors;
}

/**
 * Validates a password against security requirements.
 *
 * @param {string} password - The password to validate.
 *
 * @returns {Array<object>} - A list with all the errors object.
 * @example [{ field: "firstName", rule: "missing_or_empty" }]
 */
export function validatePassword(password) {
  const errors = [];
  if (typeof password !== "string" || password === "") {
    errors.push({ field: "password", rule: "missing_or_empty" });

    return errors;
  }

  if (password.length < 8) {
    errors.push({
      field: "password",
      rule: "min_length",
      expected: 8,
    });
  }
  if (!/[A-Z]/.test(password)) {
    errors.push({
      field: "password",
      rule: "requires_uppercase",
    });
  }
  if (!/[a-z]/.test(password)) {
    errors.push({
      field: "password",
      rule: "requires_lowercase",
    });
  }
  if (!/\d/.test(password)) {
    errors.push({
      field: "password",
      rule: "requires_number",
    });
  }

  return errors;
}

/**
 * Validates the payload for the login use case.
 * Ensures that all required fields are present and correctly formatted.
 * @param {object} payload
 * @param {string} payload.email
 * @param {string} payload.password
 *
 * @throws {ValidationError} If the validation fail.
 */
export function validateLoginPayload({ email, password }) {
  const errors = [];

  if (!email || !password) {
    errors.push({
      field: "form",
      rule: "missing_required_fields",
    });

    throw new ValidationError("Input validation failed", { details: errors });
  }

  errors.push(...validateEmail(email));

  if (errors.length > 0) {
    throw new ValidationError("Input validation failed", { details: errors });
  }
}

/**
 * Validates the payload for the register use case.
 * Ensures that all required fields are present and correctly formatted.
 * @param {object} payload - The registration request payload.
 * @param {string} payload.email
 * @param {string} payload.password
 * @param {string} payload.confirmPassword
 * @param {string} [payload.universityId] - University ID provided by the university, required if the email ends with `@ucol.mx`
 */
export function validateRegisterPayload(payload) {
  const errors = [];

  errors.push(...validateEmail(payload.email));
  errors.push(...validatePassword(payload.password));

  if (payload.password !== payload.confirmPassword)
    errors.push({
      field: "confirmPassword",
      rule: "passwords_do_not_match",
    });

  if (payload.email.endsWith("@ucol.mx")) {
    errors.push(
      ...validateString(payload.universityId, "universityId", "numeric")
    );
  }

  if (errors.length > 0) {
    throw new ValidationError("Input validation failed", { details: errors });
  }
}
