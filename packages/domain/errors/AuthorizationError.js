import DomainError from "./DomainError.js";

/**
 * @class AuthorizationError
 * @description Thrown when an authenticated user attempts to access a resource
 * or perform an action they are not permitted to.
 */
export default class AuthorizationError extends DomainError {
  constructor(message = "Invalid credentials.", options = {}) {
    super(message, { ...options, errorCode: "AUTHORIZATION_FAILED" });
  }
}
