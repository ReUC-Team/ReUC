// apps/mobile/src/features/teams/components/RoleSelector.tsx 

import React from 'react'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useThemedStyles, useThemedPalette } from '../../../hooks/useThemedStyles'
import { createRoleSelectorStyles } from '../../../styles/components/teams/RoleSelector.styles'
import type { TeamRole, TeamRoleConstraint, PendingTeamMember } from '../../projects/types/project.types'

interface RoleSelectorProps {
  roles: TeamRole[]
  selectedRole: number | null
  onRoleChange: (roleId: number) => void
  constraints: Record<string, TeamRoleConstraint>
  pendingMembers: PendingTeamMember[]
}

const RoleSelector: React.FC<RoleSelectorProps> = ({
  roles,
  selectedRole,
  onRoleChange,
  constraints,
  pendingMembers,
}) => {
  const styles = useThemedStyles(createRoleSelectorStyles)
  const palette = useThemedPalette()

  const getRoleCount = (roleId: number): number => {
    return pendingMembers.filter((m) => m.roleId === roleId).length
  }

  const getRoleIcon = (roleName: string): string => {
    const lowerName = roleName.toLowerCase()
    if (lowerName.includes('supervisor') || lowerName.includes('advisor') || lowerName.includes('asesor')) {
      return 'star'
    }
    return 'people'
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Seleccionar rol:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
        <View style={styles.rolesContainer}>
          {roles.map((role) => {
            const isSelected = selectedRole === role.id
            const count = getRoleCount(role.id)
            const constraint = constraints[role.name]
            const maxCount = constraint?.max

            return (
              <TouchableOpacity
                key={role.id}
                style={[styles.roleButton, isSelected && styles.roleButtonSelected]}
                onPress={() => onRoleChange(role.id)}
              >
                <Ionicons
                  name={getRoleIcon(role.name) as any}
                  size={20}
                  color={isSelected ? palette.onPrimary : palette.primary}
                />
                <Text style={[styles.roleButtonText, isSelected && styles.roleButtonTextSelected]}>
                  {role.name}
                </Text>
                {count > 0 && (
                  <View style={[styles.countBadge, isSelected && styles.countBadgeSelected]}>
                    <Text style={[styles.countBadgeText, isSelected && styles.countBadgeTextSelected]}>
                      {count}
                      {maxCount !== null && `/${maxCount}`}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            )
          })}
        </View>
      </ScrollView>
    </View>
  )
}

export default RoleSelector