// apps/mobile/src/features/projects/hooks/useMyApplications.ts

import { useState, useEffect } from 'react'
import { getMyApplications } from '../services/projectsService'
import { AuthenticationError, getDisplayMessage } from '../../../utils/errorHandler'
import Toast from 'react-native-toast-message'

interface Application {
  uuid_application: string
  title: string
  shortDescription: string
  bannerUrl: string | null
  status: string
  createdAt: string
}

interface Pagination {
  page: number
  perPage: number
  totalPages: number
  filteredItems: number
  totalItems: number
}

export default function useMyApplications(initialPage: number = 1) {
  const [applications, setApplications] = useState<Application[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    page: initialPage,
    perPage: 9,
    totalPages: 1,
    filteredItems: 0,
    totalItems: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchApplications()
  }, [pagination.page, pagination.perPage])

  const fetchApplications = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await getMyApplications(pagination.page, pagination.perPage)

      setApplications(data.applications)
      setPagination((prev) => ({
        ...prev,
        page: data.pagination.page,
        totalPages: data.pagination.totalPages,
        filteredItems: data.pagination.filteredItems,
        totalItems: data.pagination.totalItems,
      }))
    } catch (err: any) {
      console.error('Error fetching my applications:', err)

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
        text1: 'Error al cargar solicitudes',
        text2: errorMessage,
        position: 'bottom',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages && newPage !== pagination.page) {
      setPagination((prev) => ({ ...prev, page: newPage }))
    }
  }

  const refreshApplications = async () => {
    await fetchApplications()
  }

  return {
    applications,
    pagination,
    isLoading,
    error,
    handlePageChange,
    refreshApplications,
  }
}