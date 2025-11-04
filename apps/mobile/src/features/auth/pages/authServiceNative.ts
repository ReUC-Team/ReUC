// apps/mobile/src/features/auth/services/authServiceNative.ts

// url de env
import { Platform } from "react-native";
import { API_URL } from '@env'
import { showError } from '../utils/toast'

const userAgent = `ReUC/1.0 (${Platform.OS})`

export interface RegisterData {
  email: string
  password: string
  confirmPassword?: string
  acceptTerms: boolean
  studentId?: string
}

export async function register(data: RegisterData) {
  const res = await fetch(`${API_URL}/mobile/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "User-Agent": userAgent,
    },
    credentials: 'include',
    body: JSON.stringify(data),
  })

  const bodyRes = await res.json()
  if (!res.ok) {
    const msg =
      res.status !== 422
        ? bodyRes.err
        : 'Hubo un problema en el registro'
    // Muestro alerta antes de devolver el objeto
    showError(msg)
    return { success: false, err: msg }
  }

  return { success: true, data: bodyRes.data.user }
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/mobile/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "User-Agent": userAgent,
    },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  })

  const bodyRes = await res.json()
  if (!res.ok) {
    const msg =
      res.status !== 422
        ? bodyRes.err
        : 'Hubo un problema en el login'
    // Muestro alerta antes de devolver el objeto
    showError(msg)
    return { success: false, err: msg }
  }

  return { success: true, data: bodyRes.data.user }
}

export async function logout() {
  const res = await fetch(`${API_URL}/auth/logout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  })

  const bodyRes = await res.json()
  if (!res.ok) {
    showError(bodyRes.err)
    return { success: false, err: bodyRes.err }
  }
  return { success: true, message: bodyRes.message }
}
