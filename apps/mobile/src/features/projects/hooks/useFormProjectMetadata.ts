// apps/mobile/src/features/projects/hooks/useFormProjectMetadata.ts

import { useEffect, useState } from 'react'
import { Platform } from 'react-native'
import { getCreateMetadata } from '../services/projectsService'
import { tokenStorage } from '../../auth/utils/tokenStorage'
import { AuthenticationError, getDisplayMessage } from '../../../utils/errorHandler'
import Toast from 'react-native-toast-message'

interface Faculty {
  faculty_id: number
  name: string
  abbreviation: string
}

interface ProjectType {
  project_type_id: number
  name: string
}

interface ProblemType {
  problem_type_id: number
  name: string
}

interface DefaultBanner {
  uuid: string
  url: string
  name: string
}

export default function useFormProjectMetadata() {
  const [faculties, setFaculties] = useState<Faculty[]>([])
  const [projectTypes, setProjectTypes] = useState<ProjectType[]>([])
  const [problemTypes, setProblemTypes] = useState<ProblemType[]>([])
  const [defaultBanners, setDefaultBanners] = useState<DefaultBanner[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<any>(null)

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        console.log(' useFormProjectMetadata: Starting metadata fetch...')
        setIsLoading(true)
        setError(null)

        // Verificar token
        const token = await tokenStorage.getAccessToken()
        console.log(' Token status:', token ? 'Present ✅' : 'Missing ❌')
        console.log(' Token length:', token?.length)
        console.log(' Token preview:', token?.substring(0, 20) + '...')

        console.log('📡 Calling getCreateMetadata()...')
        const metadata = await getCreateMetadata()

        console.log('📊 Metadata loaded:', {
          faculties: metadata.faculties?.length,
          projectTypes: metadata.projectTypes?.length,
          problemTypes: metadata.problemTypes?.length,
          banners: metadata.defaultBanners?.length,
        })

        console.log(' Faculties:', metadata.faculties)
        console.log(' Project Types:', metadata.projectTypes)
        console.log(' Problem Types:', metadata.problemTypes)
        console.log(' Banners:', metadata.defaultBanners)

        setFaculties(metadata.faculties || [])
        setProjectTypes(metadata.projectTypes || [])
        setProblemTypes(metadata.problemTypes || [])
        setDefaultBanners(metadata.defaultBanners || [])

        console.log('✅ State updated successfully')
      } catch (err: any) {
        console.error('❌ Error in fetchMetadata:', err)
        console.error('❌ Error type:', err.constructor?.name)
        console.error('❌ Error message:', err.message)
        console.error('❌ Error stack:', err.stack)
        console.error('❌ Full error object:', JSON.stringify(err, null, 2))

        if (err instanceof AuthenticationError) {
          console.log(' Authentication error detected')
          Toast.show({
            type: 'error',
            text1: 'Tu sesión ha expirado',
            position: 'bottom',
          })
          return
        }

        const errorMessage = getDisplayMessage(err)
        console.log(' Display message:', errorMessage)
        setError(errorMessage)
        Toast.show({
          type: 'error',
          text1: 'Error al cargar formulario',
          text2: errorMessage,
          position: 'bottom',
        })
      } finally {
        console.log(' fetchMetadata finished, setting isLoading to false')
        setIsLoading(false)
      }
    }

    fetchMetadata()
  }, [])

  return {
    faculties,
    projectTypes,
    problemTypes,
    defaultBanners,
    isLoading,
    error,
  }
}