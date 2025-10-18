import { Student } from "./Student.js";
import * as DomainError from "../errors/index.js";
import { studentRepo } from "@reuc/infrastructure/studentRepo.js";
import * as InfrastructureError from "@reuc/infrastructure/errors/index.js";

/**
 * Creates a new student.
 * @param {string} uuidUser - The UUID of the associated user.
 * @param {string} universityId - The student's university ID.
 *
 * @throws {DomainError.ValidationError} If the input data is invalid.
 * @throws {DomainError.ConflictError} If a student with the same user UUID already exists.
 * @throws {DomainError.DomainError} For other unexpected domain or persistence errors.
 */
export async function createStudent(uuidUser, universityId) {
  try {
    const newStudent = new Student({ uuidUser, universityId });

    return await studentRepo.save(newStudent.toPrimitives());
  } catch (err) {
    if (err instanceof InfrastructureError.ConflictError) {
      const field = err.details?.field || "resource";

      throw new DomainError.ConflictError(
        `A student with this ${field} already exists.`,
        { details: err.details, cause: err }
      );
    }

    if (err instanceof DomainError.DomainError) throw err;

    if (err instanceof InfrastructureError.InfrastructureError)
      throw new DomainError.DomainError(
        "The creation of a new student could not be completed due to a system error.",
        { cause: err }
      );

    console.error(`Domain error (createStudent):`, err);
    throw new DomainError.DomainError(
      "An unexpected error occurred while creating the student.",
      { cause: err }
    );
  }
}
