import { useMemo } from 'react';
import { parseDateLocal } from '@/utils/dateUtils';

/**
 * Hook para validar si un proyecto puede ser iniciado
 * Verifica:
 * 1. Equipo completo según restricciones del tipo de proyecto
 * 2. Deadline dentro del rango válido
 */
export default function useProjectValidation(project, constraints = {}, teamMembers = null) {
  
  const validation = useMemo(() => {
    if (!project) {
      return {
        canStart: false,
        teamValid: false,
        deadlineValid: false,
        errors: [],
        missingRoles: []
      };
    }

    const errors = [];
    const missingRoles = [];
    const projectType = project.projectTypes?.[0];
    // Usar teamMembers pasados o los del proyecto
    const members = teamMembers || project.teamMembers || [];
    const createdAt = project.createdAt;
    const deadline = project.estimatedDate;

    // VALIDACIÓN DE EQUIPO 
    let teamValid = false;
    
    // Si tenemos restricciones, validamos contra ellas
    if (Object.keys(constraints).length > 0) {
      // Contar miembros por rol
      const roleCounts = {};
      members.forEach(member => {
        const roleName = member.roleName || member.role; // Soporta ambos formatos
        roleCounts[roleName] = (roleCounts[roleName] || 0) + 1;
      });

      let allConstraintsMet = true;

      // Verificar cada restricción
      for (const [roleName, constraint] of Object.entries(constraints)) {
        const count = roleCounts[roleName] || 0;
        const min = constraint.min;
        const max = constraint.max;

        // Verificar mínimo
        if (min > 0 && count < min) {
          allConstraintsMet = false;
          const needed = min - count;
          missingRoles.push({
            role: roleName,
            current: count,
            min: min,
            max: max === Infinity ? '∞' : max,
            needed: needed,
            message: `Faltan ${needed} ${roleName}(s) (mínimo: ${min})`
          });
        }

        // Verificar máximo
        if (max !== Infinity && count > max) {
          allConstraintsMet = false;
          errors.push(`Demasiados ${roleName}s (máximo: ${max}, actual: ${count})`);
        }
      }

      teamValid = allConstraintsMet;
      
      if (!teamValid && missingRoles.length > 0) {
        errors.push('El equipo no cumple con las restricciones del tipo de proyecto');
      }
    } else {
      // Si no hay restricciones, solo verificamos que haya al menos un miembro
      teamValid = members.length > 0;
      if (!teamValid) {
        errors.push('El equipo debe tener al menos un miembro');
      }
    }

    // VALIDACIÓN DE DEADLINE
    let deadlineValid = false;
    if (createdAt && deadline && projectType) {
      const createdDate = parseDateLocal(createdAt.split('T')[0]);
      const deadlineDate = parseDateLocal(deadline.split('T')[0]);
      
      const monthsDiff = (deadlineDate.getFullYear() - createdDate.getFullYear()) * 12 
                        + (deadlineDate.getMonth() - createdDate.getMonth());
      
      const minMonths = projectType.minEstimatedMonths || 0;
      const maxMonths = projectType.maxEstimatedMonths || Infinity;
      
      deadlineValid = monthsDiff >= minMonths && monthsDiff <= maxMonths;
      
      if (!deadlineValid) {
        errors.push(`La fecha límite debe estar entre ${minMonths} y ${maxMonths} meses desde la creación`);
      }
    }

    const canStart = teamValid && deadlineValid;

    return {
      canStart,
      teamValid,
      deadlineValid,
      errors,
      missingRoles
    };
  }, [project, constraints, teamMembers]);

  return validation;
}