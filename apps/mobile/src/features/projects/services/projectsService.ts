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
  console.log('🔍 getCreateMetadata called')
  console.log('🔍 API_URL:', API_URL)
  console.log('🔍 Full URL:', `${API_URL}/application/metadata/create`)

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
 * @param facultyId - ID de facultad para filtrar (opcional)
 * @param page - Número de página
 * @param limit - Items por página
 */
export async function exploreApplications(
  facultyId: number | null = null,
  page: number = 1,
  limit: number = 9
) {
  let url = `${API_URL}/application/explore?page=${page}&limit=${limit}`

  if (facultyId) {
    url += `&facultyId=${facultyId}`
  }

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
    // Información básica
    title: app.details?.title || 'Sin título',
    shortDescription: app.details?.shortDescription || 'Sin descripción corta',
    detailedDescription:
      app.details?.description ||
      app.details?.shortDescription ||
      'Sin descripción',

    // Fechas
    dueDate: app.details?.deadline,
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

    // Autor
    outsider: {
      firstName: app.author?.fullName?.split(' ')[0] || 'No especificado',
      lastName: app.author?.fullName?.split(' ').slice(1).join(' ') || '',
      email: app.author?.email || null,
      company: app.author?.organizationName || 'No especificado',
      phone: app.author?.phoneNumber || 'No especificado',
      location: app.author?.location || 'No especificado',
    },

    // Facultad
    faculty:
      app.details?.faculties?.length > 0
        ? {
            name: app.details.faculties[0],
            abbreviation: app.details.faculties[0],
          }
        : null,

    // Arrays
    faculties: app.details?.faculties || [],
    projectTypes: app.details?.projectTypes || [],
    problemTypes: app.details?.problemTypes || [],
  }
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