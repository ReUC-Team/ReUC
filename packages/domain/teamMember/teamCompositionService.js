import * as DomainError from "../errors/index.js";

/**
 * Validates a team's composition against a project's constraints.
 * This is the central business logic for team creation/mutation.
 *
 * @param {Array<{roleId: number}>} teamMembers - An array of member-like objects (must have roleId).
 * @param {Array<{teamRoleId: number, minCount: number, maxCount: number | null}>} constraints - The constraints from the project type.
 *
 * @throws {DomainError.BusinessRuleError} If any rule is violated.
 */
export function validateTeamComposition(teamMembers, constraints) {
  const errors = [];

  // Create a map of the rules for easy lookup
  // Map<roleId, { minCount: number, maxCount: number | null }>
  const constraintMap = new Map(
    constraints.map((c) => [
      c.teamRoleId,
      { minCount: c.minCount, maxCount: c.maxCount },
    ])
  );

  // Create a map of the incoming members' roles and their counts
  // Map<roleId, number>
  const memberCounts = new Map();
  for (const member of teamMembers) {
    memberCounts.set(member.roleId, (memberCounts.get(member.roleId) || 0) + 1);
  }

  // ---- CHECK 1 & 2 (Max Count & Valid Role) ----
  for (const [roleId, count] of memberCounts.entries()) {
    // Rule 1: Check if the role is allowed on this project type
    if (!constraintMap.has(roleId)) {
      errors.push({
        field: "members",
        rule: "invalid_role",
        roleId,
      });
      continue; // No need to check min/max if the role isn't even valid
    }

    // Rule 2: Check maxCount
    const { maxCount } = constraintMap.get(roleId);
    if (maxCount !== null && count > maxCount) {
      errors.push({
        field: "members",
        rule: "max_count_exceeded",
        roleId,
        received: count,
        max: maxCount,
      });
    }
  }

  // ---- CHECK 3 (Min Count) ----
  for (const [roleId, { minCount }] of constraintMap.entries()) {
    const count = memberCounts.get(roleId) || 0;
    if (minCount > 0 && count < minCount) {
      errors.push({
        field: "members",
        rule: "min_count_not_met",
        roleId,
        received: count,
        min: minCount,
      });
    }
  }

  if (errors.length > 0) {
    throw new DomainError.BusinessRuleError(
      "Team composition violates project rules.",
      { details: errors }
    );
  }
}
