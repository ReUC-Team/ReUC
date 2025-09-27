/**
 * Checks if an outsider's profile has all the required fields.
 * Note: This live here since is business rule know what is a profile
 * completed or incompleted.
 *
 * @param {object} outsider - The outsider data object.
 * @param {string} outsider.location
 * @param {string} outsider.organizationName
 * @param {string} outsider.phoneNumber
 * @returns {{isComplete: boolean, missingFields: string[]}}
 */
export function isProfileComplete(outsider) {
  const requiredFields = {
    location: "Ubicación",
    organizationName: "Nombre de la organización",
    phoneNumber: "Número de teléfono",
  };

  const missingFields = [];

  for (const [field, name] of Object.entries(requiredFields)) {
    if (!outsider[field]) {
      missingFields.push(name);
    }
  }

  return {
    isComplete: missingFields.length === 0,
    missingFields: missingFields,
  };
}
