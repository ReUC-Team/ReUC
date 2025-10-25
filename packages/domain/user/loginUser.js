import { passwordService } from "../libs/auth/passwordService.js";
import { tokenService } from "../libs/auth/tokenService.js";
import * as DomainError from "../errors/index.js";
import { userRepo } from "@reuc/infrastructure/userRepo.js";
import * as InfrastructureError from "@reuc/infrastructure/errors/index.js";

/**
 * Authenticates a user and provides access/refresh tokens.
 *
 * @param {object} params - The login parameters.
 * @param {string} params.email
 * @param {string} params.password
 * @param {string} params.ip
 * @param {string} params.userAgent
 * @param {object} params.tokenConfig - Configuration for generating JWTs.
 * @param {string} params.tokenConfig.accessSecret
 * @param {string} params.tokenConfig.accessExpiresIn
 * @param {string} params.tokenConfig.refreshSecret
 * @param {string} params.tokenConfig.refreshExpiresIn
 *
 * @throws {DomainError.ValidationError} If the input data is invalid.
 * @throws {DomainError.AuthenticationError} If credentias (`email` and `password`) are not valid.
 * @throws {DomainError.DomainError} For other unexpected errors.
 */
export async function loginUser({
  email,
  password,
  ip,
  userAgent,
  tokenConfig,
}) {
  try {
    const user = await userRepo.findByEmail(email.toLowerCase());
    if (!user)
      throw new DomainError.AuthenticationError("Invalid email or password.");

    const isPasswordValid = await passwordService.compare(
      password,
      user.password
    );
    if (!isPasswordValid)
      throw new DomainError.AuthenticationError("Invalid email or password.");

    updateLastLogin(user.uuid_user, ip); // Fire-and-forget operation

    const payload = {
      uuid_user: user.uuid_user,
      role: `${user.role}:${user.uuid_role}`,
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

    const { password: _, ...userToReturn } = user;

    return {
      user: userToReturn,
      accessToken,
      refreshToken,
    };
  } catch (err) {
    if (err instanceof DomainError.DomainError) throw err;

    if (err instanceof InfrastructureError.InfrastructureError)
      throw new DomainError.DomainError(
        "Login could not be completed due to a system error.",
        { cause: err }
      );

    console.error(`Domain error (loginUser):`, err);
    throw new DomainError.DomainError(
      "An unexpected error occurred during login.",
      { cause: err }
    );
  }
}

async function updateLastLogin(uuid_user, newIP) {
  try {
    await userRepo.update(uuid_user, {
      lastLoginAt: new Date(),
      lastLoginIp: newIP,
    });
  } catch (err) {
    console.error(
      `Domain error (updateLastLogin) with UUID ${uuid_user}:`,
      err
    );
  }
}
