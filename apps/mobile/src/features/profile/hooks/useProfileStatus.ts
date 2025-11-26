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
        console.log('🔍 [useProfileStatus] Checking profile status...')
        const data = await getProfileStatus()
        console.log('📦 [useProfileStatus] Raw response:', JSON.stringify(data, null, 2))
        console.log('✅ [useProfileStatus] isComplete:', data.status?.isComplete)
        
        setIsComplete(data.status?.isComplete || false)
      } catch (err: any) {
        console.error('❌ [useProfileStatus] Error checking profile status:', err)

        // Si es error de autenticación, redirigir a login
        if (err instanceof AuthenticationError) {
          navigation.navigate('Login')
          return
        }

        setError(err)
      } finally {
        console.log('🏁 [useProfileStatus] Loading finished')
        setIsLoading(false)
      }
    }

    checkStatus()
  }, [])

  console.log('🎯 [useProfileStatus] Current state - isComplete:', isComplete, 'isLoading:', isLoading)

  return { isComplete, isLoading, error }
}