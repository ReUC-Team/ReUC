// apps/mobile/src/features/profile/hooks/useGetProfileNative.ts

import { useState, useEffect } from 'react'
import { getProfile } from '../services/profileServiceNative'
import { AuthenticationError, getDisplayMessage } from '../../../utils/errorHandler'
import { useNavigation } from '@react-navigation/native'
import Toast from 'react-native-toast-message'

// Función helper para mostrar errores
const showError = (msg: string) => {
  Toast.show({
    type: 'error',
    text1: msg,
    position: 'bottom',
    visibilityTime: 3000,
    bottomOffset: 60,
  })
}

export function useGetProfileNative() {
  const [profile, setProfile] = useState<any>({})
  const [isLoading, setIsLoading] = useState(true)
  const navigation = useNavigation<any>()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile()
        setProfile(data.profile || {})
      } catch (err: any) {
        console.error('useGetProfileNative error:', err)

        if (err instanceof AuthenticationError) {
          navigation.navigate('Login')
          return
        }

        showError(getDisplayMessage(err))
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [])

  return { profile, isLoading }
}