// apps/mobile/src/features/projects/hooks/useMyProjects.ts

import { useState, useEffect } from 'react'
import { getMyProjects } from '../services/projectsService'
import { AuthenticationError, getDisplayMessage } from '../../../utils/errorHandler'
import Toast from 'react-native-toast-message'

interface Project {
  uuid_application: string // Los proyectos usan el UUID de la aplicación original
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

export default function useMyProjects(initialPage: number = 1) {
  const [projects, setProjects] = useState<Project[]>([])
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
    fetchProjects()
  }, [pagination.page, pagination.perPage])

  const fetchProjects = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await getMyProjects(pagination.page, pagination.perPage)

      setProjects(data.projects)
      setPagination((prev) => ({
        ...prev,
        page: data.pagination.page,
        totalPages: data.pagination.totalPages,
        filteredItems: data.pagination.filteredItems,
        totalItems: data.pagination.totalItems,
      }))
    } catch (err: any) {
      console.error('Error fetching my projects:', err)

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
        text1: 'Error al cargar proyectos',
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

  const refreshProjects = async () => {
    await fetchProjects()
  }

  return {
    projects,
    pagination,
    isLoading,
    error,
    handlePageChange,
    refreshProjects,
  }
}