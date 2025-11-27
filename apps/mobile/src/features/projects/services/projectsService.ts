// apps/mobile/src/features/projects/services/projectsService.ts

import { fetchWithAuthAndAutoRefresh } from '../../../lib/api/client'
import { API_URL } from '@env'
import type {
  ApplicationDetails,
  ProjectDetails,
  ApplicationListItem,
  ProjectListItem,
} from '../types/project.types'

/**
 * ============================================================================
 * METADATA ENDPOINTS
 * ============================================================================
 */

export const getCreateMetadata = async () => {
  const response = await fetchWithAuthAndAutoRefresh(`${API_URL}/application/metadata/create`)
  
  const metadata = response.data.metadata
  
  if (metadata.defaultBanners) {
    metadata.defaultBanners = metadata.defaultBanners.map((banner: any) => ({
      ...banner,
      url: `${API_URL}${banner.url}`
    }))
  }
  
  return metadata
}

export const getExploreApplicationsMetadata = async () => {
  const response = await fetchWithAuthAndAutoRefresh(`${API_URL}/application/metadata/explore`)
  return response.data
}

/**
 * ============================================================================
 * APPLICATION ENDPOINTS
 * ============================================================================
 */

export const createApplication = async (formData: FormData) => {
  const response = await fetchWithAuthAndAutoRefresh(`${API_URL}/mobile/application/create`, {
    method: 'POST',
    body: formData,
  })
  return response.data
}

export const getMyApplications = async (page: number = 1, perPage: number = 9) => {
  const response = await fetchWithAuthAndAutoRefresh(
    `${API_URL}/application/my-applications?page=${page}&perPage=${perPage}`
  )

  const records = response.data.applications.records || []
  const metadata = response.data.applications.metadata || {}

  return {
    applications: records.map((app: any) => ({
      uuid_application: app.uuid_application,
      title: app.title,
      shortDescription: app.shortDescription,
      bannerUrl: app.bannerUrl ? `${API_URL}${app.bannerUrl}` : null,
      status: app.status,
      createdAt: app.createdAt,
    })) as ApplicationListItem[],
    pagination: metadata.pagination || {
      page: 1,
      perPage: 9,
      totalPages: 1,
      filteredItems: 0,
      totalItems: 0,
    },
  }
}

/**
 * Obtiene detalles de una aplicación específica
 * 
 */
export const getApplicationDetails = async (uuid: string): Promise<ApplicationDetails> => {
  const response = await fetchWithAuthAndAutoRefresh(`${API_URL}/application/${uuid}`)

  console.log('📦 API Response completa:', JSON.stringify(response.data, null, 2))

  const app = response.data.application

  const details = app.details || {}
  
  console.log('📋 Details extraídos:', {
    deadline: details.deadline,
    createdAt: details.createdAt,
    title: details.title
  })

  return {
    uuid_application: uuid,
    title: details.title || '',
    shortDescription: details.shortDescription || '',
    detailedDescription: details.description || '',
    deadline: details.deadline || '',  
    createdAt: details.createdAt || '',  
    status: details.status || { name: 'Desconocido', slug: 'unknown' },
    bannerUrl: app.bannerUrl ? `${API_URL}${app.bannerUrl}` : null,
    attachments: app.attachments?.map((file: any) => ({
      uuid_file: file.uuid,
      filename: file.name,
      mimeType: file.type,
      size: file.size,
      url: `${API_URL}${file.downloadUrl}`,
    })) || [],
    author: {
      fullName: app.author?.fullName || 'Desconocido',
      firstName: app.author?.fullName?.split(' ')[0] || '',
      lastName: app.author?.fullName?.split(' ').slice(1).join(' ') || '',
      email: app.author?.email || null,
      organizationName: app.author?.organizationName || null,
      phoneNumber: app.author?.phoneNumber || null,
      location: app.author?.location || null,
    },
    faculties: details.faculties?.map((f: any) => ({
      faculty_id: f.id,
      name: f.name,
    })) || [],
    projectTypes: details.projectTypes?.map((pt: any) => ({
      project_type_id: pt.id,
      name: pt.name,
    })) || [],
    problemTypes: details.problemTypes?.map((pt: any) => ({
      problem_type_id: pt.id,
      name: pt.name,
    })) || [],
    project: details.project || null,
  }
}

export const exploreApplications = async (
  facultyName: string | null = null,
  page: number = 1,
  perPage: number = 9
) => {
  let url = `${API_URL}/application/explore/all?page=${page}&perPage=${perPage}`
  
  if (facultyName) {
    url = `${API_URL}/application/explore/${encodeURIComponent(facultyName)}?page=${page}&perPage=${perPage}`
  }

  const response = await fetchWithAuthAndAutoRefresh(url)

  const records = response.data.applications.records || []
  const metadata = response.data.applications.metadata || {}

  return {
    applications: records.map((app: any) => ({
      uuid_application: app.uuid_application,
      title: app.title,
      shortDescription: app.shortDescription,
      bannerUrl: app.bannerUrl ? `${API_URL}${app.bannerUrl}` : null,
      status: app.status,
      createdAt: app.createdAt,
    })) as ApplicationListItem[],
    pagination: metadata.pagination || {
      page: 1,
      perPage: 9,
      totalPages: 1,
      filteredItems: 0,
    },
  }
}

export const updateApplication = async (uuid: string, data: any) => {
  const response = await fetchWithAuthAndAutoRefresh(`${API_URL}/mobile/application/${uuid}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  return response.data
}

/**
 * Elimina una aplicación (soft delete)
 */
export const deleteApplication = async (uuid: string) => {
  const response = await fetchWithAuthAndAutoRefresh(`${API_URL}/mobile/application/${uuid}`, {
    method: 'DELETE',
  })
  return response.data
}

/**
 * ============================================================================
 * PROJECT ENDPOINTS
 * ============================================================================
 */

export const approveApplication = async (uuidApplication: string, projectData: any) => {
  const payload = {
    uuidApplication,
    ...projectData,
  }

  const response = await fetchWithAuthAndAutoRefresh(`${API_URL}/mobile/project/create`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })

  return response.data
}

export const getMyProjects = async (page: number = 1, perPage: number = 9) => {
  const response = await fetchWithAuthAndAutoRefresh(
    `${API_URL}/project/my-projects?page=${page}&perPage=${perPage}`
  )

  const records = response.data.projects.records || []
  const metadata = response.data.projects.metadata || {}

  return {
    projects: records.map((project: any) => ({
      uuid_project: project.uuid_project,
      uuid_application: project.uuid_application,
      title: project.title,
      shortDescription: project.shortDescription,
      bannerUrl: project.bannerUrl ? `${API_URL}${project.bannerUrl}` : null,
      status: project.status,
      createdAt: project.createdAt,
      approvedAt: project.approvedAt,
    })) as ProjectListItem[],
    pagination: metadata.pagination || {
      page: 1,
      perPage: 9,
      totalPages: 1,
      filteredItems: 0,
      totalItems: 0,
    },
  }
}

/**
 * Obtiene detalles de un proyecto específico
 */
export const getProjectDetails = async (uuid: string): Promise<ProjectDetails> => {
  const response = await fetchWithAuthAndAutoRefresh(`${API_URL}/project/${uuid}`)

  console.log('📦 Project API Response:', JSON.stringify(response.data, null, 2))

  const project = response.data.project

  return {
    uuid_project: uuid,
    uuid_application: project.uuid_application || '',
    title: project.details.title,
    shortDescription: project.details.shortDescription,
    detailedDescription: project.details.description,
    estimatedDate: project.details.deadline,  
    createdAt: project.details.createdAt,
    approvedAt: project.details.approvedAt,
    status: project.details.status,
    bannerUrl: project.bannerUrl ? `${API_URL}${project.bannerUrl}` : null,
    attachments: project.appAttachments?.map((file: any) => ({
      uuid_file: file.uuid,
      filename: file.name,
      mimeType: file.type,
      size: file.size,
      url: `${API_URL}${file.downloadUrl}`,
    })) || [],
    author: {
      fullName: project.author?.fullName || 'Desconocido',
      firstName: project.author?.fullName?.split(' ')[0] || '',
      lastName: project.author?.fullName?.split(' ').slice(1).join(' ') || '',
      email: project.author?.email || null,
      organizationName: project.author?.outsider?.organizationName || null,
      phoneNumber: project.author?.outsider?.phoneNumber || null,
      location: project.author?.outsider?.location || null,
    },
    uuidCreator: project.details.uuidCreator,
    faculties: project.details.faculties || [],
    projectTypes: project.details.projectTypes || [],
    problemTypes: project.details.problemTypes || [],
    teamMembers: project.details.teamMembers || [],
    teamConstraints: project.teamConstraints || {},
    // Mapeo de recursos
    resources: project.resources?.map((resource: any) => ({
      uuid: resource.uuid_file,
      name: resource.name,
      type: resource.type,
      size: resource.size,
      downloadUrl: `${API_URL}${resource.downloadUrl}`,
      createdAt: resource.createdAt || new Date().toISOString(),
      deletedAt: resource.deletedAt || null,
      uuidAuthor: resource.uuidAuthor,
    })) || [],
  }
}

export const startProject = async (uuid: string) => {
  console.log('🚀 INICIANDO PROYECTO:', uuid)
  
  const response = await fetchWithAuthAndAutoRefresh(
    `${API_URL}/mobile/project/${uuid}/start`, 
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
  
  console.log('✅ RESPUESTA:', JSON.stringify(response, null, 2))
  return response.data
}

export const rollbackProject = async (uuid: string) => {
  const response = await fetchWithAuthAndAutoRefresh(`${API_URL}/mobile/project/${uuid}/rollback`, {
    method: 'POST',
  })
  return response.data
}

export const updateProjectDeadline = async (uuid: string, newDeadline: string) => {
  const response = await fetchWithAuthAndAutoRefresh(`${API_URL}/mobile/project/${uuid}/deadline`, {
    method: 'PATCH',
    body: JSON.stringify({ deadline: newDeadline }),
  })
  return response.data
}

/**
 * ============================================================================
 * FILE DOWNLOAD UTILITIES
 * ============================================================================
 */

export const downloadAllAttachments = async (attachments: any[]) => {
  const results = {
    successful: 0,
    failed: 0,
    errors: [] as string[],
  }

  for (const file of attachments) {
    try {
      results.successful++
    } catch (error: any) {
      results.failed++
      results.errors.push(`${file.filename}: ${error.message}`)
    }
  }

  return results
}

export const downloadFile = async (url: string, filename: string) => {
  console.log('Download requested:', filename, url)
  return url
}

/**
 * ============================================================================
 * TEAM MANAGEMENT ENDPOINTS
 * ============================================================================
 */

/**
 * Obtiene la metadata del equipo (roles disponibles y límites)
 */
export const getTeamMetadata = async (projectUuid: string) => {
  const response = await fetchWithAuthAndAutoRefresh(
    `${API_URL}/project/${projectUuid}/team/metadata`
  )
  return response.data
}

/**
 * Busca usuarios (profesores y estudiantes) para agregar al equipo
 */
export const searchMembers = async (query: string, limit: number = 10) => {
  if (!query || query.trim().length < 3) {
    return []
  }

  const response = await fetchWithAuthAndAutoRefresh(
    `${API_URL}/profile/search?q=${encodeURIComponent(query)}&limit=${limit}`
  )

  return response.data?.records || []
}

/**
 * Crea el equipo del proyecto
 */
export const createTeam = async (projectUuid: string, members: Array<{ uuidUser: string; roleId: number }>) => {
  const payload = { members }

  const response = await fetchWithAuthAndAutoRefresh(
    `${API_URL}/mobile/project/${projectUuid}/team/create`,
    {
      method: 'POST',
      body: JSON.stringify(payload),
    }
  )

  return response.data
}

/**
 * Actualiza el rol de un miembro del equipo
 */
export const updateTeamMemberRole = async (
  projectUuid: string,
  memberUuid: string,
  newRoleId: number
) => {
  const payload = { roleId: newRoleId }

  const response = await fetchWithAuthAndAutoRefresh(
    `${API_URL}/mobile/project/${projectUuid}/team/members/${memberUuid}`,
    {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }
  )

  return response.data
}

/**
 * Elimina un miembro del equipo
 */
export const deleteTeamMember = async (projectUuid: string, memberUuid: string) => {
  const response = await fetchWithAuthAndAutoRefresh(
    `${API_URL}/mobile/project/${projectUuid}/team/members/${memberUuid}`,
    {
      method: 'DELETE',
    }
  )

  return response.data
}

/**
 * ============================================================================
 * PROJECT RESOURCES ENDPOINTS
 * ============================================================================
 */

/**
 * Sube un nuevo recurso al proyecto
 */
export const uploadProjectResource = async (projectUuid: string, file: any) => {
  const formData = new FormData()
  
  formData.append('file', {
    uri: file.uri,
    type: file.mimeType || 'application/octet-stream',
    name: file.name || 'resource.bin',
  } as any)

  const response = await fetchWithAuthAndAutoRefresh(
    `${API_URL}/mobile/project/${projectUuid}/resources/file`,
    {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )

  return response.data
}

/**
 * Reemplaza un recurso existente
 */
export const updateProjectResource = async (
  projectUuid: string,
  resourceUuid: string,
  file: any
) => {
  const formData = new FormData()
  
  formData.append('file', {
    uri: file.uri,
    type: file.mimeType || 'application/octet-stream',
    name: file.name || 'resource.bin',
  } as any)

  const response = await fetchWithAuthAndAutoRefresh(
    `${API_URL}/mobile/project/${projectUuid}/resources/file/${resourceUuid}`,
    {
      method: 'PUT',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )

  return response.data
}

/**
 * Elimina un recurso del proyecto
 */
export const deleteProjectResource = async (projectUuid: string, resourceUuid: string) => {
  const response = await fetchWithAuthAndAutoRefresh(
    `${API_URL}/mobile/project/${projectUuid}/resources/file/${resourceUuid}`,
    {
      method: 'DELETE',
    }
  )

  return response.data
}