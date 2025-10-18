import DomainError from "./DomainError.js";

/**
 * @class AuthenticationError
 * @description Thrown when user credentials are invalid or an authentication attempt fails.
 */
export default class AuthenticationError extends DomainError {
  constructor(message = "Invalid credentials.", options = {}) {
    super(message, { ...options, errorCode: "AUTHENTICATION_FAILED" });
  }
}
