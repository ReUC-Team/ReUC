import user from "../user/index.js";
import outsider from "../outsider/index.js";
import * as ApplicationError from "../errors/index.js";

/**
 * The "Strategy Map" for GET operations.
 * It maps a role name to its corresponding getter function.
 */
const roleSpecificGetters = {
  outsider: _getOutsiderProfile,
  student: _getProfileNotImplemented,
  professor: _getProfileNotImplemented,
  // 'admin' is left out because admin accounts do not have profiles.
};

/**
 * Retrieves a combined user profile by aggregating data from the user and outsider entities.
 *
 * @param {object} params
 * @param {string} params.uuidUser - The unique identifier for the user.
 * @param {object} params.role - The role object from req.role.
 * @param {string} params.role.name - The name of the role (e.g., "outsider").
 * @param {string} params.role.uuid - The UUID of the role-specific entity.
 *
 * @throws {ApplicationError.ValidationError} If the data fails validation within the user or outsider modules.
 * @throws {ApplicationError.NotFoundError} If either the user or outsider entity is not found.
 * @throws {ApplicationError.ApplicationError} For other unexpected errors.
 */
export async function getByUuids({ uuidUser, role }) {
  try {
    // 1. Start querying the common user data. Store promise
    const userGetPromise = user.getByUuid({ uuidUser });

    // 2. Find the correct "strategy" (getter) for this role
    const roleGetter = roleSpecificGetters[role.name];

    // 3. Fail-fast check for developer error
    // The role is valid (from requireRole middleware), so a missing strategy is a server bug.
    if (!roleGetter) {
      // The code (strategy map roleSpecificUpdaters) is out of sync with the middleware (roles).
      throw new Error(`FATAL: No 'get' strategy found for role: ${role.name}.`);
    }

    // 4. Start fetching the role-specific data. Store promise
    const roleGetPromise = roleGetter({ uuid: role.uuid });

    // 5. Wait for both promises to resolve concurrently
    const [userResult, roleData] = await Promise.all([
      userGetPromise,
      roleGetPromise,
    ]);

    // 6. Extract the common user data
    const { user: userData } = userResult;

    // 7. Combine common data and role-specific data
    return {
      profile: {
        firstName: userData.firstName,
        middleName: userData.middleName,
        lastName: userData.lastName,
        status: userData.userStatus,
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

    console.error(`Application Error (profile.getByUuids):`, err);
    throw new ApplicationError.ApplicationError(
      "An unexpected error occurred while fetching the profile.",
      { cause: err }
    );
  }
}

/**
 * Fetches the profile data specific to an Outsider.
 * @private
 */
async function _getOutsiderProfile({ uuid }) {
  const { outsider: outsiderData } = await outsider.getByUuid({
    uuidOutsider: uuid,
  });

  return {
    organizationName: outsiderData.organizationName,
    phoneNumber: outsiderData.phoneNumber,
    location: outsiderData.location,
  };
}

/**
 * @todo A placeholder for roles (Student, Professor) that are valid but
 * have no specific profile data to fetch YET.
 * It does nothing and returns an empty object.
 */
async function _getProfileNotImplemented({ uuid }) {
  // This function does nothing on purpose.
  // It fulfills the "strategy" contract.
  return Promise.resolve({});
}

// async function _getStudentProfile({ uuid }) {
//   const { student: studentData } = await student.getByUuid({
//     uuidStudent: uuid,
//   });

//   // Return fields from the Student model
//   return {
//     universityId: studentData.universityId,
//     averageGrade: studentData.averageGrade,
//     enrollmentYear: studentData.enrollmentYear,
//     //... etc.
//   };
// }

// async function _getProfessorProfile({ uuid }) {
//   const { professor: professorData } = await professor.getByUuid({
//     uuidProfessor: uuid,
//   });

//   // Return fields from the Professor model
//   return {
//     universityId: professorData.universityId,
//     //... etc.
//   };
// }
