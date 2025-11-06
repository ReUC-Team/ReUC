import user from "../user/index.js";
import outsider from "../outsider/index.js";
// This will hold the getByUuid getters, since this is yet to implement
// this will be ommited
// import student from "../student/index.js";
// import professor from "../professor/index.js";
import * as ApplicationError from "../errors/index.js";
import { isProfileComplete as isUserProfileComplete } from "@reuc/domain/user/isProfileComplete.js";
import { isProfileComplete as isOutsiderProfileComplete } from "@reuc/domain/outsider/isProfileComplete.js";
import { isProfileComplete as isStudentProfileComplete } from "@reuc/domain/student/isProfileComplete.js";
import { isProfileComplete as isProfessorProfileComplete } from "@reuc/domain/professor/isProfileComplete.js";

/**
 * The "Strategy Map" for checking profile status.
 *
 * It maps a role name to its corresponding getter
 * function and check profile business rule.
 */
const roleStatusCheckers = {
  outsider: _checkOutsiderStatus,
  student: _checkStudentStatus,
  professor: _checkProfessorStatus,
  // 'admin' is left out because admin accounts do not have profiles.
};

/**
 * Checks if an outsider's profile is complete based on domain business rules.
 *
 * @param {object} params
 * @param {string} params.uuidUser - The unique identifier for the user.
 * @param {object} params.role - The role object from req.role.
 * @param {string} params.role.name - The name of the role (e.g., "outsider").
 * @param {string} params.role.uuid - The UUID of the role-specific entity.
 *
 * @throws {ApplicationError.ValidationError} If the UUID is invalid.
 * @throws {ApplicationError.NotFoundError} If the outsider is not found.
 * @throws {ApplicationError.ApplicationError} For other unexpected errors.
 */
export async function checkStatus({ uuidUser, role }) {
  try {
    // 1. Find the correct role-specific strategy
    const roleChecker = roleStatusCheckers[role.name];

    // 2. Fail-fast check for developer error
    // The role is valid (from requireRole middleware), so a missing strategy is a server bug.
    if (!roleChecker) {
      // The code (strategy map roleStatusCheckers) is out of sync with the middleware (roles).
      throw new Error(
        `FATAL: No 'checkStatus' strategy found for role: ${role.name}.`
      );
    }

    // 3. Start both fetches concurrently. Store promise
    const userGetPromise = user.getByUuid({ uuidUser });
    const roleStatusPromise = roleChecker({ uuid: role.uuid });

    // 4. Wait for both to complete
    const [userResult, roleStatus] = await Promise.all([
      userGetPromise,
      roleStatusPromise,
    ]);

    // 5. Run the completeness check on the common User data
    const { user: userData } = userResult;
    const userStatus = isUserProfileComplete(userData);

    // 6. Combine the results
    const combinedMissing = [...userStatus.missing, ...roleStatus.missing];
    const combinedStatus = {
      isComplete: userStatus.isComplete && roleStatus.isComplete,
      missing: combinedMissing,
    };

    return { status: combinedStatus };
  } catch (err) {
    if (err instanceof ApplicationError.ApplicationError) throw err;

    console.error(`Application Error (profile.checkStatus):`, err);
    throw new ApplicationError.ApplicationError(
      "An unexpected error occurred while checking the profile status.",
      { cause: err }
    );
  }
}

/**
 * Fetches Outsider data and checks its completeness.
 * @private
 */
async function _checkOutsiderStatus({ uuid }) {
  const { outsider: outsiderData } = await outsider.getByUuid({
    uuidOutsider: uuid,
  });

  return isOutsiderProfileComplete(outsiderData);
}

/**
 * @todo We just call the placeholder domain rule.
 *
 * Fetches Student data and checks its completeness.
 * @private
 */
async function _checkStudentStatus({ uuid }) {
  // const { student: studentData } = await student.getByUuid({ uuidStudent: uuid });

  // return isStudentProfileComplete(studentData);

  // Since the "getter" doesn't exist, we just call the
  // placeholder function directly which returns { isComplete: true }.
  return isStudentProfileComplete(null);
}

/**
 * @todo We just call the placeholder domain rule.
 *
 * Fetches Professor data and checks its completeness.
 * @private
 */
async function _checkProfessorStatus({ uuid }) {
  // const { professor: profData } = await professor.getByUuid({ uuidProfessor: uuid });

  // return isProfessorProfileComplete(profData);

  // Since the "getter" doesn't exist, we just call the
  // placeholder function directly which returns { isComplete: true }.
  return isProfessorProfileComplete(null);
}
