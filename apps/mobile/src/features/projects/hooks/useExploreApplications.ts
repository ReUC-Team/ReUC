// apps/mobile/src/features/projects/hooks/useExploreApplications.ts

import { useState, useEffect } from 'react'
import { exploreApplications, getExploreApplicationsMetadata } from '../services/projectsService'
import { AuthenticationError, getDisplayMessage } from '../../../utils/errorHandler'
import Toast from 'react-native-toast-message'
import type { ApplicationListItem, Faculty } from '../types/project.types'

interface Pagination {
  page: number
  perPage: number
  totalPages: number
  filteredItems: number
}

export default function useExploreApplications() {
  const [applications, setApplications] = useState<ApplicationListItem[]>([])
  const [faculties, setFaculties] = useState<Faculty[]>([])
  const [selectedFacultyName, setSelectedFacultyName] = useState<string | null>(null)
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    perPage: 9,
    totalPages: 1,
    filteredItems: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Cargar metadata (facultades disponibles)
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const metadata = await getExploreApplicationsMetadata()
        setFaculties(metadata.metadata.faculties || [])
      } catch (err) {
        console.error('Error loading faculties:', err)
      }
    }

    fetchMetadata()
  }, [])

  // Cargar aplicaciones cuando cambia la página o el filtro
  useEffect(() => {
    fetchApplicationsData()
  }, [selectedFacultyName, pagination.page, pagination.perPage])

  const fetchApplicationsData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await exploreApplications(
        selectedFacultyName,
        pagination.page,
        pagination.perPage
      )

      setApplications(data.applications)
      setPagination((prev) => ({
        ...prev,
        totalPages: data.pagination.totalPages,
        filteredItems: data.pagination.filteredItems,
      }))
    } catch (err: any) {
      console.error('Error fetching applications:', err)

      if (err instanceof AuthenticationError) {
        Toast.show({
          type: 'error',
          text1: 'Sesión expirada',
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

  const handleFacultyFilter = (facultyName: string) => {
    // Si ya está seleccionada, la quitamos (mostrar todas)
    if (selectedFacultyName === facultyName) {
      setSelectedFacultyName(null)
    } else {
      setSelectedFacultyName(facultyName)
    }
    // Reset a página 1 al cambiar filtro
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }))
    }
  }

  return {
    applications,
    faculties,
    selectedFacultyName,
    pagination,
    isLoading,
    error,
    handleFacultyFilter,
    handlePageChange,
  }
}