import { BaseEntity } from "../shared/BaseEntity.js";
import * as DomainError from "../errors/index.js";

export class User extends BaseEntity {
  static allowedFields = [
    "uuid_user",
    "email",
    "password",
    "firstName",
    "middleName",
    "lastName",
    "status",
    "lastLoginIp",
    "lastLoginAt",
  ];

  constructor(data) {
    super(data, User.allowedFields);

    if (this.email) this.email = this.email.toLowerCase();

    if (this.status !== undefined && typeof this.status !== "number") {
      throw new DomainError.ValidationError("User status must be a number.", {
        details: {
          field: "status",
          rule: "invalid_format",
          received: typeof this.status,
          allowed: "number",
        },
      });
    }
  }
}
