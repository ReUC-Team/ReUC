import * as DomainError from "../errors/index.js";

/**
 * Validates the cardinality of the project type selection.
 * This is a business rule that enforces a project for APPROVAL.
 *
 * @param {string|number|Array<string|number>} projectType - The raw input.
 *
 * @returns {string|number} The single, extracted identifier.
 * @throws {DomainError.BusinessRuleError} If cardinality rules are violated.
 */
export function validateProjectCreationRules(projectType) {
  if (Array.isArray(projectType)) {
    if (projectType.length === 1) {
      return projectType[0];
    }

    throw new DomainError.BusinessRuleError(
      "A Project must have exactly one Project Type selected.",
      {
        details: {
          rule: "cardinality_violation",
          field: "projectType",
          received: projectType.length,
          allowed: 1,
        },
      }
    );
  }

  if (projectType === undefined || projectType === null) {
    throw new DomainError.BusinessRuleError(
      "A Project Type is required to approve the application.",
      {
        details: {
          rule: "missing_or_empty",
          field: "projectType",
        },
      }
    );
  }

  return projectType;
}
