import { fetchWithAuthAndAutoRefresh } from "../../lib/api/client";

const API_URL = import.meta.env.VITE_API_URL;

export async function getCSRFToken() {
  const res = await fetch(`${API_URL}/csrf-token`, {
    credentials: "include",
  });

  const { csrfToken } = await res.json();

  return csrfToken;
}

/**
 * Obtiene metadata para explorar aplicaciones (facultades disponibles)
 * @returns {Promise<object>} Metadata con facultades
 * @throws {ApplicationError}
 */
export async function getExploreApplicationsMetadata() {
  const response = await fetchWithAuthAndAutoRefresh(
    `${API_URL}/application/metadata/explore`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

  return response.data;
}

/**
 * Explora aplicaciones con filtros opcionales
 * @param {number|null} facultyId - ID de facultad para filtrar
 * @param {number} page - Número de página (empieza en 1)
 * @param {number} limit - Items por página
 * @returns {Promise<{applications: Array, pagination: object}>}
 * @throws {ApplicationError}
 */
export async function exploreApplications(facultyId = null, page = 1, limit = 9) {
  let url = `${API_URL}/application/explore?page=${page}&limit=${limit}`;
  
  if (facultyId) {
    url += `&facultyId=${facultyId}`;
  }

  const response = await fetchWithAuthAndAutoRefresh(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const records = response.data.applications.records;
  const paginationData = response.data.applications.metadata.pagination;

  // Procesar aplicaciones: convertir URLs relativas a absolutas
  const applications = records.map((app) => ({
    ...app,
    bannerUrl: app.bannerUrl ? `${API_URL}${app.bannerUrl}` : null,
  }));

  return {
    applications,
    pagination: paginationData,
  };
}

/**
 * Obtiene metadata para crear una aplicación
 * @returns {Promise<object>} Metadata con facultades, tipos de proyecto, etc.
 * @throws {ApplicationError}
 */
export async function getCreateMetadata() {
  const response = await fetchWithAuthAndAutoRefresh(
    `${API_URL}/application/metadata/create`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

  const metadata = response.data.metadata;
  
  // Convertir URLs de banners a absolutas
  if (metadata.defaultBanners) {
    metadata.defaultBanners = metadata.defaultBanners.map((banner) => ({
      ...banner,
      url: `${API_URL}${banner.url}`,
    }));
  }

  return metadata;
}

/**
 * Crea una nueva aplicación
 * @param {FormData} formData - Datos del formulario
 * @returns {Promise<object>} Aplicación creada
 * @throws {ValidationError|ApplicationError}
 */
export async function createApplication(formData) {
  const csrfToken = await getCSRFToken();

  console.log('📤 Creating application with FormData'); // DEBUG
  console.log('🔑 CSRF Token:', csrfToken); // DEBUG

  // ✅ NO establecer Content-Type cuando se envía FormData
  // El navegador lo hará automáticamente con el boundary correcto
  const response = await fetchWithAuthAndAutoRefresh(
    `${API_URL}/application/create`,
    {
      method: "POST",
      headers: {
        "csrf-token": csrfToken,
        // ❌ NO agregar "Content-Type": "application/json"
        // ❌ NO agregar "Content-Type": "multipart/form-data"
      },
      body: formData, // ✅ Enviar FormData directamente
    }
  );

  console.log('✅ Application created:', response.data); // DEBUG

  return response.data;
}

/**
 * Obtiene el estado del perfil del usuario
 * @returns {Promise<{status: {isComplete: boolean}}>}
 * @throws {AuthenticationError|ApplicationError}
 */
export async function getProfileStatus() {
  const response = await fetchWithAuthAndAutoRefresh(
    `${API_URL}/profile/status`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

  return response.data;
}

/**
 * Obtiene los detalles de una aplicación específica
 * @param {string} uuid - UUID de la aplicación
 * @returns {Promise<object>} Detalles completos de la aplicación
 * @throws {NotFoundError|ApplicationError}
 */
export async function getApplicationDetails(uuid) {
  const response = await fetchWithAuthAndAutoRefresh(
    `${API_URL}/application/${uuid}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

  const app = response.data.application;


  // Mapear la estructura del backend a la estructura esperada por el frontend
  return {
    // Información básica del proyecto
    title: app.details?.title || 'Sin título',
    shortDescription: app.details?.shortDescription || 'Sin descripción corta',
    detailedDescription: app.details?.description || app.details?.shortDescription || 'Sin descripción',
    
    // Fechas
    dueDate: app.details?.deadline,
    createdAt: app.createdAt,
    
    // Estado (asumiendo que no viene en la respuesta actual)
    status: app.status || 'pending',
    
    // Banner
    bannerUrl: app.bannerUrl ? `${API_URL}${app.bannerUrl}` : null,
    
    // Adjuntos
    attachments: (app.attachments || []).map((a) => ({
      ...a,
      url: `${API_URL}${a.url}`,
    })),
    
    // Mapear author → outsider (para mantener compatibilidad con el componente)
    outsider: {
      firstName: app.author?.fullName?.split(' ')[0] || 'No especificado',
      lastName: app.author?.fullName?.split(' ').slice(1).join(' ') || '',
      email: app.author?.email || null,
      company: app.author?.organizationName || 'No especificado',
      phone: app.author?.phoneNumber || 'No especificado',
      location: app.author?.location || 'No especificado',
    },
    
    // Tomar la primera facultad del array (si solo se muestra una)
    faculty: app.details?.faculties?.length > 0 
      ? { 
          name: app.details.faculties[0], 
          abbreviation: app.details.faculties[0] 
        }
      : null,
    
    // Arrays directos
    faculties: app.details?.faculties || [],
    projectTypes: app.details?.projectTypes || [],
    problemTypes: app.details?.problemTypes || [],
  };
}