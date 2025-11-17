import { BaseEntity } from "../shared/BaseEntity.js";
import * as DomainError from "../errors/index.js";

export class TeamMember extends BaseEntity {
  static allowedFields = [
    "uuid_team_member",
    "uuidProject",
    "uuidUser",
    "roleId",
  ];

  constructor(data) {
    super(data, TeamMember.allowedFields);

    const requiredFields = ["uuidProject", "uuidUser"];

    const missingFields = [];
    for (const field of requiredFields) {
      const value = this[field];
      if (typeof value !== "string" || value.trim() === "") {
        missingFields.push({
          field,
          rule: "missing_or_empty",
        });
      }
    }

    if (this.roleId === undefined) {
      missingFields.push({
        field: "roleId",
        rule: "missing_or_empty",
      });
    }

    if (missingFields.length > 0)
      throw new DomainError.ValidationError(
        "Required team member fields were missing or invalid.",
        { details: missingFields }
      );

    this.roleId = Number(this.roleId);
    if (isNaN(this.roleId)) {
      throw new DomainError.ValidationError(
        `Field roleId contains an invalid non-numeric value.`,
        {
          details: {
            field: "roleId",
            rule: "invalid_number",
          },
        }
      );
    }
  }
}
