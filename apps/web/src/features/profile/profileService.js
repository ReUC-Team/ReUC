import { fetchWithAuthAndAutoRefresh } from "../../lib/api/client";

const API_URL = import.meta.env.VITE_API_URL;

export async function getCSRFToken() {
  const res = await fetch(`${API_URL}/csrf-token`, {
    credentials: "include",
  });

  const { csrfToken } = await res.json();

  return csrfToken;
}

/**
 * Verifica si el perfil del usuario está completo
 * @returns {Promise<{isComplete: boolean}>}
 * @throws {AuthenticationError|ApplicationError}
 */
export async function getProfileStatus() {
  const response = await fetchWithAuthAndAutoRefresh(
    `${API_URL}/profile/status`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

  // fetchWithAuthAndAutoRefresh ya parsea y lanza errores
  return response.data;
}

/**
 * Obtiene los datos del perfil del usuario autenticado
 * @returns {Promise<{profile: object}>}
 * @throws {AuthenticationError|NotFoundError|ApplicationError}
 */
export async function getProfile() {
  const response = await fetchWithAuthAndAutoRefresh(
    `${API_URL}/profile/get`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

  return response.data;
}

/**
 * Actualiza el perfil del usuario
 * @param {object} data - Datos del perfil a actualizar
 * @returns {Promise<{profile: object}>}
 * @throws {ValidationError|AuthenticationError|ApplicationError}
 */
export async function updateProfile(data) {
  const csrfToken = await getCSRFToken();

  const response = await fetchWithAuthAndAutoRefresh(
    `${API_URL}/profile/edit`,
    {
      method: "PATCH",
      headers: {
        "X-CSRF-Token": csrfToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  return response.data;
}
