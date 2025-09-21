/**
 * Validate that a date string is in the future and in YYYY-MM-DD format.
 * @param {string} dateString – Date to validate.
 * @returns {string|null} – Null if valid, otherwise error message.
 */
export function validateDate(dateString) {
  if (typeof dateString !== "string") {
    return "La fecha debe ser una cadena de texto.";
  }

  // Check basic format: YYYY-MM-DD
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return "Formato de fecha inválido. Usa el formato AAAA-MM-DD.";
  }

  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return "Fecha inválida.";
  }

  const now = new Date();
  if (now >= date) {
    return "La fecha debe ser posterior a la fecha actual.";
  }

  return null;
}

/**
 * Validate a university ID: 8 digits (student) or 4 digits (teacher).
 * @param {string} universityId – ID to validate.
 * @returns {string|null} – Null if valid, otherwise error message.
 */
export function validateUniversityId(universityId) {
  if (universityId.length !== 8 && universityId.length !== 4)
    return "El número de cuenta debe tener 8 dígitos (alumno) o 4 (maestro).";
  if (!/^\d+$/.test(universityId))
    return "El número de cuenta solo debe contener números.";

  return null;
}

/**
 * Validate that a string is a proper UUID v4.
 * @param {string} uuid – UUID string.
 * @returns {string|null} – Null if valid, otherwise error message.
 */
export function validateUuid(uuid) {
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      uuid
    )
  ) {
    return "El UUID no tiene un formato válido.";
  }

  return null;
}
