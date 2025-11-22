import { BaseEntity } from "../shared/BaseEntity.js";
import * as DomainError from "../errors/index.js";

export class Project extends BaseEntity {
  static allowedFields = ["uuid_project", "uuidApplication", "statusId"];

  constructor(data) {
    super(data, Project.allowedFields);

    if (!this.uuidApplication || typeof this.uuidApplication !== "string") {
      throw new DomainError.BusinessRuleError(
        "A Project must be linked to an Application.",
        { details: { field: "uuidApplication", rule: "missing" } }
      );
    }

    if (this.statusId !== undefined && this.statusId !== null) {
      const status = Number(this.statusId);
      if (isNaN(status)) {
        throw new DomainError.ValidationError(
          "Project Status ID must be a valid number.",
          {
            details: {
              field: "statusId",
              rule: "invalid_type",
              expected: "number",
            },
          }
        );
      }
      this.statusId = status;
    }
  }
}