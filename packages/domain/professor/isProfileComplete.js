/**
 * @todo This is a placeholder. Since professors cannot edit their
 * specific profile data yet, we'll consider it "complete" by default.
 *
 * Checks if a professor's profile has all required fields.
 * This is a business rule that defines what constitutes a "complete" profile.
 * @param {object} professor - The professor data object.
 *
 * @returns {{isComplete: boolean, missing: string[]}} An object indicating if the profile is complete.
 */
export function isProfileComplete(professor) {
  // TODO: Implement this when Professor Profile /edit is enabled (AKA domain/professor/updateProfessor.js).
  // Example for the future:

  /*
  const requiredFields = {
    universityId: "ID de Universidad",
  };

  const missing = [];

  for (const [field, name] of Object.entries(requiredFields)) {
    const value = student?.[field];
    
    if (value === null || value === undefined || String(value).trim() === "") {
      missing.push(name);
    }
  }

  return {
    isComplete: missing.length === 0,
    missing,
  };
  */

  // For now:
  return {
    isComplete: true,
    missing: [],
  };
}
