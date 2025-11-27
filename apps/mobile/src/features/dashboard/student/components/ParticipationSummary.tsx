// apps/mobile/src/features/dashboard/student/components/ParticipationSummary.tsx

import React from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useThemedStyles, useThemedPalette } from '../../../../hooks/useThemedStyles'
import { createParticipationSummaryStyles } from '../../../../styles/components/dashboard/dashboardStudentComponents.styles'
import { useDashboardStats } from '../hooks/useDashboardStats'

const ParticipationSummary: React.FC = () => {
  const styles = useThemedStyles(createParticipationSummaryStyles)
  const palette = useThemedPalette()

  const { stats, isLoading } = useDashboardStats()

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingState}>
          <View style={styles.loadingBar} />
          <View style={styles.loadingBarSmall} />
          <View style={styles.loadingBarSmall} />
        </View>
      </View>
    )
  }

  const totalProjects = stats.totalProjects
  const activeProjects = stats.byStatus.approved + stats.byStatus.inProgress
  const completedProjects = stats.byStatus.completed

  // Calcular porcentajes
  const activePercentage = totalProjects > 0 ? (activeProjects / totalProjects) * 100 : 0
  const completedPercentage = totalProjects > 0 ? (completedProjects / totalProjects) * 100 : 0

  // Formatear fecha del deadline
  const formatDeadlineDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-MX', { 
      month: 'long', 
      day: 'numeric' 
    })
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <MaterialCommunityIcons 
          name="chart-bar" 
          size={24} 
          color={palette.primary}
        />
        <Text style={styles.title}>Resumen de Participación</Text>
      </View>

      {/* Proyectos Activos */}
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Proyectos Activos</Text>
          <Text style={styles.progressValue}>
            {activeProjects}/{totalProjects}
          </Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View 
            style={[
              styles.progressBarFill, 
              styles.progressBarActive,
              { width: `${activePercentage}%` }
            ]} 
          />
        </View>
      </View>

      {/* Proyectos Completados */}
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Proyectos Completados</Text>
          <Text style={styles.progressValue}>
            {completedProjects}/{totalProjects}
          </Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View 
            style={[
              styles.progressBarFill, 
              styles.progressBarCompleted,
              { width: `${completedPercentage}%` }
            ]} 
          />
        </View>
      </View>

      {/* Próximo Deadline */}
      {stats.nearestDeadline && (
        <View style={styles.deadlineSection}>
          <Text style={styles.deadlineLabel}>Próximo Deadline</Text>
          <Text style={styles.deadlineTitle} numberOfLines={2}>
            {stats.nearestDeadline.title}
          </Text>
          <Text style={styles.deadlineDate}>
            {formatDeadlineDate(stats.nearestDeadline.deadlineDate)}
          </Text>
        </View>
      )}
    </View>
  )
}

export default ParticipationSummary