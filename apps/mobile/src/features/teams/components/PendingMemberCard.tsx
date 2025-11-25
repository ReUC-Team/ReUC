// apps/mobile/src/features/teams/components/PendingMemberCard.tsx 

import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useThemedStyles, useThemedPalette } from '../../../hooks/useThemedStyles'
import { createPendingMemberCardStyles } from '../../../styles/components/teams/PendingMemberCard.styles'
import type { PendingTeamMember, TeamRole } from '../../projects/types/project.types'

interface PendingMemberCardProps {
  member: PendingTeamMember
  roles: TeamRole[]
  onRemove: (id: number) => void
  onUpdateRole: (id: number, roleId: number) => boolean
}

const PendingMemberCard: React.FC<PendingMemberCardProps> = ({
  member,
  roles,
  onRemove,
  onUpdateRole,
}) => {
  const styles = useThemedStyles(createPendingMemberCardStyles)
  const palette = useThemedPalette()
  const [showRoleModal, setShowRoleModal] = useState(false)

  const fullName = `${member.user.firstName} ${member.user.lastName}`.trim()
  const avatarInitials = `${member.user.firstName?.[0] || ''}${member.user.lastName?.[0] || ''}`.toUpperCase() || 'U'
  const currentRole = roles.find((r) => r.id === member.roleId)

  const handleRoleSelect = (roleId: number) => {
    const success = onUpdateRole(member.id, roleId)
    if (success) {
      setShowRoleModal(false)
    }
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
              {member.user.email}
            </Text>
          </View>
        </View>

        {/* Selector de Rol (botón) */}
        <TouchableOpacity style={styles.roleButton} onPress={() => setShowRoleModal(true)}>
          <Ionicons name={getRoleIcon(currentRole?.name || '')} size={16} color={palette.onPrimary} />
          <Text style={styles.roleButtonText} numberOfLines={1}>
            {currentRole?.name}
          </Text>
          <Ionicons name="chevron-down" size={16} color={palette.onPrimary} />
        </TouchableOpacity>

        {/* Botón Eliminar */}
        <TouchableOpacity onPress={() => onRemove(member.id)} style={styles.removeButton}>
          <Ionicons name="close-circle" size={24} color={palette.error} />
        </TouchableOpacity>
      </View>

      {/* Modal para seleccionar rol */}
      <Modal visible={showRoleModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Seleccionar Rol</Text>
              <TouchableOpacity onPress={() => setShowRoleModal(false)}>
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
                >
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
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  )
}

export default PendingMemberCard