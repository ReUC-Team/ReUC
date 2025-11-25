// apps/mobile/src/features/projects/hooks/useProjectDetails.ts

import { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { getProjectDetails, getTeamMetadata } from '../services/projectsService' 
import { AuthenticationError, getDisplayMessage } from '../../../utils/errorHandler'
import Toast from 'react-native-toast-message'

interface ProjectDetails {
  uuid_project: string
  uuid_application: string
  title: string
  shortDescription: string
  detailedDescription: string
  estimatedDate: string
  createdAt: string
  approvedAt: string
  status: any
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
  uuidCreator: string
  faculties: any[]
  projectTypes: any[]
  problemTypes: any[]
  teamMembers: any[]
  teamConstraints: any
}

export default function useProjectDetails(uuid: string | undefined) {
  const [project, setProject] = useState<ProjectDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigation = useNavigation<any>()

  const fetchProjectDetails = async () => {
    if (!uuid) return

    setIsLoading(true)
    setError(null)

    try {
      const data = await getProjectDetails(uuid)

      try {
        const metadata = await getTeamMetadata(uuid)
        
        console.log(' METADATA RAW:', JSON.stringify(metadata, null, 2))
        
        const constraints: Record<string, { min: number; max: number }> = {}
        
        const allowedRoles = metadata.metadata?.allowedRoles || []
        
        console.log(' ALLOWED ROLES:', allowedRoles)
        
        if (allowedRoles && Array.isArray(allowedRoles) && allowedRoles.length > 0) {
          allowedRoles.forEach((role: any) => {
            constraints[role.name] = {
              min: role.minCount || 0,
              max: role.maxCount === null ? Infinity : role.maxCount,
            }
          })
        }

        data.teamConstraints = constraints
        
        console.log(' CONSTRAINTS OBTENIDAS:', constraints)
      } catch (metadataError: any) {
        console.warn(' No se pudieron obtener teamConstraints:', metadataError.message)
        data.teamConstraints = {}
      }

      setProject(data as ProjectDetails)
    } catch (err: any) {
      console.error(' Error fetching project details:', err)

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

  useEffect(() => {
    if (!uuid) {
      setError('UUID del proyecto no proporcionado')
      setIsLoading(false)
      return
    }

    const unsubscribeFocus = navigation.addListener('focus', () => {
      console.log('🔄 Pantalla enfocada, recargando detalles del proyecto...')
      fetchProjectDetails()
    })

    fetchProjectDetails()

    return () => {
      unsubscribeFocus()
    }
  }, [uuid])

  return { project, isLoading, error }
}