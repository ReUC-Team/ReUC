import { BaseEntity } from "../shared/BaseEntity.js";
import * as DomainError from "../errors/index.js";

export class Application extends BaseEntity {
  static allowedFields = [
    "uuid_application",
    "uuidAuthor",
    "title",
    "shortDescription",
    "description",
    "deadline",
    "applicationProjectType",
    "applicationFaculty",
    "applicationProblemType",
    "applicationCustomProblemType",
  ];

  constructor(data) {
    super(data, Application.allowedFields);

    const requiredFields = [
      "uuidAuthor",
      "title",
      "shortDescription",
      "description",
      "deadline",
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

    this.deadline = new Date(this.deadline);
    if (isNaN(this.deadline.getTime())) {
      throw new DomainError.ValidationError("Deadline must be a valid date.", {
        details: {
          field: "deadline",
          rule: "invalid_format",
          expected: "YYYY-MM-DD",
        },
      });
    }

    this.applicationProjectType = this.parseAndValidateNumberArray(
      this.applicationProjectType,
      "Project Type"
    );
    this.applicationFaculty = this.parseAndValidateNumberArray(
      this.applicationFaculty,
      "Faculty"
    );
    this.applicationProblemType = this.parseAndValidateNumberArray(
      this.applicationProblemType,
      "Problem Type"
    );
    this.applicationCustomProblemType = this.normalizeString(
      this.applicationCustomProblemType
    );
  }
}
