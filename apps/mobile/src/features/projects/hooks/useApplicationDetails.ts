// apps/mobile/src/features/projects/hooks/useApplicationDetails.ts

import { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { getApplicationDetails } from '../services/projectsService'
import { AuthenticationError, NotFoundError, getDisplayMessage } from '../../../utils/errorHandler'
import Toast from 'react-native-toast-message'
import type { ApplicationDetails } from '../types/project.types'

export default function useApplicationDetails(uuid: string | undefined) {
  const [application, setApplication] = useState<ApplicationDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigation = useNavigation<any>()

  const fetchDetails = async () => {
    if (!uuid) return

    setIsLoading(true)
    setError(null)

    try {
      const data = await getApplicationDetails(uuid)
      setApplication(data)
    } catch (err: any) {
      console.error('Error fetching application details:', err)

      if (err instanceof AuthenticationError) {
        Toast.show({
          type: 'error',
          text1: 'Sesión expirada',
          text2: 'Por favor, inicia sesión nuevamente',
          position: 'bottom',
        })
        setTimeout(() => navigation.navigate('Login'), 2000)
        return
      }

      if (err instanceof NotFoundError) {
        Toast.show({
          type: 'error',
          text1: 'Proyecto no encontrado',
          position: 'bottom',
        })
        setTimeout(() => navigation.goBack(), 2000)
        return
      }

      const errorMessage = getDisplayMessage(err)
      setError(errorMessage)
      Toast.show({
        type: 'error',
        text1: 'Error al cargar detalles',
        text2: errorMessage,
        position: 'bottom',
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!uuid) {
      setError('UUID de aplicación no proporcionado')
      setIsLoading(false)
      return
    }

    //  Recargar cada vez que se enfoca la pantalla
    const unsubscribeFocus = navigation.addListener('focus', () => {
      console.log(' Pantalla enfocada, recargando detalles...')
      fetchDetails()
    })

    // Carga inicial
    fetchDetails()

    // Cleanup
    return () => {
      unsubscribeFocus()
    }
  }, [uuid])

  return { application, isLoading, error, refetch: fetchDetails }
}