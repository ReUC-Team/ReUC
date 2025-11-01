import { fetchWithAuth } from "@/lib/api/client";

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Obtiene CSRF token para operaciones POST/PUT/DELETE
 * 
 * @returns {Promise<string>} CSRF token
 */
export async function getCSRFToken() {
  const res = await fetch(`${API_URL}/csrf-token`, {
    credentials: "include",
  });

  const { csrfToken } = await res.json();

  return csrfToken;
}

/**
 * Servicio de registro
 * Ahora LANZA excepciones estructuradas en lugar de retornar { success, err }
 * 
 * @param {object} data - Datos del formulario de registro
 * @returns {Promise<object>} Datos del usuario registrado
 * @throws {ValidationError|ConflictError|ApplicationError} Errores estructurados
 */
export async function register(data) {
  const csrfToken = await getCSRFToken();

  // fetchWithAuth lanza excepciones automáticamente
  const response = await fetchWithAuth(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "X-CSRF-Token": csrfToken,
    },
    body: JSON.stringify(data),
  });

  // Si llegamos aquí, la petición fue exitosa
  const { accessToken, user } = response.data;
  
  // Guardar token
  sessionStorage.setItem("accessToken", accessToken);

  return { user, accessToken };
}

/**
 * Servicio de login
 * Ahora LANZA excepciones estructuradas en lugar de retornar { success, err }
 * 
 * @param {object} credentials - { email, password }
 * @returns {Promise<object>} Datos del usuario autenticado
 * @throws {AuthenticationError|ValidationError|ApplicationError} Errores estructurados
 */
export async function login(credentials) {
  const csrfToken = await getCSRFToken();

  // fetchWithAuth lanza excepciones automáticamente
  const response = await fetchWithAuth(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "X-CSRF-Token": csrfToken,
    },
    body: JSON.stringify(credentials),
  });

  // Si llegamos aquí, la petición fue exitosa
  const { accessToken, user } = response.data;
  
  // Guardar token
  sessionStorage.setItem("accessToken", accessToken);

  return { user, accessToken };
}

/**
 * Servicio de logout
 * Ahora LANZA excepciones en lugar de retornar { success, err }
 * 
 * @returns {Promise<object>} Mensaje de confirmación
 * @throws {ApplicationError} Si falla el logout
 */
export async function logout() {
  // fetchWithAuth lanza excepciones automáticamente
  const response = await fetchWithAuth(`${API_URL}/auth/logout`, {
    method: "DELETE",
  });

  // Limpiar token local
  sessionStorage.removeItem("accessToken");

  return response;
}