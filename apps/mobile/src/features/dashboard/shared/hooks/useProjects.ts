// apps/mobile/src/features/dashboards/shared/hooks/useProjects.ts

import { useState, useEffect } from 'react'
import { getMyProjects, getProjectDetails } from '../../../projects/services/projectsService'
import { DashboardType } from '../utils/ProjectsUtils'

export interface Student {
  name: string
  email: string
}

export interface Project {
  id: string
  uuid_project: string
  title: string
  description: string
  company: string
  status: string
  students: Student[]
  assigmentDate: string
  progress: number
  lastActivity: string
  comments: number
  deliverables: number
}

export const useProjects = (dashboardType: DashboardType = 'faculty') => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProjects = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { projects: projectsList } = await getMyProjects(1, 100)
      
      const projectsToFetch = projectsList.slice(0, 5)
      
      const detailedProjectsPromises = projectsToFetch.map(proj => 
        getProjectDetails(proj.uuid_project).then(details => ({
          ...details,
          uuid_project: proj.uuid_project,
        }))
      )
      
      const detailedProjects = await Promise.all(detailedProjectsPromises)
      
      const transformedProjects = detailedProjects.map(project => {

        
        // Intentar múltiples formas de filtrar
        const allMembers = project.teamMembers || []
        
        
        // Método 1: Por roleName
        const byRoleName = allMembers.filter(m => {
          console.log(`   - Miembro: ${m.fullName}, roleName: "${m.roleName}", roleId: ${m.roleId}`)
          return m.roleName === 'Miembro'
        })
        
        // Método 2: Por roleId
        const byRoleId = allMembers.filter(m => m.roleId === 2)
        
        // Método 3: Excluir líder
        const notLeader = allMembers.filter(m => 
          m.roleName !== 'Líder' && m.roleName !== 'Leader' && m.roleId !== 1
        )
        
        // Usar el que tenga más resultados (o todos si ninguno funciona)
        let students: Student[] = []
        
        if (byRoleName.length > 0) {
          students = byRoleName.map(member => ({
            name: member.fullName || 'Sin nombre',
            email: member.email || 'Sin email',
          }))
        } else if (byRoleId.length > 0) {
          students = byRoleId.map(member => ({
            name: member.fullName || 'Sin nombre',
            email: member.email || 'Sin email',
          }))
        } else if (notLeader.length > 0) {
          students = notLeader.map(member => ({
            name: member.fullName || 'Sin nombre',
            email: member.email || 'Sin email',
          }))
        } else if (allMembers.length > 0) {
          // Si no hay forma de filtrar, usar todos
          students = allMembers.map(member => ({
            name: member.fullName || 'Sin nombre',
            email: member.email || 'Sin email',
          }))
        }


        
        return {
          id: project.uuid_project,
          uuid_project: project.uuid_project,
          title: project.title || 'Sin título',
          description: project.shortDescription || project.detailedDescription || 'Sin descripción',
          company: project.author?.fullName || 'Autor no especificado',
          status: getStatusLabel(project.status?.slug),
          students,
          progress: 0,
          assigmentDate: project.approvedAt || project.createdAt || new Date().toISOString(),
          lastActivity: project.createdAt || new Date().toISOString(),
          comments: 0,
          deliverables: 0,
        }
      })


      
      setProjects(transformedProjects)
    } catch (err: any) {
      console.error('Error fetching projects:', err)
      setError(err.message || 'Error al cargar proyectos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [dashboardType])

  const refreshProjects = () => {
    fetchProjects()
  }

  return { projects, loading, error, refreshProjects }
}

function getStatusLabel(statusSlug: string | undefined): string {
  const statusMap: Record<string, string> = {
    'project_approved': 'Aprobado',
    'project_in_progress': 'En Progreso',
    'completed': 'Completado',
    'rejected': 'Rechazado',
  }
  return statusMap[statusSlug || ''] || 'Desconocido'
}