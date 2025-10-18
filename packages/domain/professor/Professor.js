import { BaseEntity } from "../shared/BaseEntity.js";
import * as DomainError from "../errors/index.js";

export class Professor extends BaseEntity {
  static allowedFields = ["uuid_professor", "uuidUser", "universityId", "role"];

  constructor(data) {
    super(data, Professor.allowedFields);

    if (this.universityId && this.universityId.length !== 4)
      throw new DomainError.ValidationError(
        "University ID must be exactly 4 characters long.",
        {
          details: {
            field: "universityId",
            rule: "invalid_length",
            received: this.universityId.length,
            allowed: 4,
          },
        }
      );

    if (this.role !== undefined && typeof this.role !== "number")
      throw new DomainError.ValidationError(
        "Professor role must be a number.",
        {
          details: {
            field: "role",
            rule: "invalid_format",
            received: typeof this.status,
            allowed: "number",
          },
        }
      );
  }
}
