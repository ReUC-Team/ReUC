// apps/mobile/src/features/teams/components/TeamMemberCard.tsx

import React, { useState } from 'react'
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, Modal, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useThemedStyles, useThemedPalette } from '../../../hooks/useThemedStyles'
import { createTeamMemberCardStyles } from '../../../styles/components/teams/TeamMemberCard.styles'
import { updateTeamMemberRole, deleteTeamMember } from '../../projects/services/projectsService'
import { getDisplayMessage } from '../../../utils/errorHandler'
import Toast from 'react-native-toast-message'
import type { TeamMemberDetailed, TeamRole } from '../../projects/types/project.types'

interface TeamMemberCardProps {
  member: TeamMemberDetailed
  roles: TeamRole[]
  projectUuid: string
  onRefresh: () => void
  canEdit?: boolean
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({
  member,
  roles,
  projectUuid,
  onRefresh,
  canEdit = true,
}) => {
  const styles = useThemedStyles(createTeamMemberCardStyles)
  const palette = useThemedPalette()
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const fullName = `${member.firstName} ${member.lastName}`.trim()
  const avatarInitials = `${member.firstName?.[0] || ''}${member.lastName?.[0] || ''}`.toUpperCase() || 'U'

  const handleRoleSelect = async (roleId: number) => {
    if (roleId === member.roleId) {
      setShowRoleModal(false)
      return
    }

    setIsUpdating(true)

    try {
      await updateTeamMemberRole(projectUuid, member.uuidUser, roleId)
      Toast.show({
        type: 'success',
        text1: '✓ Rol actualizado',
        position: 'bottom',
      })
      setShowRoleModal(false)
      onRefresh()
    } catch (err: any) {
      console.error('Error updating member role:', err)
      const errorMessage = getDisplayMessage(err)
      Alert.alert('Error', errorMessage)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = () => {
    Alert.alert(
      '¿Eliminar miembro?',
      `¿Estás seguro de eliminar a ${fullName} del equipo?\n\nEsta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTeamMember(projectUuid, member.uuidUser)
              Toast.show({
                type: 'success',
                text1: '✓ Miembro eliminado',
                text2: `${fullName} fue eliminado del equipo`,
                position: 'bottom',
              })
              onRefresh()
            } catch (err: any) {
              console.error('Error deleting member:', err)
              const errorMessage = getDisplayMessage(err)
              Alert.alert('Error', errorMessage)
            }
          },
        },
      ]
    )
  }

  const getRoleIcon = (roleName: string) => {
    const lowerName = roleName.toLowerCase()
    if (lowerName.includes('supervisor') || lowerName.includes('advisor') || lowerName.includes('asesor')) {
      return 'star'
    }
    return 'people'
  }

  return (
    <>
      <View style={styles.container}>
        {/* Avatar */}
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{avatarInitials}</Text>
        </View>

        {/* Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.name} numberOfLines={1}>
            {fullName}
          </Text>
          <View style={styles.emailContainer}>
            <Ionicons name="mail-outline" size={14} color={palette.textSecondary} />
            <Text style={styles.email} numberOfLines={1}>
              {member.email}
            </Text>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          {/* Badge de rol */}
          <View style={styles.roleBadge}>
            <Ionicons name={getRoleIcon(member.roleName) as any} size={16} color={palette.onPrimary} />
            <Text style={styles.roleBadgeText} numberOfLines={1}>
              {member.roleName}
            </Text>
          </View>

          {/* Botones de acción */}
          {canEdit && (
            <View style={styles.actionButtons}>
              <TouchableOpacity onPress={() => setShowRoleModal(true)} style={styles.editButton}>
                <Ionicons name="pencil" size={16} color={palette.textSecondary} />
              </TouchableOpacity>

              <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
                <Ionicons name="trash-outline" size={16} color={palette.error} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* Modal para seleccionar rol */}
      <Modal visible={showRoleModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Seleccionar Rol</Text>
              <TouchableOpacity onPress={() => !isUpdating && setShowRoleModal(false)}>
                <Ionicons name="close" size={24} color={palette.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.rolesList}>
              {roles.map((role) => (
                <TouchableOpacity
                  key={role.id}
                  style={[
                    styles.roleOption,
                    role.id === member.roleId && styles.roleOptionSelected,
                  ]}
                  onPress={() => handleRoleSelect(role.id)}
                  disabled={isUpdating}
                >
                  {isUpdating && role.id !== member.roleId ? (
                    <ActivityIndicator size="small" color={palette.primary} />
                  ) : (
                    <>
                      <Ionicons
                        name={getRoleIcon(role.name) as any}
                        size={20}
                        color={role.id === member.roleId ? palette.onPrimary : palette.text}
                      />
                      <Text
                        style={[
                          styles.roleOptionText,
                          role.id === member.roleId && styles.roleOptionTextSelected,
                        ]}
                      >
                        {role.name}
                      </Text>
                      {role.id === member.roleId && (
                        <Ionicons name="checkmark" size={20} color={palette.onPrimary} />
                      )}
                    </>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  )
}

export default TeamMemberCard