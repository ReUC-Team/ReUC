import bcrypt from "bcrypt";
import { DomainError } from "../../errors/index.js";

const SALT_ROUNDS = 15;

/**
 * A service object for handling password hashing and comparison.
 */
export const passwordService = {
  /**
   * Hashes a plain-text password.
   * @param {string} plainPassword - The password to hash.
   *
   * @returns {Promise<string>} A promise that resolves to the hashed password.
   * @throws {DomainError} If an unexpected error occurs during the hashing process.
   */
  async hash(plainPassword) {
    try {
      if (!plainPassword) throw new Error("Password cannot be empty.");

      return await bcrypt.hash(plainPassword, SALT_ROUNDS);
    } catch (err) {
      console.error("Error (passwordService.hash):", err);
      throw new DomainError("Could not process password.", { cause: err });
    }
  },

  /**
   * Compares a plain-text password against a hash.
   * @param {string} plainPassword - The plain-text password to check.
   * @param {string} hashedPassword - The hash to compare against.
   *
   * @returns {Promise<boolean>} A promise that resolves to true if the passwords match, false otherwise.
   * @throws {DomainError} If an unexpected error occurs during the comparison.
   */
  async compare(plainPassword, hashedPassword) {
    try {
      if (!plainPassword || !hashedPassword) return false;

      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (err) {
      console.error("Error (passwordService.compare):", err);
      throw new DomainError("Could not process password comparison.", {
        cause: err,
      });
    }
  },
};
