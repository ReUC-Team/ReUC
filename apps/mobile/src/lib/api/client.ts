// apps/mobile/src/lib/api/client.ts

import { Platform } from 'react-native'
import { API_URL, MOBILE_API_KEY } from '@env'
import { tokenStorage } from '../../features/auth/utils/tokenStorage'
import { 
  createErrorFromResponse, 
  AuthenticationError 
} from '../../utils/errorHandler'

const userAgent = `ReUC/1.0 (${Platform.OS})`

/**
 * Wrapper principal para fetch con manejo estructurado de errores
 * 
 * @param url - URL completa o relativa
 * @param options - Opciones de fetch
 * @returns Datos parseados del response
 * @throws {ValidationError|AuthenticationError|NotFoundError|etc.} - Errores estructurados
 */
export async function fetchWithAuth(
  url: string, 
  options: RequestInit = {}
): Promise<any> {
  const accessToken = await tokenStorage.getAccessToken()

  const headers: Record<string, string> = {
    'User-Agent': userAgent,
    'x-api-key': MOBILE_API_KEY,
    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    ...(options.headers as Record<string, string> || {})
  }

  // Si el body es FormData, NO agregar Content-Type
  // Fetch lo establecerá automáticamente con el boundary correcto
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    })

    // Parsear respuesta antes de validar status
    let bodyData: any
    const contentType = response.headers.get('content-type')
    
    if (contentType?.includes('application/json')) {
      bodyData = await response.json()
    } else {
      // Si no es JSON, obtener como texto
      bodyData = { message: await response.text() }
    }

    // Si no es exitoso, lanzar error estructurado
    if (!response.ok) {
      // El backend SIEMPRE responde con { error: { code, message, details? } }
      const errorPayload = bodyData.error || bodyData
      
      // Crear instancia del error apropiado según el código
      throw createErrorFromResponse({
        code: errorPayload.code || 'UNKNOWN_ERROR',
        message: errorPayload.message || response.statusText || 'An error occurred',
        details: errorPayload.details || null,
        status: response.status
      })
    }

    return bodyData

  } catch (error: any) {
    // Si ya es un error estructurado, re-lanzarlo
    if (error.name?.includes('Error')) {
      throw error
    }

    // Error de red o timeout
    throw new Error('Error de conexión. Verifica tu conexión a internet.')
  }
}

/**
 * Wrapper con auto-refresh de token
 * 
 * Intenta hacer la petición, y si falla por token expirado (401),
 * intenta refrescar el token y reintentar la petición.
 * 
 * COMPATIBLE con la estructura de web pero adaptado a mobile
 */
export async function fetchWithAuthAndAutoRefresh(
  url: string, 
  options: RequestInit = {}
): Promise<any> {
  try {
    // Intento inicial
    return await fetchWithAuth(url, options)
    
  } catch (error: any) {
    // Solo intentar refresh si es error de autenticación por token expirado
    if (error instanceof AuthenticationError && 
        (error.code === 'TOKEN_EXPIRED' || error.code === 'TOKEN_INVALID')) {
      
      try {
        console.log('🔄 Token expired, attempting refresh...')
        
        // Obtener refresh token
        const refreshToken = await tokenStorage.getRefreshToken()

        if (!refreshToken) {
          throw new AuthenticationError({
            code: 'NO_REFRESH_TOKEN',
            message: 'No refresh token available',
            status: 401
          })
        }

        // Intentar refrescar el token
        const refreshRes = await fetch(`${API_URL}/mobile/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': MOBILE_API_KEY,
          },
          body: JSON.stringify({ refreshToken }),
        })

        if (!refreshRes.ok) {
          // Si falla el refresh, limpiar sesión
          await tokenStorage.clearTokens()
          
          throw new AuthenticationError({
            code: 'REFRESH_FAILED',
            message: 'Session expired. Please log in again.',
            status: 401
          })
        }

        const refreshData = await refreshRes.json()
        
        // Guardar nuevo access token (mantener el mismo refresh token)
        const newAccessToken = refreshData.data.accessToken
        await tokenStorage.saveTokens(newAccessToken, refreshToken)

        console.log('✅ Token refreshed successfully')

        // REINTENTAR la petición original con el nuevo token
        return await fetchWithAuth(url, options)

      } catch (refreshError: any) {
        console.error('❌ Refresh failed:', refreshError)
        
        // Limpiar sesión
        await tokenStorage.clearTokens()
        
        throw refreshError
      }
    }

    // Si no es error de token, re-lanzar el error original
    throw error
  }
}