import ValidationError from "../errors/ValidationError.js";

/**
 * @class BaseEntity
 * @description A base class for domain entities to handle common boilerplate.
 * It provides a standardized way to initialize properties and serialize the entity.
 */
export class BaseEntity {
  /**
   * Initializes the entity by assigning only the allowed fields from the data object.
   * @param {object} data - The raw data object.
   * @param {string[]} allowedFields - An array of field names that are allowed on the entity.
   */
  constructor(data, allowedFields) {
    for (const key of allowedFields) {
      if (data[key] !== undefined) {
        this[key] = data[key];
      }
    }
  }

  /**
   * Serializes the entity into a primitive object, containing only the allowed fields.
   * @returns {object} A plain JavaScript object representing the entity's state.
   */
  toPrimitives() {
    const primitive = {};

    // Get allowedFields from the static property of the child class constructor
    const allowedFields = this.constructor.allowedFields || [];

    for (const key of allowedFields) {
      if (this[key] !== undefined) {
        primitive[key] = this[key];
      }
    }

    return primitive;
  }

  /**
   * Normalize an input into an array of numbers and validate each entry.
   *
   * - If `input` is already an array, it is used as-is.
   * - If `input` is a single value, it is wrapped into an array.
   * - `null` and `undefined` values are filtered out.
   * - Each remaining value is converted using `Number()`
   *
   * @param {(Array<number|string>|number|string|undefined)} [input] - The value(s) to normalize/validate.
   * @param {string} [fieldName] - The name of the field used in validation errors.
   *
   * @returns {number[]} An array of numeric values.
   * @throws {ValidationError} If any value cannot be converted to a valid number.
   */
  parseAndValidateNumberArray(input = [], fieldName = "Unknown") {
    const normalized = Array.isArray(input)
      ? input
      : [input].filter((i) => i !== null && i !== undefined);

    return normalized.map((val) => {
      const num = Number(val);

      if (isNaN(num)) {
        throw new ValidationError(
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

  /**
   * Normalize a string by trimming whitespace and converting to lowercase.
   * @param {string|undefined|null} value - The value to normalize to a string.
   *
   * @returns {string|undefined} The normalized lowercase string, or `undefined` if empty/nonexistent.
   */
  normalizeString(value) {
    if (value === undefined || value === null || String(value).trim() === "") {
      return undefined;
    }

    return String(value).trim().toLowerCase();
  }
}
