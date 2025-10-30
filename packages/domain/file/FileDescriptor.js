import { BaseEntity } from "../shared/BaseEntity.js";
import * as DomainError from "../errors/index.js";
import { getFileRule } from "@reuc/file-storage/shared/ruleUtils.js";

export class FileDescriptor extends BaseEntity {
  static allowedFields = [
    "defaultBannerUuid",
    "name",
    "modelTarget",
    "purpose",
    "isDefault",
  ];

  constructor(data) {
    super(data, FileDescriptor.allowedFields);

    const missingFields = [];
    for (const field of ["modelTarget", "purpose"]) {
      if (typeof this[field] !== "string" || this[field].trim() === "") {
        missingFields.push({
          field,
          rule: "missing_or_empty",
        });
      }
    }

    if (!this.name && !this.defaultBannerUuid) {
      missingFields.push({
        field: "defaultBannerUuid",
        rule: "missing_or_empty",
      });
    }

    if (missingFields.length > 0)
      throw new DomainError.ValidationError(
        "Required file descriptor fields were missing.",
        { details: missingFields }
      );

    this.modelTarget = String(this.modelTarget).toUpperCase();
    this.purpose = String(this.purpose).toUpperCase();
    this.isDefault = Boolean(this.isDefault);

    if (!getFileRule(this.modelTarget, this.purpose)) {
      throw new DomainError.BusinessRuleError(
        `File purpose '${this.purpose}' is not available for the model '${this.modelTarget}'.`,
        {
          details: {
            rule: "invalid_model_purpose_combination",
            modelTarget: this.modelTarget,
            purpose: this.purpose,
          },
        }
      );
    }
  }
}
