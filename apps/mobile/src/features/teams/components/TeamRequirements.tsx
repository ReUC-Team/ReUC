// apps/mobile/src/features/teams/components/TeamRequirements.tsx

import React from 'react'
import { View, Text } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useThemedStyles, useThemedPalette } from '../../../hooks/useThemedStyles'
import { createTeamRequirementsStyles } from '../../../styles/components/teams/TeamRequirements.styles'
import type { TeamRole, TeamRoleConstraint } from '../../projects/types/project.types'

interface TeamRequirementsProps {
  roles: TeamRole[]
  constraints: Record<string, TeamRoleConstraint>
  currentCounts: Record<string, number>
}

const TeamRequirements: React.FC<TeamRequirementsProps> = ({ roles, constraints, currentCounts }) => {
  const styles = useThemedStyles(createTeamRequirementsStyles)
  const palette = useThemedPalette()

  const formatMaxCount = (max: number | null): string => {
    return max === null ? '∞' : String(max)
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="information-circle" size={20} color={palette.primary} />
        <Text style={styles.title}>Requisitos del equipo para este tipo de proyecto:</Text>
      </View>

      <View style={styles.requirementsList}>
        {roles.map((role) => {
          const constraint = constraints[role.name]
          if (!constraint) return null

          const currentCount = currentCounts[role.name] || 0
          const isFulfilled = currentCount >= constraint.min && 
                             (constraint.max === null || currentCount <= constraint.max)

          return (
            <View key={role.id} style={styles.requirementItem}>
              <Ionicons
                name={isFulfilled ? 'checkmark-circle' : 'ellipse-outline'}
                size={16}
                color={isFulfilled ? palette.primary : palette.textSecondary}
              />
              <Text style={styles.requirementText}>
                <Text style={styles.roleName}>{role.name}:</Text>
                {' mínimo '}
                <Text style={styles.boldText}>{constraint.min}</Text>
                {constraint.max !== null && (
                  <>
                    {', máximo '}
                    <Text style={styles.boldText}>{formatMaxCount(constraint.max)}</Text>
                  </>
                )}
                <Text style={styles.currentCount}> ({currentCount})</Text>
              </Text>
            </View>
          )
        })}
      </View>
    </View>
  )
}

export default TeamRequirements