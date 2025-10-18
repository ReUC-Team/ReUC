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
}
