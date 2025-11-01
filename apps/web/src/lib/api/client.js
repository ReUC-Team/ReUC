import { 
  createErrorFromResponse, 
  AuthenticationError 
} from '@/utils/errorHandler';

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Wrapper principal para fetch con manejo estructurado de errores
 * 
 * @param {string} url - URL completa o relativa
 * @param {RequestInit} options - Opciones de fetch
 * @returns {Promise<any>} - Datos parseados del response
 * @throws {ValidationError|AuthenticationError|NotFoundError|etc.} - Errores estructurados
 */
export async function fetchWithAuth(url, options = {}) {
  const accessToken = sessionStorage.getItem("accessToken");

  const headers = {
    'Content-Type': 'application/json',
    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    ...(options.headers || {})
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: "include", // Para cookies (CSRF, refresh token)
    });

    // Parsear respuesta antes de validar status
    let bodyData;
    const contentType = response.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      bodyData = await response.json();
    } else {
      // Si no es JSON, obtener como texto
      bodyData = { message: await response.text() };
    }

    // Si no es exitoso, lanzar error estructurado
    if (!response.ok) {
      // El backend SIEMPRE responde con { error: { code, message, details? } }
      const errorPayload = bodyData.error || bodyData;
      
      // Crear instancia del error apropiado según el código
      throw createErrorFromResponse({
        code: errorPayload.code || 'UNKNOWN_ERROR',
        message: errorPayload.message || response.statusText || 'An error occurred',
        details: errorPayload.details || null,
        status: response.status
      });
    }

    // Respuesta exitosa - retornar los datos
    return bodyData;

  } catch (error) {
    // Si ya es un error estructurado, re-lanzarlo
    if (error.name?.includes('Error')) {
      throw error;
    }

    // Error de red o timeout
    throw new Error('Error de conexión. Verifica tu conexión a internet.');
  }
}

/**
 * Wrapper con auto-refresh de token
 * 
 * Intenta hacer la petición, y si falla por token expirado (401),
 * intenta refrescar el token y reintentar la petición.
 * 
 * @param {string} url 
 * @param {RequestInit} options 
 * @returns {Promise<any>}
 */
export async function fetchWithAuthAndAutoRefresh(url, options = {}) {
  try {
    // Intento inicial
    return await fetchWithAuth(url, options);
    
  } catch (error) {
    // Solo intentar refresh si es error de autenticación por token expirado
    if (error instanceof AuthenticationError && 
        (error.code === 'TOKEN_EXPIRED' || error.code === 'TOKEN_INVALID')) {
      
      try {
        // Intentar refrescar el token
        const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
          method: "POST",
          credentials: "include", // Cookie con refresh token
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!refreshRes.ok) {
          // Si falla el refresh, limpiar sesión
          sessionStorage.removeItem("accessToken");
          window.location.href = "/login";
          throw new AuthenticationError({
            code: 'REFRESH_FAILED',
            message: 'Session expired. Please log in again.',
            status: 401
          });
        }

        const refreshData = await refreshRes.json();
        
        // Guardar nuevo token
        sessionStorage.setItem("accessToken", refreshData.accessToken);

        // REINTENTAR la petición original con el nuevo token
        return await fetchWithAuth(url, options);

      } catch (refreshError) {
        // Limpiar sesión y redirigir
        sessionStorage.removeItem("accessToken");
        window.location.href = "/login";
        throw refreshError;
      }
    }

    // Si no es error de token, re-lanzar el error original
    throw error;
  }
}