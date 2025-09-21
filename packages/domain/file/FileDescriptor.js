import { MODEL_FILE_RULES } from "@reuc/file-storage/constants/mimetypes.js";

export class FileDescriptor {
  constructor({ name, modelTarget, purpose, isDefault = false }) {
    this.checkRequiredFields({
      name,
      modelTarget,
      purpose,
    });

    this.name = name;
    this.modelTarget = String(modelTarget).toUpperCase();
    this.purpose = String(purpose).toUpperCase();
    this.isDefault = Boolean(isDefault);

    if (!MODEL_FILE_RULES?.[this.modelTarget]?.[this.purpose]) {
      throw new Error(
        `Propósito ${this.purpose} no disponible para el modelo ${this.modelTarget}`
      );
    }
  }

  static allowedFields = ["name", "modelTarget", "purpose", "isDefault"];

  // TODO: Make a base model for all the domain items class
  // this will be inherited by all the features domain has
  // this base model will contain likely all the repetitive
  // method that almost every domain class have
  // e.g. checkRequiredFields, toPrimitives

  checkRequiredFields(fields = {}) {
    for (const [key, value] of Object.entries(fields)) {
      if (
        value === undefined ||
        value === null ||
        value === " " ||
        value === ""
      ) {
        throw new Error(
          `El campo ${key} es obligatorio y no puede estar vacío.`
        );
      }
    }
  }

  toPrimitives() {
    const primitive = {};

    for (const key of FileDescriptor.allowedFields) {
      if (this[key] !== undefined) {
        primitive[key] = this[key];
      }
    }

    return primitive;
  }
}
