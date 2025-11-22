import { fetchWithAuthAndAutoRefresh } from "../../lib/api/client.js";
import { getCSRFToken } from "../projects/projectsService.js";

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Obtiene la metadata del equipo (roles disponibles y límites)
 * @param {string} projectUuid - UUID del proyecto
 * @returns {Promise<object>} Metadata con roles y límites
 */
export async function getTeamMetadata(projectUuid) {
  const response = await fetchWithAuthAndAutoRefresh(
    `${API_URL}/project/${projectUuid}/team/metadata`
  );
    
  return response.data;
}

/**
 * Obtiene el equipo actual del proyecto (usando GET /project/:uuid)
 * @param {string} projectUuid - UUID del proyecto
 * @returns {Promise<object>} Equipo con miembros
 */
export async function getTeam(projectUuid) {
  try {
    const response = await fetchWithAuthAndAutoRefresh(
      `${API_URL}/project/${projectUuid}`
    );
        
    // Extraer teamMembers de details
    const teamMembers = response.data.project?.details?.teamMembers || [];
    
    return {
      members: teamMembers.map(member => ({
        uuidUser: member.uuid_user,
        firstName: member.fullName.split(' ')[0] || '',
        middleName: '',
        lastName: member.fullName.split(' ').slice(1).join(' ') || '',
        email: member.email,
        universityId: member.universityId,
        roleName: member.role,
      }))
    };
    
  } catch (error) {
    console.error("Error fetching team:", error);
    
    // Si es 404, retornar equipo vacío
    if (error.statusCode === 404 || error.code === 'NOT_FOUND') {
      return { members: [] };
    }
    
    throw error;
  }
}

/**
 * Busca usuarios (profesores y estudiantes) para agregar al equipo
 * @param {string} query - Término de búsqueda (mínimo 3 caracteres)
 * @param {number} limit - Límite de resultados
 * @returns {Promise<Array>} Lista de usuarios
 */
export async function searchMembers(query, limit = 10) {
  if (!query || query.trim().length < 3) {
    return [];
  }

  const response = await fetchWithAuthAndAutoRefresh(
    `${API_URL}/profile/search?q=${encodeURIComponent(query)}&limit=${limit}`
  );
    
  return response.data?.records || [];
}

/**
 * Crea el equipo del proyecto
 * @param {string} projectUuid - UUID del proyecto
 * @param {Array} members - Lista de miembros [{uuidUser, roleId}]
 * @returns {Promise<object>} Equipo creado
 */
export async function createTeam(projectUuid, members) {
  const csrfToken = await getCSRFToken();

  const payload = { members };

  const response = await fetchWithAuthAndAutoRefresh(
    `${API_URL}/project/${projectUuid}/team/create`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
      },
      body: JSON.stringify(payload),
    }
  );
    
  return response.data;
}

/**
 * Actualiza el rol de un miembro del equipo
 * @param {string} projectUuid - UUID del proyecto
 * @param {string} memberUuid - UUID del miembro
 * @param {number} newRoleId - Nuevo ID del rol
 * @returns {Promise<object>} Miembro actualizado
 */
export async function updateTeamMemberRole(projectUuid, memberUuid, newRoleId) {
  const csrfToken = await getCSRFToken();

  const payload = { roleId: newRoleId };

  const response = await fetchWithAuthAndAutoRefresh(
    `${API_URL}/project/${projectUuid}/team/members/${memberUuid}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
      },
      body: JSON.stringify(payload),
    }
  );
    
  return response.data;
}

/**
 * Elimina un miembro del equipo
 * @param {string} projectUuid - UUID del proyecto
 * @param {string} memberUuid - UUID del miembro a eliminar
 * @returns {Promise<object>} Respuesta de eliminación
 */
export async function deleteTeamMember(projectUuid, memberUuid) {
  const csrfToken = await getCSRFToken();

  const response = await fetchWithAuthAndAutoRefresh(
    `${API_URL}/project/${projectUuid}/team/members/${memberUuid}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
      },
    }
  );
    
  return response.data;
}