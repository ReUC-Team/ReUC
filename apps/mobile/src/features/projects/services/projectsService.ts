// apps/mobile/src/features/projects/services/projectsService.ts

import { fetchWithAuthAndAutoRefresh } from '../../../lib/api/client'
import { API_URL } from '@env'

/**
 * Obtiene el token CSRF necesario para peticiones POST
 */
export async function getCSRFToken(): Promise<string> {
  try {
    const res = await fetch(`${API_URL}/csrf-token`, {
      credentials: 'include',
    })
    const { csrfToken } = await res.json()
    return csrfToken
  } catch (error) {
    console.error('Error getting CSRF token:', error)
    throw error
  }
}

/**
 * Obtiene metadata para crear una aplicación (facultades, tipos de proyecto, banners, etc.)
 */
export async function getCreateMetadata() {
  console.log('📋 getCreateMetadata called')
  console.log('📋 API_URL:', API_URL)
  console.log('📋 Full URL:', `${API_URL}/application/metadata/create`)

  try {
    const response = await fetchWithAuthAndAutoRefresh(
      `${API_URL}/application/metadata/create`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    )

    console.log('✅ Response received:', response)

    const metadata = response.data.metadata

    // Convertir URLs relativas a absolutas para los banners
    if (metadata.defaultBanners) {
      metadata.defaultBanners = metadata.defaultBanners.map((banner: any) => ({
        ...banner,
        url: banner.url?.startsWith('http')
          ? banner.url
          : `${API_URL}${banner.url}`,
      }))
    }

    console.log('✅ Metadata processed successfully')
    return metadata
  } catch (error) {
    console.error('❌ Error in getCreateMetadata:', error)
    console.error('❌ Error type:', error instanceof Error ? error.constructor.name : typeof error)
    console.error('❌ Error message:', error instanceof Error ? error.message : String(error))
    throw error
  }
}

/**
 * Crea una nueva aplicación/proyecto
 * @param formData - FormData con todos los campos del formulario
 */
export async function createApplication(formData: FormData) {
  const csrfToken = await getCSRFToken()

  const response = await fetchWithAuthAndAutoRefresh(
    `${API_URL}/mobile/application/create`,
    {
      method: 'POST',
      headers: {
        'csrf-token': csrfToken,
        // NO incluir Content-Type - fetch lo agrega automáticamente para FormData
      },
      body: formData,
    }
  )

  return response.data
}

/**
 * Obtiene metadata para explorar aplicaciones (facultades disponibles)
 */
export async function getExploreApplicationsMetadata() {
  const response = await fetchWithAuthAndAutoRefresh(
    `${API_URL}/application/metadata/explore`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
  )

  return response.data
}

/**
 * Explora aplicaciones con filtros opcionales
 * @param facultyName - Nombre/abreviación de facultad para filtrar (opcional)
 * @param page - Número de página
 * @param perPage - Items por página
 */
export async function exploreApplications(
  facultyName: string | null = null,
  page: number = 1,
  perPage: number = 9
) {
  // Construir URL base
  let url = `${API_URL}/application/explore`
  
  // Agregar facultad como path parameter si existe
  if (facultyName) {
    url += `/${facultyName}`
  }
  
  // Agregar query parameters
  url += `?page=${page}&perPage=${perPage}`

  const response = await fetchWithAuthAndAutoRefresh(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })

  const records = response.data.applications.records
  const paginationData = response.data.applications.metadata.pagination

  // Convertir URLs relativas a absolutas
  const applications = records.map((app: any) => ({
    ...app,
    bannerUrl: app.bannerUrl?.startsWith('http')
      ? app.bannerUrl
      : app.bannerUrl
      ? `${API_URL}${app.bannerUrl}`
      : null,
  }))

  return {
    applications,
    pagination: paginationData,
  }
}

/**
 * Obtiene los detalles de una aplicación específica
 * @param uuid - UUID de la aplicación
 */
export async function getApplicationDetails(uuid: string) {
  const response = await fetchWithAuthAndAutoRefresh(
    `${API_URL}/application/${uuid}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
  )

  const app = response.data.application

  return {
    uuid_application: app.uuid_application,
    
    // Información básica
    title: app.details?.title || 'Sin título',
    shortDescription: app.details?.shortDescription || 'Sin descripción corta',
    detailedDescription:
      app.details?.description ||
      app.details?.shortDescription ||
      'Sin descripción',

    // Fechas
    deadline: app.details?.deadline,
    createdAt: app.createdAt,
    status: app.status || 'pending',

    // Banner
    bannerUrl: app.bannerUrl?.startsWith('http')
      ? app.bannerUrl
      : app.bannerUrl
      ? `${API_URL}${app.bannerUrl}`
      : null,

    // Attachments
    attachments: (app.attachments || []).map((a: any) => ({
      downloadUrl: a.downloadUrl?.startsWith('http')
        ? a.downloadUrl
        : `${API_URL}${a.downloadUrl}`,
      name: a.name,
      size: a.size,
      type: a.type,
    })),

    // Autor (genérico - puede ser outsider o professor)
    author: {
      fullName: app.author?.fullName || 'No especificado',
      firstName: app.author?.fullName?.split(' ')[0] || 'No especificado',
      lastName: app.author?.fullName?.split(' ').slice(1).join(' ') || '',
      email: app.author?.email || null,
      organizationName: app.author?.organizationName || null,
      phoneNumber: app.author?.phoneNumber || null,
      location: app.author?.location || null,
    },

    // Arrays
    faculties: app.details?.faculties || [],
    projectTypes: app.details?.projectTypes || [],
    problemTypes: app.details?.problemTypes || [],
  }
}

/**
 * Obtiene las aplicaciones (solicitudes) del usuario autenticado
 * @param page - Número de página
 * @param perPage - Items por página
 */
export async function getMyApplications(page: number = 1, perPage: number = 9) {
  const url = `${API_URL}/application/my-applications?page=${page}&perPage=${perPage}`

  const response = await fetchWithAuthAndAutoRefresh(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })

  const records = response.data.applications.records
  const paginationData = response.data.applications.metadata.pagination

  // Convertir URLs relativas a absolutas
  const applications = records.map((app: any) => ({
    ...app,
    bannerUrl: app.bannerUrl?.startsWith('http')
      ? app.bannerUrl
      : app.bannerUrl
      ? `${API_URL}${app.bannerUrl}`
      : null,
  }))

  return {
    applications,
    pagination: paginationData,
  }
}

/**
 * Obtiene los proyectos aprobados del usuario autenticado
 * @param page - Número de página
 * @param perPage - Items por página
 */
export async function getMyProjects(page: number = 1, perPage: number = 9) {
  const url = `${API_URL}/project/my-projects?page=${page}&perPage=${perPage}`

  const response = await fetchWithAuthAndAutoRefresh(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })

  const records = response.data.projects.records
  const paginationData = response.data.projects.metadata.pagination

  // Convertir URLs relativas a absolutas
  const projects = records.map((project: any) => ({
    ...project,
    bannerUrl: project.bannerUrl?.startsWith('http')
      ? project.bannerUrl
      : project.bannerUrl
      ? `${API_URL}${project.bannerUrl}`
      : null,
  }))

  return {
    projects,
    pagination: paginationData,
  }
}

/**
 * Obtiene los detalles de un proyecto aprobado
 * Nota: Los proyectos heredan datos de su aplicación original
 * @param uuid - UUID del proyecto (que es el mismo UUID de la aplicación original)
 */
export async function getProjectDetails(uuid: string) {
  // Los proyectos usan el mismo endpoint que las aplicaciones
  // porque heredan todos los datos de la aplicación original
  return await getApplicationDetails(uuid)
}

/**
 * Descarga un archivo desde una URL
 * @param url - URL del archivo
 * @param filename - Nombre del archivo
 */
export async function downloadFile(url: string, filename: string) {
  try {
    // En React Native, abrir el archivo en el navegador
    const { Linking } = await import('react-native')
    await Linking.openURL(url)
  } catch (error) {
    console.error('Error downloading file:', error)
    throw error
  }
}

/**
 * Descarga todos los archivos adjuntos
 * @param attachments - Array de attachments
 */
export async function downloadAllAttachments(attachments: any[]) {
  const results = {
    successful: 0,
    failed: 0,
    errors: [] as string[],
  }

  for (const attachment of attachments) {
    try {
      await downloadFile(attachment.downloadUrl, attachment.name)
      results.successful++
    } catch (error: any) {
      results.failed++
      results.errors.push(`${attachment.name}: ${error.message}`)
    }
  }

  return results
}

// ============================================
// FUNCIONES LEGACY (mantener compatibilidad)
// ============================================

export async function create(data: any) {
  try {
    const csrfToken = await getCSRFToken()

    const res = await fetch(`${API_URL}/project/create`, {
      method: 'POST',
      headers: {
        'X-CSRF-Token': csrfToken,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    })

    const bodyRes = await res.json()

    if (!res.ok) {
      if (res.status === 403)
        return { success: false, err: bodyRes.err, logout: true }

      return { success: false, err: bodyRes.err, logout: false }
    }

    return { success: true, data: bodyRes.data.application }
  } catch (error: any) {
    return { success: false, err: error.message, logout: false }
  }
}

export async function getProjects() {
  try {
    const res = await fetch(`${API_URL}/projects`, {
      credentials: 'include',
    })

    const bodyRes = await res.json()

    if (!res.ok) {
      return { success: false, err: bodyRes.err }
    }

    return { success: true, data: bodyRes.data }
  } catch (error: any) {
    return { success: false, err: error.message }
  }
}

export async function getProjectById(id: string) {
  try {
    const res = await fetch(`${API_URL}/projects/${id}`, {
      credentials: 'include',
    })

    const bodyRes = await res.json()

    if (!res.ok) {
      return { success: false, err: bodyRes.err }
    }

    return { success: true, data: bodyRes.data }
  } catch (error: any) {
    return { success: false, err: error.message }
  }
}

export async function updateProject(id: string, data: any) {
  try {
    const csrfToken = await getCSRFToken()

    const res = await fetch(`${API_URL}/projects/${id}`, {
      method: 'PUT',
      headers: {
        'X-CSRF-Token': csrfToken,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    })

    const bodyRes = await res.json()

    if (!res.ok) {
      return { success: false, err: bodyRes.err }
    }

    return { success: true, data: bodyRes.data }
  } catch (error: any) {
    return { success: false, err: error.message }
  }
}

export async function deleteProject(id: string) {
  try {
    const csrfToken = await getCSRFToken()

    const res = await fetch(`${API_URL}/projects/${id}`, {
      method: 'DELETE',
      headers: {
        'X-CSRF-Token': csrfToken,
      },
      credentials: 'include',
    })

    const bodyRes = await res.json()

    if (!res.ok) {
      return { success: false, err: bodyRes.err }
    }

    return { success: true }
  } catch (error: any) {
    return { success: false, err: error.message }
  }
}

export async function toggleFavorite(projectId: string) {
  try {
    const csrfToken = await getCSRFToken()

    const res = await fetch(`${API_URL}/projects/${projectId}/favorite`, {
      method: 'POST',
      headers: {
        'X-CSRF-Token': csrfToken,
      },
      credentials: 'include',
    })

    const bodyRes = await res.json()

    if (!res.ok) {
      return { success: false, err: bodyRes.err }
    }

    return { success: true, data: bodyRes.data }
  } catch (error: any) {
    return { success: false, err: error.message }
  }
}