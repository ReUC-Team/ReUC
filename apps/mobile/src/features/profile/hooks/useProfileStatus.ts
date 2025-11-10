// apps/mobile/src/features/profile/hooks/useProfileStatus.ts

import { useState, useEffect } from 'react'
import { getProfileStatus } from '../services/profileServiceNative'
import { AuthenticationError } from '../../../utils/errorHandler'
import { useNavigation } from '@react-navigation/native'

export function useProfileStatus() {
  const [isComplete, setIsComplete] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<any>(null)
  const navigation = useNavigation<any>()

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const data = await getProfileStatus()
        setIsComplete(data.status?.isComplete || false)
      } catch (err: any) {
        console.error('Error checking profile status:', err)

        // Si es error de autenticación, redirigir a login
        if (err instanceof AuthenticationError) {
          navigation.navigate('Login')
          return
        }

        setError(err)
      } finally {
        setIsLoading(false)
      }
    }

    checkStatus()
  }, [])

  return { isComplete, isLoading, error }
}