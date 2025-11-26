// apps/mobile/src/features/auth/services/authServiceNative.ts

import { Platform } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { API_URL, MOBILE_API_KEY } from '@env'
import { tokenStorage } from '../utils/tokenStorage'
import { createErrorFromResponse } from '../../../utils/errorHandler'

const userAgent = `ReUC/1.0 (${Platform.OS})`
const DASHBOARD_MODAL_KEY = '@reuc:dashboardProfileModalShown'

export interface RegisterData {
  email: string
  password: string
  confirmPassword?: string
  acceptTerms: boolean
  universityId?: string
}

/**
 * Registra un nuevo usuario
 * Lanza excepciones estructuradas en caso de error
 */
export async function register(data: RegisterData) {
  const res = await fetch(`${API_URL}/mobile/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': userAgent,
      'x-api-key': MOBILE_API_KEY,
    },
    credentials: 'include',
    body: JSON.stringify(data),
  })

  const bodyRes = await res.json()
  
  if (!res.ok) {
    throw createErrorFromResponse({
      ...bodyRes.error,
      status: res.status
    })
  }

  // Guardar tokens
  const { accessToken, refreshToken } = bodyRes.data.tokens
  await tokenStorage.saveTokens(accessToken, refreshToken)

  return { user: bodyRes.data.user, tokens: bodyRes.data.tokens }
}

/**
 * Inicia sesión
 * Lanza excepciones estructuradas en caso de error
 * Solo guarda tokens, NO retorna usuario (se obtiene con getSession)
 */
export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/mobile/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': userAgent,
      'x-api-key': MOBILE_API_KEY,
    },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  })

  const bodyRes = await res.json()
  
  if (!res.ok) {
    throw createErrorFromResponse({
      ...bodyRes.error,
      status: res.status
    })
  }

  // Guardar tokens
  const { accessToken, refreshToken } = bodyRes.data.tokens
  await tokenStorage.saveTokens(accessToken, refreshToken)

  console.log('✅ Tokens saved successfully')

  return { tokens: bodyRes.data.tokens }
}

/**
 * Refresca el access token usando el refresh token
 * Lanza excepciones estructuradas en caso de error
 * 
 * NOTA: Esta función es usada internamente por client.ts
 */
export async function refreshAccessToken(): Promise<string> {
  const refreshToken = await tokenStorage.getRefreshToken()

  if (!refreshToken) {
    throw createErrorFromResponse({
      code: 'AUTHENTICATION_FAILURE',
      message: 'No refresh token available',
      status: 401
    })
  }

  const res = await fetch(`${API_URL}/mobile/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': MOBILE_API_KEY,
    },
    body: JSON.stringify({ refreshToken }),
  })

  const bodyRes = await res.json()

  if (!res.ok) {
    throw createErrorFromResponse({
      ...bodyRes.error,
      status: res.status
    })
  }

  // Guardar el nuevo access token
  const newAccessToken = bodyRes.data.accessToken
  await tokenStorage.saveTokens(newAccessToken, refreshToken)

  return newAccessToken
}

/**
 * Obtiene la sesión actual del usuario desde /auth/me
 * Retorna el usuario completo con rol
 * Lanza excepciones estructuradas en caso de error
 */
export async function getSession() {
  const accessToken = await tokenStorage.getAccessToken()

  if (!accessToken) {
    throw createErrorFromResponse({
      code: 'AUTHENTICATION_FAILURE',
      message: 'No access token available',
      status: 401
    })
  }

  const res = await fetch(`${API_URL}/auth/me`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'x-api-key': MOBILE_API_KEY,
      'User-Agent': userAgent,
    },
  })

  const bodyRes = await res.json()
  
  if (!res.ok) {
    throw createErrorFromResponse({
      ...bodyRes.error,
      status: res.status
    })
  }

  const roleData = bodyRes.data.role

  // Devolver role como objeto {slug, name}
  const userData = {
    uuid: bodyRes.data.user, 
    email: roleData.email || roleData.institutionalEmail || '', 
    role: {
      slug: roleData.name,      
      name: roleData.name,      
    },
    firstName: roleData.firstName || '',
    lastName: roleData.lastName || '',
    roleDetails: roleData, 
  }

  console.log(' Session loaded:', userData)

  return userData
}

/**
 * Cierra sesión (local - solo borra tokens)
 */
export async function logout() {
  try {
    // Limpiar tokens
    await tokenStorage.clearTokens()
    
    console.log(' Logout successful - tokens cleared')
    
    return { message: 'Sesión cerrada' }
  } catch (error) {
    console.error(' Error during logout:', error)
    throw error
  }
}