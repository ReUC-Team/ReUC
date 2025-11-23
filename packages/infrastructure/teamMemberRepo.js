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
  /**
   * Updates a Project Member Role.
   * @param {object} params
   * @param {string} params.uuidProject - The unique identifier UUID of the project team.
   * @param {string} params.uuidUser - The unique identifier UUID of the team member user to update.
   * @param {number} params.roleId - The new role id of the team role.
   *
   * @throws {InfrastructureError.NotFoundError} If record was not found (P2025).
   * @throws {InfrastructureError.ForeignKeyConstraintError} If exist a constraint error (P2003).
   * @throws {InfrastructureError.DatabaseError} For other unexpected prisma know errors.
   * @throws {InfrastructureError.InfrastructureError} For other unexpected errors.
   *
   * @
   */
  async updateTeamMemberRole({ uuidProject, uuidUser, roleId }) {
    try {
      return await db.team_Member.update({
        where: {
          uuidProject_uuidUser: { uuidProject, uuidUser },
        },
        data: {
          role: { connect: { team_role_id: roleId } },
        },
        select: {
          uuidProject: true,
          uuidUser: true,
          role: {
            select: {
              team_role_id: true,
              name: true,
            },
          },
        },
      });
    } catch (err) {
      if (isPrismaError(err)) {
        if (err.code === "P2003") {
          const field = err.meta.constraint;

          throw new InfrastructureError.ForeignKeyConstraintError(
            `A team member with this ${field} failed to update on this member.`,
            { details: { field, rule: "foreign_key_violation" } }
          );
        }

        if (err.code === "P2025") {
          const message = err.meta?.cause || "Record to update not found.";

          throw new InfrastructureError.NotFoundError(
            `No ${uuidUser} team member found in ${uuidProject} Project to update.`,
            { details: { message } }
          );
        }

        throw new InfrastructureError.DatabaseError(
          `Unexpected database error while updating team member role: ${err.message}`,
          { cause: err }
        );
      }

      const context = JSON.stringify({
        uuidProject,
        uuidUser,
        roleId,
      });
      console.error(
        `Infrastructure error (teamMemberRepo.updateTeamMemberRole) with CONTEXT ${context}:`,
        err
      );
      throw new InfrastructureError.InfrastructureError(
        "Unexpected Infrastructure error while updating team member role.",
        { cause: err }
      );
    }
  },
  /**
   * Removes a member from a project team.
   * @param {object} params
   * @param {string} params.uuidProject - The unique identifier UUID of the project.
   * @param {string} params.uuidUser - The unique identifier UUID of the user to remove.
   *
   * @throws {InfrastructureError.NotFoundError} If the member does not exist (P2025).
   * @throws {InfrastructureError.DatabaseError} For unexpected database errors.
   * @throws {InfrastructureError.InfrastructureError} For other unexpected errors.
   */
  async deleteTeamMember({ uuidProject, uuidUser }) {
    try {
      return await db.team_Member.delete({
        where: {
          uuidProject_uuidUser: {
            uuidProject,
            uuidUser,
          },
        },
        select: {
          uuidProject: true,
          uuidUser: true,
        },
      });
    } catch (err) {
      if (isPrismaError(err)) {
        if (err.code === "P2025") {
          const message = err.meta?.cause || "Record to delete not found.";
          throw new InfrastructureError.NotFoundError(
            `No ${uuidUser} team member found in ${uuidProject} Project to delete.`,
            { details: { message } }
          );
        }

        throw new InfrastructureError.DatabaseError(
          `Unexpected database error while deleting team member: ${err.message}`,
          { cause: err }
        );
      }

      const context = JSON.stringify({ uuidProject, uuidUser });
      console.error(
        `Infrastructure error (teamMemberRepo.deleteTeamMember) with CONTEXT ${context}:`,
        err
      );

      throw new InfrastructureError.InfrastructureError(
        "Unexpected Infrastructure error while deleting team member.",
        { cause: err }
      );
    }
  },
};
