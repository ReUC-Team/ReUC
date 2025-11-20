import { db, isPrismaError } from "./db/client.js";
import * as InfrastructureError from "./errors/index.js";

export const userRepo = {
  /**
   * Creates a new user.
   * @param {object} user The core data.
   *
   * @throws {InfrastructureError.UniqueConstraintError} If exist a constraint error (P2002).
   * @throws {InfrastructureError.DatabaseError} For other unexpected prisma know errors.
   * @throws {InfrastructureError.InfrastructureError} For other unexpected errors.
   */
  async save(user) {
    try {
      return await db.user.create({
        data: user,
        select: {
          uuid_user: true,
          email: true,
          userStatus: { select: { user_status_id: true, name: true } },
        },
      });
    } catch (err) {
      if (isPrismaError(err)) {
        if (err.code === "P2002") {
          const field = err.meta.target[0];

          throw new InfrastructureError.UniqueConstraintError(
            `A user with this ${field} already exists.`,
            { details: { field, rule: "unique_constraint" } }
          );
        }

        throw new InfrastructureError.DatabaseError(
          `Unexpected database error while creating user: ${err.message}`,
          { cause: err }
        );
      }

      console.error(
        `Infrastructure error (userRepo.save) with DATA ${user}:`,
        err
      );
      throw new InfrastructureError.InfrastructureError(
        "Unexpected Infrastructure error while creating user",
        { cause: err }
      );
    }
  },
  /**
   * Updates a user's data.
   * @param {string} uuid - The UUID of the user to update.
   * @param {object} updates - The fields to update.
   *
   * @throws {InfrastructureError.NotFoundError} If record was not found (P2025).
   * @throws {InfrastructureError.DatabaseError} For other unexpected prisma know errors.
   * @throws {InfrastructureError.InfrastructureError} For other unexpected errors.
   */
  async update(uuid, updates) {
    try {
      return await db.user.update({
        where: { uuid_user: uuid },
        data: updates,
        select: {
          uuid_user: true,
          email: true,
          firstName: true,
          middleName: true,
          lastName: true,
          userStatus: { select: { user_status_id: true, name: true } },
          lastLoginIp: true,
        },
      });
    } catch (err) {
      if (isPrismaError(err)) {
        if (err.code === "P2025") {
          const message = err.meta.cause;

          throw new InfrastructureError.NotFoundError(
            `No ${uuid} user found to update.`,
            { details: { message } }
          );
        }

        throw new InfrastructureError.DatabaseError(
          `Unexpected database error while updating user: ${err.message}`,
          { cause: err }
        );
      }

      console.error(
        `Infrastructure error (userRepo.update) with UUID ${uuid}:`,
        err
      );
      throw new InfrastructureError.InfrastructureError(
        "Unexpected Infrastructure error while updating user.",
        { cause: err }
      );
    }
  },
  /**
   * Finds a user by their email and formats the result to include their role.
   * @param {string} email - The user's email address.
   *
   * @throws {InfrastructureError.DatabaseError} For unexpected prisma know errors.
   * @throws {InfrastructureError.InfrastructureError} For unexpected errors.
   */
  async findByEmail(email) {
    try {
      const user = await db.user.findUnique({
        where: { email: email },
        select: {
          uuid_user: true,
          email: true,
          userStatus: { select: { user_status_id: true, name: true } },
          password: true, // Used by Login, Normally this side never return this field.
          admin: { select: { uuid_admin: true } },
          student: { select: { uuid_student: true } },
          professor: { select: { uuid_professor: true } },
          outsider: { select: { uuid_outsider: true } },
        },
      });

      return _formatUserWithRole(user);
    } catch (err) {
      if (isPrismaError(err))
        throw new InfrastructureError.DatabaseError(
          `Unexpected database error while querying user: ${err.message}`,
          { cause: err }
        );

      console.error(
        `Infrastructure error (userRepo.findByEmail) with EMAIL ${email}:`,
        err
      );
      throw new InfrastructureError.InfrastructureError(
        "Unexpected Infrastructure error while querying user",
        { cause: err }
      );
    }
  },
  /**
   * Finds a user by their UUID.
   * @param {string} uuid - The user's UUID.
   *
   * @throws {InfrastructureError.DatabaseError} For unexpected prisma know errors.
   * @throws {InfrastructureError.InfrastructureError} For unexpected errors.
   */
  async findByUuid(uuid) {
    try {
      return await db.user.findUnique({
        where: { uuid_user: uuid },
        select: {
          uuid_user: true,
          email: true,
          userStatus: { select: { user_status_id: true, name: true } },
          firstName: true,
          middleName: true,
          lastName: true,
          lastLoginIp: true,
          lastLoginAt: true,
        },
      });
    } catch (err) {
      if (isPrismaError(err))
        throw new InfrastructureError.DatabaseError(
          `Unexpected database error while querying user: ${err.message}`,
          { cause: err }
        );

      console.error(
        `Infrastructure error (userRepo.findByUuid) with UUID ${uuid}:`,
        err
      );
      throw new InfrastructureError.InfrastructureError(
        "Unexpected Infrastructure error while querying user",
        { cause: err }
      );
    }
  },
  /**
   * Searches for users by a keyword.
   * - The query is case-insensitive and searches against firstName,
   * lastName, middleName, and email.
   * - This search ONLY returns users who are Students or Professors.
   * @param {string} query - The search term.
   * @param {object} [options]
   * @param {number} [options.limit] - For a query limited for a fast autocomplete response
   *
   * @throws {InfrastructureError.DatabaseError} For unexpected prisma know errors.
   * @throws {InfrastructureError.InfrastructureError} For unexpected errors.
   */
  async search(query, { limit = 20 }) {
    try {
      return await db.user.findMany({
        where: {
          AND: [
            // 1. The text search condition
            {
              OR: [
                { firstName: { contains: query, mode: "insensitive" } },
                { lastName: { contains: query, mode: "insensitive" } },
                { middleName: { contains: query, mode: "insensitive" } },
                { email: { contains: query, mode: "insensitive" } },
              ],
            },
            // 2. The role eligibility condition
            {
              OR: [
                { student: { isNot: null } },
                { professor: { isNot: null } },
              ],
            },
            // 3. Explicitly exclude non-eligible roles
            { admin: { is: null } },
            { outsider: { is: null } },
          ],
        },
        select: {
          uuid_user: true,
          email: true,
          firstName: true,
          middleName: true,
          lastName: true,
          student: { select: { universityId: true } },
          professor: { select: { universityId: true } },
        },
        take: limit,
      });
    } catch (err) {
      if (isPrismaError(err)) {
        throw new InfrastructureError.DatabaseError(
          `Unexpected database error while searching users: ${err.message}`,
          { cause: err }
        );
      }

      console.error(
        `Infrastructure error (userRepo.search) with QUERY ${query}:`,
        err
      );
      throw new InfrastructureError.InfrastructureError(
        "Unexpected Infrastructure error while searching users.",
        { cause: err }
      );
    }
  },
};

/**
 * A helper function to process a user object from Prisma,
 * determine its role, and shape it for the application layer.
 * @param {object} userFromDb - The user object returned from a Prisma query.
 * @param {string} userFromDb.uuid_user - The UUID of the user.
 * @param {string} userFromDb.email - The user's email address.
 * @param {object | null} userFromDb.userStatus - User status object.
 * @param {object | null} userFromDb.admin - Admin data related with the user if it has the role.
 * @param {object | null} userFromDb.student - Student data related with the user if it has the role.
 * @param {object | null} userFromDb.professor - Professor data related with the user if it has the role.
 * @param {object | null} userFromDb.outsider - Outsider data related with the user if it has the role.
 */
function _formatUserWithRole(userFromDb) {
  if (!userFromDb) {
    return null;
  }

  let roleInfo = null;
  if (userFromDb.admin) {
    roleInfo = { role: "admin", uuid_role: userFromDb.admin.uuid_admin };
  } else if (userFromDb.student) {
    roleInfo = { role: "student", uuid_role: userFromDb.student.uuid_student };
  } else if (userFromDb.professor) {
    roleInfo = {
      role: "professor",
      uuid_role: userFromDb.professor.uuid_professor,
    };
  } else if (userFromDb.outsider) {
    roleInfo = {
      role: "outsider",
      uuid_role: userFromDb.outsider.uuid_outsider,
    };
  }

  const { admin, student, professor, outsider, ...user } = userFromDb;

  return {
    ...user,
    role: roleInfo?.role ?? null,
    uuid_role: roleInfo?.uuid_role ?? null,
  };
}
