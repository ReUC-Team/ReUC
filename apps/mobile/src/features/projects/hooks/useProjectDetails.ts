// apps/mobile/src/features/projects/hooks/useProjectDetails.ts

import { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { getProjectDetails } from '../services/projectsService'
import { AuthenticationError, getDisplayMessage } from '../../../utils/errorHandler'
import Toast from 'react-native-toast-message'

interface ProjectDetails {
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

export default function useProjectDetails(uuid: string | undefined) {
  const [project, setProject] = useState<ProjectDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigation = useNavigation<any>()

  useEffect(() => {
    if (!uuid) {
      setError('UUID del proyecto no proporcionado')
      setIsLoading(false)
      return
    }

    fetchProjectDetails()
  }, [uuid])

  const fetchProjectDetails = async () => {
    if (!uuid) return

    setIsLoading(true)
    setError(null)

    try {
      const data = await getProjectDetails(uuid)
      setProject(data as ProjectDetails)
    } catch (err: any) {
      console.error('Error fetching project details:', err)

      if (err instanceof AuthenticationError) {
        Toast.show({
          type: 'error',
          text1: 'Sesión expirada',
          text2: 'Redirigiendo al login...',
          position: 'bottom',
        })
        return
      }

      const errorMessage = getDisplayMessage(err)
      setError(errorMessage)
      Toast.show({
        type: 'error',
        text1: 'Error al cargar proyecto',
        text2: errorMessage,
        position: 'bottom',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return { project, isLoading, error }
}