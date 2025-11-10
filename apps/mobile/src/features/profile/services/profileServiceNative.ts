// apps/mobile/src/features/profile/services/profileServiceNative.ts

import { API_URL } from '@env'
import { fetchWithAuth } from '../../auth/utils/fetchWithAuth'
import { createErrorFromResponse } from '../../../utils/errorHandler'

const MOBILE_API_KEY = 'test_mobile_key_1234567890'

/**
 * Verifica si el perfil del usuario está completo
 */
export async function getProfileStatus() {
  const response = await fetchWithAuth(`${API_URL}/profile/status`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': MOBILE_API_KEY,
    },
  })

  const bodyRes = await response.json()

  if (!response.ok) {
    throw createErrorFromResponse({
      ...bodyRes.error,
      status: response.status
    })
  }

  return bodyRes.data
}

/**
 * Obtiene los datos del perfil del usuario
 */
export async function getProfile() {
  const response = await fetchWithAuth(`${API_URL}/profile/get`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': MOBILE_API_KEY,
    },
  })

  const bodyRes = await response.json()

  if (!response.ok) {
    throw createErrorFromResponse({
      ...bodyRes.error,
      status: response.status
    })
  }

  return bodyRes.data
}

/**
 * Actualiza el perfil del usuario
 */
export async function updateProfile(data: any) {
  const response = await fetchWithAuth(`${API_URL}/mobile/profile/edit`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': MOBILE_API_KEY,
    },
    body: JSON.stringify(data),
  })

  const bodyRes = await response.json()

  if (!response.ok) {
    throw createErrorFromResponse({
      ...bodyRes.error,
      status: response.status
    })
  }

  return bodyRes.data
}