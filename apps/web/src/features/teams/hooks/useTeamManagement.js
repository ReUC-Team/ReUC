import { useState } from "react";
import { createTeam } from "../teamsService.js";
import { Alerts } from "../../../shared/alerts.js";
import { getDisplayMessage } from "../../../utils/errorHandler.js";

/**
 * Hook para gestionar el estado del equipo (agregar, editar, eliminar, guardar)
 * @param {string} projectUuid - UUID del proyecto
 * @param {Array} roles - Roles disponibles
 * @param {Object} constraints - Límites por rol
 * @param {Array} existingMembers - Miembros actuales del equipo
 * @returns {Object} { pendingMembers, addMember, removeMember, updateMemberRole, saveTeam, ... }
 */
export default function useTeamManagement(projectUuid, roles, constraints, existingMembers = []) {
  const [pendingMembers, setPendingMembers] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  /**
   * Agrega un miembro pendiente
   */
  const addMember = (user, roleId) => {
    // Verificar si ya está agregado
    const exists = pendingMembers.some((m) => m.uuidUser === user.uuidUser);
    if (exists) {
      Alerts.warning("Este usuario ya fue agregado al equipo");
      return false;
    }

    // Verificar límites
    const role = roles.find((r) => r.id === roleId);
    if (role && constraints[role.name]) {
      const currentCount = pendingMembers.filter((m) => m.roleId === roleId).length;
      const maxCount = constraints[role.name].max;
      
      if (maxCount !== null && maxCount !== Infinity && currentCount >= maxCount) {
        Alerts.warning(`No puedes agregar más de ${maxCount} ${role.name}(s)`);
        return false;
      }
    }

    const newMember = {
      id: Date.now(),
      uuidUser: user.uuidUser,
      roleId,
      user: {
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        email: user.email,
        universityId: user.universityId,
      },
    };

    setPendingMembers((prev) => [...prev, newMember]);
    Alerts.success("Miembro agregado");
    return true;
  };

  /**
   * Elimina un miembro pendiente
   */
  const removeMember = (id) => {
    setPendingMembers((prev) => prev.filter((m) => m.id !== id));
    Alerts.info("Miembro eliminado");
  };

  /**
   * Actualiza el rol de un miembro pendiente
   */
  const updateMemberRole = (id, newRoleId) => {
    const role = roles.find((r) => r.id === newRoleId);
    if (role && constraints[role.name]) {
      const currentCount = pendingMembers.filter(
        (m) => m.roleId === newRoleId && m.id !== id
      ).length;
      const maxCount = constraints[role.name].max;
      
      if (maxCount !== null && maxCount !== Infinity && currentCount >= maxCount) {
        Alerts.warning(`No puedes tener más de ${maxCount} ${role.name}(s)`);
        return false;
      }
    }

    setPendingMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, roleId: newRoleId } : m))
    );
    return true;
  };

  /**
   * Valida el equipo antes de guardar
   */
  const validateTeam = () => {
    if (pendingMembers.length === 0) {
      Alerts.warning("Debes agregar al menos un miembro al equipo");
      return false;
    }

    // Validar límites mínimos y máximos considerando miembros existentes + pendientes
    for (const role of roles) {
      const constraint = constraints[role.name];
      if (!constraint) continue;

      // Contar miembros existentes con este rol
      const existingCount = existingMembers.filter(m => m.roleName === role.name).length || 0;
      // Contar miembros pendientes con este rol
      const pendingCount = pendingMembers.filter((m) => m.roleId === role.id).length;
      // Total
      const totalCount = existingCount + pendingCount;

      if (constraint.min > 0 && totalCount < constraint.min) {
        const needed = constraint.min - totalCount;
        Alerts.warning(
          `Necesitas ${needed} ${role.name}(s) más (tienes ${totalCount}, necesitas ${constraint.min})`
        );
        return false;
      }

      if (constraint.max !== null && constraint.max !== Infinity && totalCount > constraint.max) {
        Alerts.warning(
          `No puedes tener más de ${constraint.max} ${role.name}(s) (tienes${totalCount})`
        );
        return false;
      }
    }

    return true;
  };

  /**
   * Guarda el equipo
   */
  const saveTeam = async () => {
    if (!validateTeam()) {
      return false;
    }

    setIsSaving(true);

    try {
      const payload = pendingMembers.map((m) => ({
        uuidUser: m.uuidUser,
        roleId: m.roleId,
      }));

      await createTeam(projectUuid, payload);
      
      Alerts.success("Equipo guardado exitosamente");
      setPendingMembers([]);
      return true;
      
    } catch (err) {
      console.error("Error saving team:", err);
      const errorMessage = getDisplayMessage(err);
      Alerts.error(errorMessage);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    pendingMembers,
    isSaving,
    addMember,
    removeMember,
    updateMemberRole,
    saveTeam,
  };
}