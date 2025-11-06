/**
 * Checks if an outsider's profile has all required fields.
 * This is a business rule that defines what constitutes a "complete" profile.
 * @param {object} outsider - The outsider data object.
 * @param {string} outsider.location
 * @param {string} outsider.organizationName
 * @param {string} outsider.phoneNumber
 *
 * @returns {{isComplete: boolean, missing: string[]}} An object indicating if the profile is complete and listing the user-friendly names of any missing fields.
 */
export function isProfileComplete(outsider) {
  const requiredFields = {
    organizationName: "Nombre de la organización",
    phoneNumber: "Número de teléfono",
    location: "Ubicación",
  };

  const missing = [];

  for (const [field, name] of Object.entries(requiredFields)) {
    const value = outsider?.[field];

    if (value === null || value === undefined || String(value).trim() === "") {
      missing.push(name);
    }
  }

  return {
    isComplete: missing.length === 0,
    missing,
  };
}
