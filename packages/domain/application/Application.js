import { BaseEntity } from "../shared/BaseEntity.js";
import * as DomainError from "../errors/index.js";

export class Application extends BaseEntity {
  static allowedFields = [
    "uuid_application",
    "uuidOutsider",
    "title",
    "shortDescription",
    "description",
    "deadline",
    "visibility",
    "applicationProjectType",
    "applicationFaculty",
    "applicationProblemType",
    "applicationCustomProblemType",
  ];

  constructor(data) {
    super(data, Application.allowedFields);

    const requiredFields = [
      "uuidOutsider",
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

    this.applicationProjectType = this._parseAndValidateNumberArray(
      this.applicationProjectType,
      "Project Type"
    );
    this.applicationFaculty = this._parseAndValidateNumberArray(
      this.applicationFaculty,
      "Faculty"
    );
    this.applicationProblemType = this._parseAndValidateNumberArray(
      this.applicationProblemType,
      "Problem Type"
    );
    this.applicationCustomProblemType = this._normalizeString(
      this.applicationCustomProblemType
    );
  }

  _parseAndValidateNumberArray(input = [], fieldName = "Unknown") {
    const normalized = Array.isArray(input)
      ? input
      : [input].filter((i) => i !== null && i !== undefined);

    return normalized.map((val) => {
      const num = Number(val);

      if (isNaN(num)) {
        throw new DomainError.ValidationError(
          `Field '${fieldName}' contains an invalid non-numeric value.`,
          {
            details: {
              field: fieldName,
              rule: "invalid_characters",
            },
          }
        );
      }

      return num;
    });
  }

  _normalizeString(value) {
    if (value === undefined || value === null || String(value).trim() === "") {
      return undefined;
    }

    return String(value).trim().toLowerCase();
  }
}
