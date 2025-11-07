// apps/mobile/src/features/auth/utils/fetchWithAuth.ts

import { Platform } from 'react-native'
import { tokenStorage } from './tokenStorage'
import { refreshAccessToken } from '../pages/authServiceNative'

const userAgent = `ReUC/1.0 (${Platform.OS})`

/**
 * Wrapper de fetch que incluye automáticamente el accessToken
 * y refresca el token si recibe un 401
 * 
 * CRÍTICO: Incluye User-Agent para evitar session mismatch con el backend
 */
export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  // Obtener el access token
  let accessToken = await tokenStorage.getAccessToken()

  // Primera petición con el token actual
  let response = await fetch(url, {
    ...options,
    headers: {
      'User-Agent': userAgent,
      ...options.headers,
      'Authorization': accessToken ? `Bearer ${accessToken}` : '',
    },
  })

  // Si recibimos 401, intentar refrescar el token
  if (response.status === 401) {
    try {
      // refreshAccessToken ahora devuelve el string directamente
      const newAccessToken = await refreshAccessToken()

      // Reintentar la petición con el nuevo token
      response = await fetch(url, {
        ...options,
        headers: {
          'User-Agent': userAgent,
          ...options.headers,
          'Authorization': `Bearer ${newAccessToken}`,
        },
      })
    } catch (error) {
      // Si falla el refresh, dejar que el error se propague
      console.error('Failed to refresh token:', error)
    }
  }

  return response
}