/**
 * Checks if an user's profile has all required fields.
 * This is a business rule that defines what constitutes a "complete" profile.
 * @param {object} user - The user data object.
 * @param {string} user.firstName
 * @param {string} user.middleName
 * @param {string} user.lastName
 *
 * @returns {{isComplete: boolean, missing: string[]}} An object indicating if the profile is complete and listing the user-friendly names of any missing fields.
 */
export function isProfileComplete(user) {
  const requiredFields = {
    firstName: "Nombre",
    lastName: "Apellido",
  };

  const missing = [];

  for (const [field, name] of Object.entries(requiredFields)) {
    const value = user?.[field];

    if (value === null || value === undefined || String(value).trim() === "") {
      missing.push(name);
    }
  }

  return {
    isComplete: missing.length === 0,
    missing,
  };
}
