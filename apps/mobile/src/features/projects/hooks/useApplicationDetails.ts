// apps/mobile/src/features/projects/hooks/useApplicationDetails.ts

import { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { getApplicationDetails } from '../services/projectsService'
import { AuthenticationError, NotFoundError, getDisplayMessage } from '../../../utils/errorHandler'
import Toast from 'react-native-toast-message'

interface ApplicationDetails {
  uuid_application: string
  title: string
  shortDescription: string
  detailedDescription: string
  deadline: string
  createdAt: string
  status: string
  bannerUrl: string | null
  attachments: any[]
  author: {
    fullName: string
    firstName: string
    lastName: string
    email: string | null
    organizationName: string | null
    phoneNumber: string | null
    location: string | null
  }
  faculties: any[]
  projectTypes: any[]
  problemTypes: any[]
}

export default function useApplicationDetails(uuid: string | undefined) {
  const [application, setApplication] = useState<ApplicationDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigation = useNavigation<any>()

  useEffect(() => {
    if (!uuid) {
      setError('UUID de aplicación no proporcionado')
      setIsLoading(false)
      return
    }

    fetchDetails()
  }, [uuid])

  const fetchDetails = async () => {
    if (!uuid) return

    setIsLoading(true)
    setError(null)

    try {
      const data = await getApplicationDetails(uuid)
      setApplication(data as ApplicationDetails)
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

  return { application, isLoading, error }
}