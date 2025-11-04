import { BaseEntity } from "../shared/BaseEntity.js";

export class Outsider extends BaseEntity {
  static allowedFields = [
    "uuid_outsider",
    "uuidUser",
    "organizationName",
    "phoneNumber",
    "location",
  ];

  constructor(data) {
    super(data, Outsider.allowedFields);
  }
}
