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
    createdAt: app.details?.createdAt,
    
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
      name: a.name,
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

    // Metadata (arrays de objetos con id y name)
    faculties: app.details?.faculties || [],  
    projectTypes: app.details?.projectTypes || [],
    problemTypes: app.details?.problemTypes || [],
    
    // Arrays de IDs (para el modal de edición)
    facultyIds: (app.details?.faculties || []).map(f => f.id),
    projectTypeIds: (app.details?.projectTypes || []).map(pt => pt.id),
    problemTypeIds: (app.details?.problemTypes || []).map(pt => pt.id),
    
    // Outsider (legacy, para compatibilidad)
    outsider: {
      firstName: app.author?.fullName?.split(' ')[0] || 'No especificado',
      lastName: app.author?.fullName?.split(' ').slice(1).join(' ') || '',
      email: app.author?.email || null,
      company: app.author?.outsider?.organizationName || 'No especificado',
      phone: app.author?.outsider?.phoneNumber || 'No especificado',
      location: app.author?.outsider?.location || 'No especificado',
    },
    
    // Facultad (legacy, para compatibilidad)
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
 */
export async function downloadFile(downloadUrl, fileName, mimeType, forceDownload = false) {
  try {
    const response = await fetch(downloadUrl, {
      method: 'GET',
      credentials: 'include',
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
      
      setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
      return;
    }

    // Para otros archivos o descarga forzada, descargar con nombre original
    const link = document.createElement('a');
    const objectUrl = URL.createObjectURL(blob);
    
    link.href = objectUrl;
    link.download = fileName;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    
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
        await new Promise(resolve => setTimeout(resolve, 800));
      }
    } catch (error) {
      failed++;
      const errorMessage = `${file.name}: ${error.message}`;
      errors.push(errorMessage);
    }
  }
  
  return { successful, failed, errors };
}

/**
 * Aprueba una Application y crea un Project
 */
export async function approveApplication(uuid_application, projectData = {}) {
  const csrfToken = await getCSRFToken();

  const payload = {
    uuidApplication: uuid_application,
    title: projectData.title,
    shortDescription: projectData.shortDescription,
    description: projectData.description,
    deadline: projectData.deadline || projectData.estimatedDate,
    projectType: Array.isArray(projectData.projectType) 
      ? projectData.projectType[0]
      : projectData.projectType,
    problemType: projectData.problemType || [],
    faculty: projectData.faculty,
  };

  if (projectData.problemTypeOther !== undefined && projectData.problemTypeOther !== null) {
    payload.problemTypeOther = projectData.problemTypeOther;
  }

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
 */
export async function getProjectDetails(uuid) {
  const response = await fetchWithAuthAndAutoRefresh(
    `${API_URL}/project/${uuid}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

  const proj = response.data.project;
  const details = proj.details || {};
  const author = proj.author || {};

  return {
    uuid_project: proj.uuid_project,
    uuidApplication: proj.uuidApplication,

    // Información básica
    title: details.title || 'Sin título',
    description: details.description || 'Sin descripción',
    shortDescription: details.shortDescription || 'Sin descripción corta',
    
    // Banner
    bannerUrl: proj.bannerUrl?.startsWith('http')
      ? proj.bannerUrl
      : proj.bannerUrl ? `${API_URL}${proj.bannerUrl}` : null,
    
    // Attachments
    attachments: (proj.appAttachments || []).map(att => ({
      downloadUrl: att.downloadUrl?.startsWith('http') 
        ? att.downloadUrl 
        : `${API_URL}${att.downloadUrl}`,
      name: att.name,
      size: att.size,
      type: att.type,
    })),
    
    // Autor
    author: {
      uuid_user: author.uuid_user,
      firstName: author.fullName?.split(' ')[0] || 'No especificado',
      lastName: author.fullName?.split(' ').slice(1).join(' ') || '',
      fullName: author.fullName || 'No especificado',
      email: author.email,
      universityId: author.universityId,
      roleName: author.roleName,
      outsider: author.outsider ? {
        organizationName: author.outsider.organizationName,
        phoneNumber: author.outsider.phoneNumber,
        location: author.outsider.location,
      } : null,
    },
    
    // Metadata del proyecto
    projectTypes: details.projectTypes || [],
    faculties: details.faculties || [],
    problemTypes: details.problemTypes || [],
    
    // Team members
    teamMembers: (details.teamMembers || []).map(member => ({
      uuid_user: member.uuid_user,
      fullName: member.fullName,
      email: member.email,
      universityId: member.universityId,
      role: member.role,
    })),
    
    // Estado
    status: details.status?.name || 'approved',
    statusDescription: details.status?.description,
    
    // Fechas
    createdAt: details.createdAt,
    estimatedDate: details.deadline,
    estimatedEffortHours: details.estimatedEffortHours || null,
  };
}

/**
 * Edita una Application existente (solo metadata)
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

/**
 * Actualiza una Application existente (solo metadata)
 */
export async function updateApplication(uuid, editData) {
  const csrfToken = await getCSRFToken();

  const payload = {
    title: editData.title,
    shortDescription: editData.shortDescription,
    description: editData.description,
    deadline: editData.deadline,
  };

  if (editData.projectType !== undefined) {
    payload.projectType = Array.isArray(editData.projectType) 
      ? editData.projectType[0]
      : editData.projectType;
  }

  if (editData.faculty !== undefined) {
    payload.faculty = editData.faculty;
  }

  if (editData.problemType !== undefined) {
    payload.problemType = editData.problemType;
  }

  if (editData.problemTypeOther !== undefined && editData.problemTypeOther !== null) {
    payload.problemTypeOther = editData.problemTypeOther;
  }

  const response = await fetchWithAuthAndAutoRefresh(
    `${API_URL}/application/${uuid}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "csrf-token": csrfToken,
      },
      body: JSON.stringify(payload),
    }
  );

  return response.data;
}
