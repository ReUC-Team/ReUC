import { ApplicationError } from "./ApplicationError.js";

/**
 * @class AuthenticationError
 * @description Thrown when a user's credentials are invalid, a token is expired/mismatched,
 * or any other authentication-specific failure occurs. This is the application-layer
 * equivalent of the Domain's AuthenticationError.
 */
export class AuthenticationError extends ApplicationError {
  constructor(message = "Authentication failed.", options = {}) {
    super(message, { ...options, errorCode: "AUTHENTICATION_FAILURE" });
  }
}
