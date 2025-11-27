// apps/mobile/src/features/dashboard/student/components/ActiveProjectsCards.tsx

import React from 'react'
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useThemedStyles, useThemedPalette } from '../../../../hooks/useThemedStyles'
import { createActiveProjectsCardsStyles } from '../../../../styles/components/dashboard/dashboardStudentComponents.styles'
import { useDashboardStats } from '../hooks/useDashboardStats'

const { width: screenWidth } = Dimensions.get('window')

const ActiveProjectsCards: React.FC = () => {
  const styles = useThemedStyles(createActiveProjectsCardsStyles)
  const palette = useThemedPalette()
  const navigation = useNavigation()

  const { stats, isLoading } = useDashboardStats()

  // Función para obtener el color del estado
  const getStatusColor = (statusSlug: string | undefined) => {
    const colors: Record<string, { bg: string; text: string }> = {
      'project_in_progress': {
        bg: '#E0F2FE',
        text: '#0369A1'
      },
      'completed': {
        bg: '#DBEAFE',
        text: '#1E40AF'
      },
      'project_approved': {
        bg: '#D1FAE5',
        text: '#065F46'
      }
    }
    return colors[statusSlug || 'project_approved'] || colors['project_approved']
  }

  // Función para obtener el nombre legible del estado
  const getStatusLabel = (statusSlug: string | undefined) => {
    const labels: Record<string, string> = {
      'project_in_progress': 'En Progreso',
      'completed': 'Completado',
      'project_approved': 'Aprobado'
    }
    return labels[statusSlug || 'project_approved'] || 'Desconocido'
  }

  // Calcular días restantes
  const calculateDaysRemaining = (deadline: string | null) => {
    if (!deadline) return null
    const deadlineDate = new Date(deadline)
    const now = new Date()
    const diffTime = deadlineDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  if (isLoading || stats.projects.length === 0) {
    return null
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Proyectos Activos</Text>
      
      <ScrollView 
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalScrollContainer}
        decelerationRate="fast"
        snapToInterval={screenWidth * 0.85 + 16}
        snapToAlignment="start"
      >
        {stats.projects.slice(0, 4).map((project, index) => {
          const daysRemaining = calculateDaysRemaining(project.estimatedDate)
          const statusColor = getStatusColor(project.status?.slug)
          const statusLabel = getStatusLabel(project.status?.slug)

          return (
            <TouchableOpacity
              key={project.uuid_project || index}
              style={[
                styles.projectCard,
                index === 0 && styles.projectCardFirst
              ]}
              activeOpacity={0.8}
              onPress={() => {
                navigation.navigate('ProjectDetails' as never, {
                  uuid: project.uuid_project
                } as never)
              }}
            >
              {/* Header */}
              <View style={styles.projectCardHeader}>
                <View style={styles.projectIconContainer}>
                  <MaterialCommunityIcons 
                    name="file-document-outline" 
                    size={28} 
                    color={palette.primary}
                  />
                </View>
                
                <View style={[styles.statusBadge, { backgroundColor: statusColor.bg }]}>
                  <Text style={[styles.statusText, { color: statusColor.text }]}>
                    {statusLabel}
                  </Text>
                </View>
              </View>

              {/* Content */}
              <View style={styles.projectCardContent}>
                <Text style={styles.projectTitle} numberOfLines={2}>
                  {project.title || 'Sin título'}
                </Text>
                <Text style={styles.projectDescription} numberOfLines={3}>
                  {project.shortDescription || 'Sin descripción'}
                </Text>
              </View>

              {/* Footer */}
              <View style={styles.projectCardFooter}>
                <View style={styles.daysContainer}>
                  <MaterialCommunityIcons 
                    name="clock-outline" 
                    size={16} 
                    color={palette.textSecondary}
                  />
                  <Text style={styles.daysText}>
                    {daysRemaining !== null ? `${daysRemaining} días` : 'Sin deadline'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )
        })}
      </ScrollView>
    </View>
  )
}

export default ActiveProjectsCards