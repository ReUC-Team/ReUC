import { BaseEntity } from "../shared/BaseEntity.js";
import * as DomainError from "../errors/index.js";

export class Project extends BaseEntity {
  static allowedFields = [
    "uuid_project",
    "uuidApplication",
    "title",
    "shortDescription",
    "description",
    "estimatedEffortHours",
    "estimatedDate",
    "projectProjectType",
    "projectFaculty",
    "projectProblemType",
    "projectCustomProblemType",
  ];

  constructor(data) {
    super(data, Project.allowedFields);

    const requiredFields = [
      "uuidApplication",
      "title",
      "shortDescription",
      "description",
      "estimatedDate",
    ];

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

    if (missingFields.length > 0)
      throw new DomainError.ValidationError(
        "Required application fields were missing.",
        { details: missingFields }
      );

    this.estimatedDate = new Date(this.estimatedDate);
    if (isNaN(this.estimatedDate.getTime())) {
      throw new DomainError.ValidationError(
        "Estimated date must be a valid date.",
        {
          details: {
            field: "estimatedDate",
            rule: "invalid_format",
            expected: "YYYY-MM-DD",
          },
        }
      );
    }

    if (this.estimatedEffortHours) {
      this.estimatedEffortHours = Number(this.estimatedEffortHours);
      if (isNaN(this.estimatedEffortHours)) {
        throw new DomainError.ValidationError(
          "Estimated effort hours must be a valid numer.",
          {
            details: {
              field: "estimatedEffortHours",
              rule: "invalid_format",
              expected: "number",
            },
          }
        );
      }
    }

    this.projectProjectType = this.parseAndValidateNumberArray(
      this.projectProjectType,
      "Project Type"
    );
    this.projectFaculty = this.parseAndValidateNumberArray(
      this.projectFaculty,
      "Faculty"
    );
    this.projectProblemType = this.parseAndValidateNumberArray(
      this.projectProblemType,
      "Problem Type"
    );
    this.projectCustomProblemType = this.normalizeString(
      this.projectCustomProblemType
    );
  }
}
