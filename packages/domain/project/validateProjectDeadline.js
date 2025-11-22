import * as DomainError from "../errors/index.js";

/**
 * Validates that the application deadline falls within the estimated months
 * required by the selected Project Type.
 *
 * @param {Date|string} deadlineInput - The proposed deadline.
 * @param {object} constraints
 * @param {number|null} constraints.minMonths
 * @param {number|null} constraints.maxMonths
 * @param {number} [marginDays=7] - Flexibility margin in days.
 *
 * @throws {DomainError.ValidationError} If the deadline input is not a valid date.
 * @throws {DomainError.BusinessRuleError} If the duration is out of bounds.
 */
export function validateProjectDeadline(
  deadlineInput,
  { minMonths, maxMonths },
  marginDays = 30
) {
  // If there are no constraints, pass immediately
  if (!minMonths && !maxMonths) return;

  const deadline = new Date(deadlineInput);
  const now = new Date();

  if (isNaN(deadline.getTime())) {
    throw new DomainError.ValidationError("Deadline must be a valid date.", {
      details: {
        field: "deadline",
        rule: "invalid_format",
        expected: "YYYY-MM-DD",
      },
    });
  }

  // Calculate difference in milliseconds
  const diffTime = deadline.getTime() - now.getTime();

  // Convert to "Months" (Approx 30 days per month)
  // Milliseconds -> Seconds -> Hours -> Days
  const daysDiff = diffTime / (1000 * 3600 * 24);
  const monthsDiff = daysDiff / 30;

  // Calculate Margin in Months
  const marginInMonths = marginDays / 30;

  // 1. Validate Minimum
  // Logic: The duration (plus a small margin) must be at least the minimum.
  if (minMonths !== null) {
    if (monthsDiff + marginInMonths < minMonths) {
      throw new DomainError.BusinessRuleError(
        `The deadline is too short for this Project Type.`,
        {
          details: {
            rule: "min_duration_violation",
            min: minMonths,
            received: deadline.toISOString().split("T")[0],
          },
        }
      );
    }
  }

  // 2. Validate Maximum
  // Logic: The duration (minus a small margin) must be less than or equal to the maximum.
  if (maxMonths !== null) {
    if (monthsDiff - marginInMonths > maxMonths) {
      throw new DomainError.BusinessRuleError(
        `The deadline exceeds the maximum allowed time for this Project Type.`,
        {
          details: {
            rule: "max_duration_violation",
            max: maxMonths,
            received: deadline.toISOString().split("T")[0],
          },
        }
      );
    }
  }
}
