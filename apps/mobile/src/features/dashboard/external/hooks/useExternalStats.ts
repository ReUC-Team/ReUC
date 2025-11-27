// apps/mobile/src/features/dashboard/external/hooks/useExternalStats.ts

import {useState, useEffect} from 'react'
import { getMyApplications, getMyProjects } from 'features/projects/services/projectsService'

export interface ExternalStat {
  label: string
  value: number | string 
  icon: string
}

export interface ExternalStatsData {
  pendingApplications: number
  approvedApplications: number
  rejectedApplications: number
  totalApplications: number
  approvalRate: number
  totalProjects: number
  byStatus: {
    approved: number
    inProgress: number
    completed: number
  }
  applications: any[]
  projects: any[]
}

export const useExternalStats = () => {
  const [stats, setStats] = useState<ExternalStatsData>({
    pendingApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0,
    totalApplications: 0,
    approvalRate: 0,
    totalProjects: 0,
    byStatus: {
      approved: 0,
      inProgress: 0,
      completed: 0,
    },
    applications: [],
    projects: [],
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStats() {
      try {
        setIsLoading(true)
        
        //  Obtener MIS solicitudes
        const { applications } = await getMyApplications(1, 100)
        
        // Filtrar por estado
        const pendingApps = applications.filter(app => app.status?.slug === 'in_review')
        const approvedApps = applications.filter(app => 
          app.status?.slug === 'approved' || 
          app.status?.slug === 'project_approved'
        )
        const rejectedApps = applications.filter(app => app.status?.slug === 'rejected')
        
        const totalApps = applications.length
        
        // Tasa de aprobación: (aprobadas / total) * 100
        const approvalRate = totalApps > 0 
          ? Math.round((approvedApps.length / totalApps) * 100) 
          : 0

        // Obtener MIS proyectos
        const { projects } = await getMyProjects(1, 100)

        // Calcular estadísticas por estado de proyectos
        const byStatus = {
          approved: projects.filter(p => p.status?.slug === 'project_approved').length,
          inProgress: projects.filter(p => p.status?.slug === 'project_in_progress').length,
          completed: projects.filter(p => p.status?.slug === 'completed').length,
        }

        setStats({
          pendingApplications: pendingApps.length,
          approvedApplications: approvedApps.length,
          rejectedApplications: rejectedApps.length,
          totalApplications: totalApps,
          approvalRate,
          totalProjects: projects.length,
          byStatus,
          applications: pendingApps.slice(0, 10), // Solo pendientes para mostrar
          projects,
        })
      } catch (err: any) {
        console.error('Error fetching faculty dashboard stats:', err)
        setError(err.message || 'Error al cargar estadísticas')
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  // Datos para las tarjetas del dashboard
  const statsData: ExternalStat[] = [
    {
      label: 'Total Solicitudes',
      value: stats.totalApplications,
      icon: 'file-document-multiple-outline'
    },
    {
      label: 'Aprobadas',
      value: stats.approvedApplications,
      icon: 'check-circle'
    },
    {
      label: 'Pendientes',
      value: stats.pendingApplications,
      icon: 'clock-alert-outline'
    },
    {
      label: 'Rechazadas',
      value: stats.rejectedApplications,
      icon: 'close-circle'
    },
    {
      label: 'Tasa de Aprobación',
      value: `${stats.approvalRate}%`,
      icon: 'chart-line'
    }
  ]

  return { 
    statsData, 
    stats,
    isLoading, 
    error 
  }
}