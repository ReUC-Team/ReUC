import { BaseEntity } from "../shared/BaseEntity.js";
import * as DomainError from "../errors/index.js";

export class Student extends BaseEntity {
  static allowedFields = [
    "uuid_student",
    "uuidUser",
    "universityId",
    "averageGrade",
    "enrollmentYear",
    "status",
  ];

  constructor(data) {
    super(data, Student.allowedFields);

    if (this.universityId && this.universityId.length !== 8) {
      throw new DomainError.ValidationError(
        "University ID must be exactly 8 characters long.",
        {
          details: {
            field: "universityId",
            rule: "invalid_length",
            received: this.universityId.length,
            allowed: 8,
          },
        }
      );
    }

    if (this.status !== undefined && typeof this.status !== "number") {
      throw new DomainError.ValidationError(
        "Student status must be a number.",
        {
          details: {
            field: "status",
            rule: "invalid_format",
            received: typeof this.status,
            allowed: "number",
          },
        }
      );
    }
  }
}
