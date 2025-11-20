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
 * @param {string|null} facultyName - Nombre/abreviación de facultad para filtrar (ej: "FIE")
 * @param {number} page - Número de página (empieza en 1)
 * @param {number} limit - Items por página
 * @returns {Promise<{applications: Array, pagination: object}>}
 * @throws {ApplicationError}
 */
export async function exploreApplications(facultyName = null, page = 1, limit = 9) {
  // Construir URL base
  let url = `${API_URL}/application/explore`;
  
  // Si hay facultad, agregarla al path
  if (facultyName) {
    url += `/${facultyName}`;
  }
  
  // Agregar query params de paginación
  url += `?page=${page}&perPage=${limit}`;

  const response = await fetchWithAuthAndAutoRefresh(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const records = response.data.applications.records;
  const paginationData = response.data.applications.metadata.pagination;

  const applications = records.map((app) => ({
    ...app,
    bannerUrl: app.bannerUrl?.startsWith('http') 
      ? app.bannerUrl 
      : app.bannerUrl ? `${API_URL}${app.bannerUrl}` : null,
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
  
  if (metadata.defaultBanners) {
    metadata.defaultBanners = metadata.defaultBanners.map((banner) => ({
      ...banner,
      url: banner.url?.startsWith('http') 
        ? banner.url 
        : `${API_URL}${banner.url}`,
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

  const response = await fetchWithAuthAndAutoRefresh(
    `${API_URL}/application/create`,
    {
      method: "POST",
      headers: {
        "csrf-token": csrfToken,
      },
      body: formData,
    }
  );

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

  return {

    uuid_application: uuid,
    // Información básica del proyecto
    title: app.details?.title || 'Sin título',
    shortDescription: app.details?.shortDescription || 'Sin descripción corta',
    detailedDescription: app.details?.description || app.details?.shortDescription || 'Sin descripción',
    
    // Fechas
    dueDate: app.details?.deadline,
    createdAt: app.createdAt,
    status: app.status || 'pending',
    
    // Banner con verificación de URL absoluta
    bannerUrl: app.bannerUrl?.startsWith('http') 
      ? app.bannerUrl 
      : app.bannerUrl ? `${API_URL}${app.bannerUrl}` : null,
    
    // Attachments
    attachments: (app.attachments || []).map((a) => ({
      downloadUrl: a.downloadUrl?.startsWith('http') 
        ? a.downloadUrl 
        : `${API_URL}${a.downloadUrl}`,
      name: a.name, // ← Este es el nombre ORIGINAL del archivo
      size: a.size,
      type: a.type,
    })),
    
    // Información del autor
    author: {
      uuid_user: app.author?.uuid_user,
      firstName: app.author?.fullName?.split(' ')[0] || 'No especificado',
      lastName: app.author?.fullName?.split(' ').slice(1).join(' ') || '',
      email: app.author?.email || null,
      outsider: app.author?.outsider ? {
        organizationName: app.author.outsider.organizationName,
        phoneNumber: app.author.outsider.phoneNumber,
        location: app.author.outsider.location,
      } : null,
    },

    faculties: app.details?.faculties || [],  // [{ id: 1, name: "Ingeniería" }]
    projectTypes: app.details?.projectTypes || [],  // [{ id: 3, name: "Investigación" }]
    problemTypes: app.details?.problemTypes || [],  // [{ id: 5, name: "Ambiental" }]
    
    facultyIds: (app.details?.faculties || []).map(f => f.id),
    projectTypeIds: (app.details?.projectTypes || []).map(pt => pt.id),
    problemTypeIds: (app.details?.problemTypes || []).map(pt => pt.id),
    
    
    outsider: {
      firstName: app.author?.fullName?.split(' ')[0] || 'No especificado',
      lastName: app.author?.fullName?.split(' ').slice(1).join(' ') || '',
      email: app.author?.email || null,
      company: app.author?.outsider?.organizationName || 'No especificado',
      phone: app.author?.outsider?.phoneNumber || 'No especificado',
      location: app.author?.outsider?.location || 'No especificado',
    },
    
    // Facultad (legacy)
    faculty: app.details?.faculties?.length > 0 
      ? { 
          name: app.details.faculties[0].name, 
          abbreviation: app.details.faculties[0].name 
        }
      : null,
  };
}

/**
 * Descarga un archivo individual y lo abre en nueva pestaña o descarga según el tipo
 * @param {string} downloadUrl - URL del archivo con ticket
 * @param {string} fileName - Nombre del archivo
 * @param {string} mimeType - Tipo MIME del archivo
 * @param {boolean} forceDownload - Si es true, fuerza la descarga en lugar de abrir
 * @returns {Promise<void>}
 */
export async function downloadFile(downloadUrl, fileName, mimeType, forceDownload = false) {
  try {
    
    // Agregar credentials: 'include' para enviar cookies de sesión
    const response = await fetch(downloadUrl, {
      method: 'GET',
      credentials: 'include', // Envía cookies de autenticación
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${response.statusText || errorText}`);
    }

    const blob = await response.blob();

    // Si es PDF y NO se fuerza la descarga, abrir en nueva pestaña
    if (mimeType === 'application/pdf' && !forceDownload) {
      const objectUrl = URL.createObjectURL(blob);
      const newWindow = window.open(objectUrl, '_blank');
      
      if (!newWindow) {
        throw new Error('No se pudo abrir la ventana. Verifica que tu navegador permita ventanas emergentes.');
      }
      
      // Limpiar después de un tiempo para liberar memoria
      setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
      return;
    }

    // Para otros archivos o descarga forzada, descargar con nombre original
    const link = document.createElement('a');
    const objectUrl = URL.createObjectURL(blob);
    
    link.href = objectUrl;
    link.download = fileName; // Usa el nombre ORIGINAL
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    
    // Limpiar
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);
    }, 100);
    
  } catch (error) {
    throw new Error(`No se pudo descargar el archivo: ${error.message}`);
  }
}

/**
 * Descarga todos los archivos adjuntos de un proyecto
 * @param {Array} attachments - Array de objetos con downloadUrl, name, type
 * @returns {Promise<{successful: number, failed: number, errors: Array}>}
 */
export async function downloadAllAttachments(attachments) {
  if (!attachments || attachments.length === 0) {
    throw new Error('No hay archivos para descargar');
  }

  let successful = 0;
  let failed = 0;
  const errors = [];

  // Descargar archivos secuencialmente con delay
  for (let i = 0; i < attachments.length; i++) {
    const file = attachments[i];
    
    try {
      
      await downloadFile(file.downloadUrl, file.name, file.type, true);
      successful++;
      
      // Delay entre descargas para evitar bloqueo del navegador
      if (i < attachments.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 800)); // 800ms de delay
      }
    } catch (error) {
      failed++;
      const errorMessage = `${file.name}: ${error.message}`;
      errors.push(errorMessage);
    }
  }
  
  return { successful, failed, errors };
}

// Línea 277-330: REEMPLAZAR función approveApplication

/**
 * Aprueba una Application y crea un Project
 * @param {string} uuid_application - UUID de la Application a aprobar
 * @param {object} projectData - Datos del proyecto
 * @returns {Promise<object>} Project creado
 * @throws {ValidationError|ApplicationError}
 */
export async function approveApplication(uuid_application, projectData = {}) {
  const csrfToken = await getCSRFToken();

  // ✅ CORRECCIÓN: El backend espera estos nombres de campos
  const payload = {
    uuidApplication: uuid_application,
    title: projectData.title,
    shortDescription: projectData.shortDescription,
    description: projectData.description,
    estimatedDate: projectData.estimatedDate,
    
    // ✅ CAMBIOS CRÍTICOS:
    projectTypeId: projectData.projectType?.[0] || null,  // ← Tomar el primer elemento (singular)
    facultyIds: projectData.faculty || [],                 // ← Renombrar a facultyIds (plural)
    problemTypeIds: projectData.problemType || [],         // ← Renombrar a problemTypeIds (plural)
  };

  console.log("📤 Payload enviado a /project/create:", payload);

  const response = await fetchWithAuthAndAutoRefresh(
    `${API_URL}/project/create`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "csrf-token": csrfToken,
      },
      body: JSON.stringify(payload),
    }
  );

  return response.data;
}

/**
 * Obtiene todas las applications del usuario autenticado
 * @param {number} page - Número de página
 * @param {number} limit - Items por página
 * @returns {Promise<{applications: Array, pagination: object}>}
 * @throws {ApplicationError}
 */
export async function getMyApplications(page = 1, limit = 9) {
  const response = await fetchWithAuthAndAutoRefresh(
    `${API_URL}/application/my-applications?page=${page}&perPage=${limit}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

  const records = response.data.applications.records;
  const paginationData = response.data.applications.metadata.pagination;

  const applications = records.map((app) => ({
    ...app,
    bannerUrl: app.bannerUrl?.startsWith('http') 
      ? app.bannerUrl 
      : app.bannerUrl ? `${API_URL}${app.bannerUrl}` : null,
  }));

  return {
    applications,
    pagination: paginationData,
  };
}

/**
 * Obtiene todos los proyectos aprobados del usuario autenticado
 * @param {number} page - Número de página
 * @param {number} limit - Items por página
 * @returns {Promise<{projects: Array, pagination: object}>}
 * @throws {ApplicationError}
 */
export async function getMyProjects(page = 1, limit = 9) {
  const response = await fetchWithAuthAndAutoRefresh(
    `${API_URL}/project/my-projects?page=${page}&perPage=${limit}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

  const records = response.data.projects.records;
  const paginationData = response.data.projects.metadata.pagination;

  // Convertir URLs relativas a absolutas
  const projects = records.map((proj) => ({
    ...proj,
    bannerUrl: proj.bannerUrl?.startsWith('http') 
      ? proj.bannerUrl 
      : proj.bannerUrl ? `${API_URL}${proj.bannerUrl}` : null,
  }));

  return {
    projects,
    pagination: paginationData,
  };
}
/**
 * Obtiene los detalles completos de un proyecto específico
 * @param {string} uuid - UUID del proyecto
 * @returns {Promise<Object>} Detalles del proyecto
 * @throws {ApplicationError}
 */
export async function getProjectDetails(uuid) {
  // Hice uso del endpoint de Application porque Project hereda sus datos
  // El backend aún no tiene GET /project/:uuid implementado
  
  const response = await fetchWithAuthAndAutoRefresh(
    `${API_URL}/application/${uuid}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

  const app = response.data.application;

  // Normalizar estructura para ProjectDetails.jsx
  return {
    uuid_project: app.uuid_application,
    title: app.details?.title || 'Sin título',
    description: app.details?.description || app.details?.shortDescription || 'Sin descripción',
    shortDescription: app.details?.shortDescription || 'Sin descripción corta',
    
    // Banner
    bannerUrl: app.bannerUrl?.startsWith('http')
      ? app.bannerUrl
      : app.bannerUrl ? `${API_URL}${app.bannerUrl}` : null,
    
    // Attachments
    attachments: (app.attachments || []).map(att => ({
      downloadUrl: att.downloadUrl?.startsWith('http') 
        ? att.downloadUrl 
        : `${API_URL}${att.downloadUrl}`,
      name: att.name,
      size: att.size,
      type: att.type,
    })),
    
    // Autor
    author: {
      uuid_user: app.author?.uuid_user,
      firstName: app.author?.fullName?.split(' ')[0] || 'No especificado',
      lastName: app.author?.fullName?.split(' ').slice(1).join(' ') || '',
      email: app.author?.email,
      outsider: app.author?.outsider ? {
        organizationName: app.author.outsider.organizationName,
        phoneNumber: app.author.outsider.phoneNumber,
        location: app.author.outsider.location,
      } : null,
    },
    
    // Metadata
    faculties: app.details?.faculties || [],
    projectTypes: app.details?.projectTypes || [],
    problemTypes: app.details?.problemTypes || [],
    
    // Fechas y estado
    createdAt: app.createdAt,
    estimatedDate: app.details?.deadline,
    status: app.status || 'approved', // Projects son applications aprobadas
  };
}

/**
 * Edita una Application existente (solo metadata)
 * @param {string} uuid - UUID de la Application
 * @param {object} editData - Datos a editar
 * @param {Array<number>} editData.projectType - IDs de tipos de proyecto
 * @param {Array<number>} editData.faculty - IDs de facultades
 * @param {Array<number>} editData.problemType - IDs de tipos de problemática
 * @param {string|null} editData.problemTypeOther - Descripción si "Otro" está seleccionado
 * @param {string} editData.deadline - Nueva fecha límite (YYYY-MM-DD)
 * @param {string} editData.editReason - Razón de la edición
 * @returns {Promise<object>} Application actualizada
 * @throws {ValidationError|ApplicationError}
 */
export async function editApplication(uuid, editData) {
  const csrfToken = await getCSRFToken();

  const response = await fetchWithAuthAndAutoRefresh(
    `${API_URL}/application/${uuid}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "csrf-token": csrfToken,
      },
      body: JSON.stringify({
        projectType: editData.projectType,
        faculty: editData.faculty,
        problemType: editData.problemType,
        problemTypeOther: editData.problemTypeOther,
        deadline: editData.deadline,
        editReason: editData.editReason,
      }),
    }
  );

  return response.data;
}