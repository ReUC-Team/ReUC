import { useState } from "react";
import { createTeam } from "../teamsService.js";
import { Alerts } from "../../../shared/alerts.js";
import { getDisplayMessage } from "../../../utils/errorHandler.js";

/**
 * Hook para gestionar el estado del equipo (agregar, editar, eliminar, guardar)
 * @param {string} projectUuid - UUID del proyecto
 * @param {Array} roles - Roles disponibles
 * @param {Object} constraints - Límites por rol
 * @returns {Object} { pendingMembers, addMember, removeMember, updateMemberRole, saveTeam, ... }
 */
export default function useTeamManagement(projectUuid, roles, constraints) {
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
      
      // null o Infinity significa sin límite
      if (maxCount !== null && maxCount !== Infinity && currentCount >= maxCount) {
        Alerts.warning(`No puedes agregar más de ${maxCount} ${role.name}(s)`);
        return false;
      }
    }

    const newMember = {
      id: Date.now(), // ID temporal para manejo local
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
    // Verificar límites
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

    // Validar límites mínimos y máximos
    for (const role of roles) {
      const constraint = constraints[role.name];
      if (!constraint) continue;

      const count = pendingMembers.filter((m) => m.roleId === role.id).length;

      // Validar mínimo
      if (constraint.min > 0 && count < constraint.min) {
        Alerts.warning(
          `Debes agregar al menos ${constraint.min} ${role.name}(s)`
        );
        return false;
      }

      // Validar máximo (si no es null/Infinity)
      if (constraint.max !== null && constraint.max !== Infinity && count > constraint.max) {
        Alerts.warning(
          `No puedes tener más de ${constraint.max} ${role.name}(s)`
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
      // Formato requerido por el backend
      const payload = pendingMembers.map((m) => ({
        uuidUser: m.uuidUser,
        roleId: m.roleId,
      }));

      console.log("💾 Saving team with payload:", payload);

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