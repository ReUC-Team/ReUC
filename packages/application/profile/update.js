import * as ApplicationError from "../errors/index.js";
import user from "../user/index.js";
import outsider from "../outsider/index.js";

/**
 * The "Strategy Map" for PATCH operations.
 * It maps a role name to its corresponding updater function.
 */
const roleSpecificUpdaters = {
  outsider: _updateOutsiderProfile,
  student: _updateProfileNotImplemented,
  professor: _updateProfileNotImplemented,
  // 'admin' is left out because admin accounts do not have profiles.
};

/**
 * Orchestrates the update of a user's combined profile, delegating the
 * update operations to the respective 'user' and 'outsider' modules.
 * This use case trusts that the underlying modules will perform their
 * own necessary format and business rule validations.
 *
 * @param {object} params
 * @param {string} params.uuidUser - The user's UUID.
 * @param {object} params.role - The role object from req.role.
 * @param {string} params.role.name - The name of the role (e.g., "outsider").
 * @param {string} params.role.uuid - The UUID of the role-specific entity.
 * @param {object} params.body - The data payload containing the updates.
 * @param {object} params.body.firstName
 * @param {object} params.body.middleName
 * @param {object} params.body.lastName
 * @param {string} params.body.phoneNumber
 * @param {string} params.body.location
 * @param {string} params.body.organizationName
 *
 * @throws {ApplicationError.ValidationError} If the data fails validation within the user or outsider modules.
 * @throws {ApplicationError.NotFoundError} If either the user or outsider entity is not found during the update.
 * @throws {ApplicationError.ApplicationError} For other unexpected errors.
 */
export async function update({ uuidUser, role, body }) {
  try {
    // 1. Always update the common user data. Store promise
    const userUpdatePromise = user.update({ uuidUser, body });

    // 2. Find the correct "strategy" (updater) for this role
    const roleUpdater = roleSpecificUpdaters[role.name];

    // 3. Fail-fast check for developer error
    // The role is valid (from requireRole middleware), so a missing strategy is a server bug.
    if (!roleUpdater) {
      // The code (strategy map roleSpecificUpdaters) is out of sync with the middleware (roles).
      throw new Error(
        `FATAL: No 'update' strategy found for role: ${role.name}.`
      );
    }

    // 4. A strategy exist, run it. Store promise
    const roleUpdatePromise = roleUpdater({ uuid: role.uuid, body });

    // 5. Wait for both promises to resolve concurrently
    const [userResult, roleData] = await Promise.all([
      userUpdatePromise,
      roleUpdatePromise,
    ]);

    // 6. Extract the common user data
    const { user: updatedUser } = userResult;

    // 7. Combine common data and role-specific data
    return {
      profile: {
        firstName: updatedUser.firstName,
        middleName: updatedUser.middleName,
        lastName: updatedUser.lastName,
        status: updatedUser.userStatus?.name,
        ...roleData,
      },
    };
  } catch (err) {
    if (err instanceof ApplicationError.NotFoundError)
      throw new ApplicationError.NotFoundError(
        "Profile could not be retrieved. The specified user or role was not found.",
        { details: err.details, cause: err }
      );

    if (err instanceof ApplicationError.ApplicationError) throw err;

    console.error(`Application Error (profile.update):`, err);
    throw new ApplicationError.ApplicationError(
      "An unexpected error occurred while updating the profile.",
      { cause: err }
    );
  }
}

/**
 * Handles the specific logic for updating an Outsider's profile.
 * @private
 */
async function _updateOutsiderProfile({ uuid, body }) {
  const { outsider: updatedOutsider } = await outsider.update({
    uuidOutsider: uuid,
    body,
  });

  return {
    organizationName: updatedOutsider.organizationName,
    phoneNumber: updatedOutsider.phoneNumber,
    location: updatedOutsider.location,
  };
}

/**
 * @todo A placeholder for roles (Student, Professor) that are valid but
 * but have no specific profile data to update YET.
 * It does nothing and returns an empty object.
 */
async function _updateProfileNotImplemented({ uuid, body }) {
  // This function does nothing on purpose.
  // It just fulfills the "strategy" contract.
  return Promise.resolve({});
}

// async function _updateStudentProfile({ uuid, body }) {
//   const { student: updatedStudent } = await student.update({
//     uuidStudent: uuid,
//     body,
//   });

//   // Return fields from the Student model
//   return {
//     universityId: updatedStudent.universityId,
//     averageGrade: updatedStudent.averageGrade,
//     enrollmentYear: updatedStudent.enrollmentYear,
//     //... etc.
//   };
// }

// async function _updateProfessorProfile({ uuid, body }) {
//   const { professor: updatedProfessor } = await professor.update({
//     uuidProfessor: uuid,
//     body,
//   });

//   // Return fields from the Professor model
//   return {
//     universityId: updatedProfessor.universityId,
//     //... etc.
//   };
// }
