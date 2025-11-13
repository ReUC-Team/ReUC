// apps/mobile/src/features/dashboards/shared/hooks/useProjects.ts

import { useState, useEffect } from 'react'
import { DashboardType, ProjectStatus } from '../utils/ProjectsUtils'

export interface Student {
  name: string
  email: string
}

export interface Project {
  id: number
  title: string
  students: Student[]
  company: string
  status: ProjectStatus
  assigmentDate: string
  progress: number
  lastActivity: string
  description: string
  comments: number
  deliverables: number
}

// Datos de ejemplo
const mockProjects: Project[] = [
  {
    id: 1,
    title: 'Sistema de Gestión Escolar',
    students: [
      {
        name: 'Ana García',
        email: 'ana.garcia@email.com'
      },
      {
        name: 'Luis Rodríguez',
        email: 'luis.rodriguez@email.com'
      }
    ],
    company: 'Colegio San Martín',
    status: 'En progreso',
    assigmentDate: '2024-05-16',
    progress: 65,
    lastActivity: '2024-05-22',
    description: 'Desarrollo de plataforma web para gestión de estudiantes, calificaciones y comunicación con padres.',
    comments: 3,
    deliverables: 2
  },
  {
    id: 2,
    title: 'App Móvil de Delivery',
    students: [
      {
        name: 'Carlos Mendoza',
        email: 'carlos.mendoza@email.com'
      }
    ],
    company: 'RestaurantePro',
    status: 'Revision',
    assigmentDate: '2024-05-10',
    progress: 85,
    lastActivity: '2024-05-21',
    description: 'Aplicación móvil para pedidos en línea con integración de pagos y seguimiento en tiempo real.',
    comments: 1,
    deliverables: 4
  },
  {
    id: 3,
    title: 'Portal de Recursos Humanos',
    students: [
      {
        name: 'María López',
        email: 'maria.lopez@email.com'
      },
      {
        name: 'Diego Fernández',
        email: 'diego.fernandez@email.com'
      },
      {
        name: 'Sofía Martín',
        email: 'sofia.martin@email.com'
      }
    ],
    company: 'TechCorp Inc.',
    status: 'Completado',
    assigmentDate: '2024-04-20',
    progress: 100,
    lastActivity: '2024-05-20',
    description: 'Sistema web para gestión de empleados, nóminas y reportes de recursos humanos.',
    comments: 5,
    deliverables: 6
  },
  {
    id: 4,
    title: 'Dashboard de Analytics',
    students: [
      {
        name: 'Pedro Ruiz',
        email: 'pedro.ruiz@email.com'
      },
      {
        name: 'Carmen Jiménez',
        email: 'carmen.jimenez@email.com'
      }
    ],
    company: 'DataInsight',
    status: 'En progreso',
    assigmentDate: '2024-05-18',
    progress: 30,
    lastActivity: '2024-05-23',
    description: 'Panel de control interactivo para visualización de datos y métricas empresariales.',
    comments: 0,
    deliverables: 1
  }
]

// Servicio para la API
const projectsService = {
  async getProjects(dashboardType: DashboardType): Promise<Project[]> {
    try {
      // TODO: Reemplazar con la llamada real al backend
      return new Promise((resolve) => {
        setTimeout(() => {
          // Filtrar datos según el tipo de dashboard si es necesario
          let filteredProjects = mockProjects
          
          //  agregar lógica de filtrado según el dashboardType
          
          resolve(filteredProjects)
        }, 500)
      })
    } catch (error) {
      console.error('Error fetching projects:', error)
      throw error
    }
  }
}

export const useProjects = (dashboardType: DashboardType = 'faculty') => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProjects = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await projectsService.getProjects(dashboardType)
      setProjects(data)
    } catch (err) {
      setError((err as Error).message || 'Error al cargar los proyectos')
      setProjects([])
    } finally {
      setLoading(false)
    }
  }

  const refreshProjects = () => {
    fetchProjects()
  }

  useEffect(() => {
    fetchProjects()
  }, [dashboardType])

  return {
    projects,
    loading,
    error,
    refreshProjects
  }
}