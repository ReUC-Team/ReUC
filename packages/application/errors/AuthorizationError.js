import { ApplicationError } from "./ApplicationError.js";

/**
 * @class AuthorizationError
 * @description Thrown when an authenticated user attempts to access a resource
 * or perform an action they are not permitted to.
 */
export class AuthorizationError extends ApplicationError {
  constructor(message = "Access denied.", options = {}) {
    super(message, { ...options, errorCode: "AUTHORIZATION_FAILURE" });
  }
}
