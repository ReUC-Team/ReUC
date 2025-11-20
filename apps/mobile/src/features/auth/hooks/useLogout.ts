// apps/mobile/src/features/auth/hooks/useLogout.ts

import { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '../../../context/AuthContext'

export const useLogout = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigation = useNavigation<any>()
  const { logout } = useAuth()

  /**
   * Maneja el logout del usuario
   * Limpia tokens localmente y redirige al login
   */
  const handleLogout = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Usar el logout del contexto (ya borra tokens y limpia user)
      await logout()

      // El cambio de ruta se maneja automáticamente en AppNavigator
      // cuando detecta que user === null
      // No necesitamos hacer reset manualmente

    } catch (err) {
      const errorMessage = 
        err instanceof Error ? err.message : 'Error al cerrar sesión'
      
      setError(errorMessage)
      console.error('Logout error:', err)
      
      // Incluso con error, intentar limpiar
      try {
        await logout()
      } catch (fallbackErr) {
        console.error('Fallback logout error:', fallbackErr)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    handleLogout,
    isLoading,
    error,
  }
}

export default useLogout