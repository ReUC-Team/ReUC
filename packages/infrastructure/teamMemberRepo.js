import { db, isPrismaError } from "./db/client.js";
import * as InfrastructureError from "./errors/index.js";

export const teamMemberRepo = {
  /**
   * Adds a single member to a project.
   * @param {string} uuidProject - The UUID of the project.
   * @param {string} uuidUser - The UUID of the user.
   * @param {number} roleId - The ID of the team role.
   *
   * @throws {InfrastructureError.UniqueConstraintError} If an existing constraint error (P2002).
   * @throws {InfrastructureError.ForeignKeyConstraintError} If an existing constraint error (P2003).
   * @throws {InfrastructureError.DatabaseError} For other unexpected prisma known errors.
   * @throws {InfrastructureError.InfrastructureError} For other unexpected errors.
   */
  async addMember(uuidProject, uuidUser, roleId) {
    try {
      return await db.team_Member.create({
        data: {
          uuidProject,
          uuidUser,
          roleId,
        },
      });
    } catch (err) {
      if (isPrismaError(err)) {
        if (err.code === "P2002") {
          const field = err.meta.target[0];

          throw new InfrastructureError.UniqueConstraintError(
            `A member with this ${field} is already on this project.`,
            { details: { field, rule: "unique_constraint" } }
          );
        }

        if (err.code === "P2003") {
          const field = err.meta.constraint;

          throw new InfrastructureError.ForeignKeyConstraintError(
            `A member with this ${field} failed to add on this project.`,
            { details: { field, rule: "foreign_key_violation" } }
          );
        }

        throw new InfrastructureError.DatabaseError(
          `Unexpected Database error while adding member to project: ${err.message}`,
          { cause: err }
        );
      }

      const context = JSON.stringify({ uuidProject, uuidUser, roleId });
      console.error(
        `Infrastructure error (teamMemberRepo.addMember) with CONTEXT ${context}:`,
        err
      );
      throw new InfrastructureError.InfrastructureError(
        "Unexpected Infrastructure error while adding member to project.",
        { cause: err }
      );
    }
  },
  /**
   * Creates a team by adding multiple members to a project in a batch.
   * @param {Array<{ uuidProject: string, uuidUser: string, roleId: number }>} teamMembers - Array of members to add.
   *
   * @throws {InfrastructureError.ForeignKeyConstraintError} If an existing constraint error (P2003).
   * @throws {InfrastructureError.DatabaseError} For other unexpected prisma known errors.
   * @throws {InfrastructureError.InfrastructureError} For other unexpected errors.
   */
  async createTeam(teamMembers) {
    try {
      // `skipDuplicates: true` will silently ignore P2002 (unique constraint) errors.
      return await db.team_Member.createMany({
        data: teamMembers,
        skipDuplicates: true,
      });
    } catch (err) {
      if (isPrismaError(err)) {
        if (err.code === "P2003") {
          const field = err.meta.constraint;

          throw new InfrastructureError.ForeignKeyConstraintError(
            `A member with this ${field} failed to add on this project.`,
            { details: { field, rule: "foreign_key_violation" } }
          );
        }

        throw new InfrastructureError.DatabaseError(
          `Unexpected Database error while creating team: ${err.message}`,
          { cause: err }
        );
      }

      const context = JSON.stringify({ uuidProject, members });
      console.error(
        `Infrastructure error (teamMemberRepo.createTeam) with CONTEXT ${context}:`,
        err
      );
      throw new InfrastructureError.InfrastructureError(
        "Unexpected Infrastructure error while creatin team.",
        { cause: err }
      );
    }
  },
};
