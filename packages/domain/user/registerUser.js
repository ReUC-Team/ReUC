import { User } from "./User.js";
import { passwordService } from "../libs/auth/passwordService.js";
import { tokenService } from "../libs/auth/tokenService.js";
import { createOutsider } from "../outsider/createOursider.js";
import { createStudent } from "../student/createStudent.js";
import { createProfessor } from "../professor/createProfessor.js";
import * as DomainError from "../errors/index.js";
import { userRepo } from "@reuc/infrastructure/userRepo.js";
import * as InfrastructureError from "@reuc/infrastructure/errors/index.js";

/**
 * Registers a new user and assigns them a role.
 *
 * @param {object} params - The registration parameters.
 * @param {object} params.body - The user data from the request body.
 * @param {string} params.ip
 * @param {string} params.userAgent
 * @param {object} params.tokenConfig - Configuration for generating JWTs.
 * @param {string} params.tokenConfig.accessSecret
 * @param {string} params.tokenConfig.accessExpiresIn
 * @param {string} params.tokenConfig.refreshSecret
 * @param {string} params.tokenConfig.refreshExpiresIn
 *
 * @throws {DomainError.ValidationError} If input data is invalid or is not possible to determine a role via `universityId`.
 * @throws {DomainError.ConflictError} If email is already in use.
 * @throws {DomainError.DomainError} For other unexpected errors.
 */
export async function registerUser({ body, ip, userAgent, tokenConfig }) {
  try {
    const hashed = await passwordService.hash(body.password);

    const newUser = new User({
      ...body,
      password: hashed,
      lastLoginIp: ip,
      lastLoginAt: new Date(),
    });

    const savedUser = await userRepo.save(newUser.toPrimitives());

    let roleCreator;
    let rolePrefix;

    if (!body.universityId) {
      roleCreator = createOutsider;
      rolePrefix = "outsider";
    } else if (body.universityId.length === 8) {
      roleCreator = (uuid) => createStudent(uuid, body.universityId);
      rolePrefix = "student";
    } else if (body.universityId.length === 4) {
      roleCreator = (uuid) => createProfessor(uuid, body.universityId);
      rolePrefix = "professor";
    } else {
      throw new DomainError.ValidationError(
        "A valid university ID is required to determine the user role.",
        { details: { field: "universityId", rule: "invalid_format" } }
      );
    }

    const role = await roleCreator(savedUser.uuid_user);
    const uuidRole = `${rolePrefix}:${role[`uuid_${rolePrefix}`]}`;

    const payload = {
      uuid_user: savedUser.uuid_user,
      role: uuidRole,
      ip,
      ua: userAgent,
    };

    const accessToken = tokenService.generate({
      payload,
      secret: tokenConfig.accessSecret,
      expiresIn: tokenConfig.accessExpiresIn,
    });

    const refreshToken = tokenService.generate({
      payload,
      secret: tokenConfig.refreshSecret,
      expiresIn: tokenConfig.refreshExpiresIn,
    });

    const { password: _, ...safeUser } = savedUser;

    const userToReturn = {
      role: rolePrefix,
      uuid_role: role.uuid_outsider || role.uuid_student || role.uuid_professor,
      ...safeUser,
    };

    return { user: userToReturn, accessToken, refreshToken };
  } catch (err) {
    if (err instanceof InfrastructureError.ConflictError) {
      const field = err.details?.field || "resource";

      throw new DomainError.ConflictError(
        `An user with this ${field} already exits.`,
        { details: err.details, cause: err }
      );
    }

    if (err instanceof DomainError.DomainError) throw err;

    if (err instanceof InfrastructureError.InfrastructureError)
      throw new DomainError.DomainError(
        "Registration could not be completed due to a system error.",
        { cause: err }
      );

    console.error(`Domain error (registerUser):`, err);
    throw new DomainError.DomainError(
      "An unexpected error occurred during registration.",
      { cause: err }
    );
  }
}
