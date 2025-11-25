// apps/mobile/src/features/teams/hooks/useTeamManagement.ts

import { useState } from 'react'
import { createTeam } from '../../projects/services/projectsService'
import { getDisplayMessage } from '../../../utils/errorHandler'
import Toast from 'react-native-toast-message'
import { Alert } from 'react-native'
import type {
  PendingTeamMember,
  TeamRole,
  TeamRoleConstraint,
  TeamMemberDetailed,
  SearchUser,
} from '../../projects/types/project.types'

export default function useTeamManagement(
  projectUuid: string | undefined,
  roles: TeamRole[],
  constraints: Record<string, TeamRoleConstraint>,
  existingMembers: TeamMemberDetailed[] = []
) {
  const [pendingMembers, setPendingMembers] = useState<PendingTeamMember[]>([])
  const [isSaving, setIsSaving] = useState(false)

  /**
   * Agrega un miembro pendiente
   */
  const addMember = (user: SearchUser, roleId: number): boolean => {
    // Verificar si ya está agregado
    const exists = pendingMembers.some((m) => m.uuidUser === user.uuidUser)
    if (exists) {
      Toast.show({
        type: 'info',
        text1: 'Usuario ya agregado',
        text2: 'Este usuario ya fue agregado al equipo',
        position: 'bottom',
      })
      return false
    }

    // Verificar límites
    const role = roles.find((r) => r.id === roleId)
    if (role && constraints[role.name]) {
      const currentCount = pendingMembers.filter((m) => m.roleId === roleId).length
      const maxCount = constraints[role.name].max

      if (maxCount !== null && currentCount >= maxCount) {
        Toast.show({
          type: 'info',
          text1: 'Límite alcanzado',
          text2: `No puedes agregar más de ${maxCount} ${role.name}(s)`,
          position: 'bottom',
        })
        return false
      }
    }

    const newMember: PendingTeamMember = {
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
    }

    setPendingMembers((prev) => [...prev, newMember])
    Toast.show({
      type: 'success',
      text1: '✓ Miembro agregado',
      position: 'bottom',
      visibilityTime: 2000,
    })
    return true
  }

  /**
   * Elimina un miembro pendiente
   */
  const removeMember = (id: number) => {
    setPendingMembers((prev) => prev.filter((m) => m.id !== id))
    Toast.show({
      type: 'info',
      text1: 'Miembro eliminado',
      position: 'bottom',
      visibilityTime: 2000,
    })
  }

  /**
   * Actualiza el rol de un miembro pendiente
   */
  const updateMemberRole = (id: number, newRoleId: number): boolean => {
    const role = roles.find((r) => r.id === newRoleId)
    if (role && constraints[role.name]) {
      const currentCount = pendingMembers.filter(
        (m) => m.roleId === newRoleId && m.id !== id
      ).length
      const maxCount = constraints[role.name].max

      if (maxCount !== null && currentCount >= maxCount) {
        Toast.show({
          type: 'info',
          text1: 'Límite alcanzado',
          text2: `No puedes tener más de ${maxCount} ${role.name}(s)`,
          position: 'bottom',
        })
        return false
      }
    }

    setPendingMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, roleId: newRoleId } : m))
    )
    return true
  }

  /**
   * Valida el equipo antes de guardar
   */
  const validateTeam = (): boolean => {
    if (pendingMembers.length === 0) {
      Alert.alert('Equipo vacío', 'Debes agregar al menos un miembro al equipo')
      return false
    }

    // Validar límites mínimos y máximos considerando miembros existentes + pendientes
    for (const role of roles) {
      const constraint = constraints[role.name]
      if (!constraint) continue

      // Contar miembros existentes con este rol
      const existingCount = existingMembers.filter((m) => m.roleName === role.name).length || 0
      // Contar miembros pendientes con este rol
      const pendingCount = pendingMembers.filter((m) => m.roleId === role.id).length
      // Total
      const totalCount = existingCount + pendingCount

      if (constraint.min > 0 && totalCount < constraint.min) {
        const needed = constraint.min - totalCount
        Alert.alert(
          'Equipo incompleto',
          `Necesitas ${needed} ${role.name}(s) más (tienes ${totalCount}, necesitas ${constraint.min})`
        )
        return false
      }

      if (constraint.max !== null && totalCount > constraint.max) {
        Alert.alert(
          'Límite excedido',
          `No puedes tener más de ${constraint.max} ${role.name}(s) (tienes ${totalCount})`
        )
        return false
      }
    }

    return true
  }

  /**
   * Guarda el equipo
   */
  const saveTeam = async (): Promise<boolean> => {
    if (!validateTeam() || !projectUuid) {
      return false
    }

    setIsSaving(true)

    try {
      const payload = pendingMembers.map((m) => ({
        uuidUser: m.uuidUser,
        roleId: m.roleId,
      }))

      await createTeam(projectUuid, payload)

      Toast.show({
        type: 'success',
        text1: '✓ Equipo guardado',
        text2: 'El equipo ha sido guardado exitosamente',
        position: 'bottom',
      })

      setPendingMembers([])
      return true
    } catch (err: any) {
      console.error('Error saving team:', err)
      const errorMessage = getDisplayMessage(err)
      
      Alert.alert('Error', errorMessage)
      return false
    } finally {
      setIsSaving(false)
    }
  }

  return {
    pendingMembers,
    isSaving,
    addMember,
    removeMember,
    updateMemberRole,
    saveTeam,
  }
}