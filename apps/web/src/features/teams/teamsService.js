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
  
  console.log("📊 Team Metadata Response:", response);
  
  return response.data;
}

/**
 * Obtiene el equipo actual del proyecto
 * @param {string} projectUuid - UUID del proyecto
 * @returns {Promise<object>} Equipo con miembros
 */
export async function getTeam(projectUuid) {
  try {
    const response = await fetchWithAuthAndAutoRefresh(
      `${API_URL}/project/${projectUuid}/team`
    );
    
    console.log("👥 Current Team Response:", response);
    
    return response.data;
  } catch (error) {
    // Si el endpoint no existe, lanzar error específico
    if (error.message?.includes("Cannot GET") || error.message?.includes("<!DOCTYPE")) {
      console.warn("⚠️ El endpoint GET /team no está implementado todavía");
      throw new Error("Endpoint not implemented");
    }
    
    // Si es 404, retornar equipo vacío
    if (error.statusCode === 404) {
      console.warn("⚠️ Team not found (404), returning empty team");
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
  
  console.log("🔍 Search Members Response:", response);
  
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

  // Intentar diferentes formatos
  const payloads = [
    // Formato 1: Objeto con members
    { members },
    // Formato 2: Array directo
    members,
    // Formato 3: Con snake_case
    {
      members: members.map(m => ({
        uuid_user: m.uuidUser,
        role_id: m.roleId,
      }))
    },
    // Formato 4: Array con snake_case
    members.map(m => ({
      uuid_user: m.uuidUser,
      role_id: m.roleId,
    }))
  ];

  console.log("🧪 Intentando diferentes formatos de payload:");
  payloads.forEach((p, i) => {
    console.log(`Formato ${i + 1}:`, JSON.stringify(p, null, 2));
  });

  // Por ahora, intentar formato 1
  const payload = { members };

  console.log("📤 Enviando payload:", JSON.stringify(payload, null, 2));

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
  
  console.log("✅ Create Team Response:", response);
  
  return response.data;
}