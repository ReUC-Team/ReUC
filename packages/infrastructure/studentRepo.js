import { db, isPrismaError } from "./db/client.js";
import * as InfrastructureError from "./errors/index.js";

export const studentRepo = {
  /**
   * Creates a new student role.
   * @param {object} student The core data and related IDs
   *
   * @throws {InfrastructureError.UniqueConstraintError} If exist a constraint error (P2002).
   * @throws {InfrastructureError.DatabaseError} For unexpected prisma know errors.
   * @throws {InfrastructureError.InfrastructureError} For unexpected errors.
   */
  async save(student) {
    try {
      return await db.student.create({
        data: student,
        select: {
          uuid_student: true,
          uuidUser: true,
          universityId: true,
          studentStatus: { select: { student_status_id: true, name: true } },
        },
      });
    } catch (err) {
      if (isPrismaError(err)) {
        if (err.code === "P2002") {
          const field = err.meta.target[0];

          throw new InfrastructureError.UniqueConstraintError(
            `A student with this ${field} already owns the role.`,
            { details: { field, rule: "unique_constraint" } }
          );
        }

        throw new InfrastructureError.DatabaseError(
          `Unexpected Database error while creating student: ${err.message}`,
          { cause: err }
        );
      }

      console.error(
        `Infrastructure error (studentRepo.save) with DATA ${student}:`,
        err
      );
      throw new InfrastructureError.InfrastructureError(
        "Unexpected Infrastructure error while creating student",
        { cause: err }
      );
    }
  },
  /**
   * Finds an student by their unique student UUID.
   * @param {string} uuid - The student's UUID.
   *
   * @throws {InfrastructureError.DatabaseError} For other unexpected prisma know errors.
   * @throws {InfrastructureError.InfrastructureError} For other unexpected errors.
   */
  async findByUuid(uuid) {
    try {
      return await db.student.findUnique({
        where: { uuid_student: uuid },
        select: {
          uuid_student: true,
          uuidUser: true,
          universityId: true,
          studentStatus: { select: { student_status_id: true, name: true } },
        },
      });
    } catch (err) {
      if (isPrismaError(err))
        throw new InfrastructureError.DatabaseError(
          `Unexpected database error while querying student: ${err.message}`,
          { cause: err }
        );

      console.error(
        `Infrastructure error (studentRepo.findByUuid) with UUID ${uuid}:`,
        err
      );
      throw new InfrastructureError.InfrastructureError(
        "Unexpected Infrastructure error while querying student",
        { cause: err }
      );
    }
  },
};
