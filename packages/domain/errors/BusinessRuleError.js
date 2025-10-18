import DomainError from "./DomainError.js";

/**
 * @class BusinessRuleError
 * @description Thrown when an operation is valid in format but violates a specific business rule.
 * (e.g., attempting to register for a course that is already full).
 */
export default class BusinessRuleError extends DomainError {
  constructor(message, options = {}) {
    super(message, { ...options, errorCode: "BUSINESS_RULE_VIOLATION" });
  }
}
