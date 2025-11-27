// apps/mobile/src/features/dashboard/student/hooks/useDashboardStats.ts

import { useState, useEffect } from 'react'
import { getMyProjects } from '../../../projects/services/projectsService'

export interface DashboardStats {
  projects: any[]
  totalProjects: number
  byStatus: {
    approved: number
    inProgress: number
    completed: number
  }
  totalTeamMembers: number
  nearestDeadline: {
    title: string
    deadlineDate: string
  } | null
  resourcesCount: number
}

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats>({
    projects: [],
    totalProjects: 0,
    byStatus: {
      approved: 0,
      inProgress: 0,
      completed: 0,
    },
    totalTeamMembers: 0,
    nearestDeadline: null,
    resourcesCount: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Obtener TODOS los proyectos del estudiante (sin paginación)
      const { projects } = await getMyProjects(1, 100)

      // Calcular estadísticas reales
      const byStatus = {
        approved: projects.filter(p => p.status?.slug === 'project_approved').length,
        inProgress: projects.filter(p => p.status?.slug === 'project_in_progress').length,
        completed: projects.filter(p => p.status?.slug === 'completed').length,
      }

      // Encontrar deadline más cercano
      const projectsWithDeadlines = projects
        .map(p => ({
          ...p,
          deadlineDate: p.estimatedDate ? new Date(p.estimatedDate) : null
        }))
        .filter(p => p.deadlineDate && p.deadlineDate > new Date())
        .sort((a, b) => a.deadlineDate!.getTime() - b.deadlineDate!.getTime())

      const nearestDeadline = projectsWithDeadlines[0] 
        ? {
            title: projectsWithDeadlines[0].title,
            deadlineDate: projectsWithDeadlines[0].estimatedDate
          }
        : null

      // Calcular total de miembros (placeholder - requeriría obtener detalles)
      const totalTeamMembers = projects.length * 4

      setStats({
        projects,
        totalProjects: projects.length,
        byStatus,
        totalTeamMembers,
        nearestDeadline,
        resourcesCount: 0, // Se calcularía obteniendo detalles de cada proyecto
      })
    } catch (err: any) {
      console.error('Error fetching dashboard stats:', err)
      setError(err.message || 'Error al cargar estadísticas')
    } finally {
      setIsLoading(false)
    }
  }

  return { stats, isLoading, error, refreshStats: fetchStats }
}