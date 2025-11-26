// apps/mobile/src/features/projects/components/ProjectStatusBadge.tsx

import React from 'react'
import { View, Text } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useThemedStyles } from '../../../hooks/useThemedStyles'
import { createProjectStatusBadgeStyles } from '../../../styles/components/projects/ProjectStatusBadge.styles'
import { getStatusName, getStatusConfig, getStatusIcon } from '../../../utils/statusUtils'
import type { StatusObject } from '../types/project.types'

interface ProjectStatusBadgeProps {
  status: StatusObject | string  // Acepta objeto { name, slug } o string legacy
}

const ProjectStatusBadge: React.FC<ProjectStatusBadgeProps> = ({ status }) => {
  const styles = useThemedStyles(createProjectStatusBadgeStyles)

  // Normalizar status a slug
  const slug = typeof status === 'string' ? status : status.slug
  const displayName = typeof status === 'string' ? getStatusName(status) : status.name

  // Obtener configuración visual
  const config = getStatusConfig(slug)
  const iconName = getStatusIcon(slug)

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: config.bg }
      ]}
    >
      <Ionicons 
        name={iconName as any} 
        size={16} 
        color={config.iconColor} 
      />
      <Text style={[styles.badgeText, { color: config.text }]}>
        {displayName}
      </Text>
    </View>
  )
}

export default ProjectStatusBadge