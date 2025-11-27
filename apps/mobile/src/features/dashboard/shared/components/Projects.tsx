// apps/mobile/src/features/dashboards/shared/components/Projects.tsx

import React from 'react'
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useThemedStyles, useThemedPalette } from '../../../../hooks/useThemedStyles'
import { createProjectsStyles } from '../../../../styles/components/dashboard/dashboardSharedComponents.styles'
import { useProjects, Project } from '../hooks/useProjects'
import { statusConfig, projectUtils, DashboardType } from '../utils/ProjectsUtils'
import Avatar from '../../../../components/Avatar'
import { spacing } from '../../../../styles/theme/spacing'

interface ProjectsProps {
  dashboardType: DashboardType
  onProjectClick?: (project: Project) => void
  onContactStudents?: (project: Project) => void
  onUploadComment?: (project: Project) => void
  onCheckDeliverables?: (project: Project) => void
}

const Projects: React.FC<ProjectsProps> = ({
  dashboardType,
  onProjectClick,
  onContactStudents,
  onUploadComment,
  onCheckDeliverables
}) => {
  const styles = useThemedStyles(createProjectsStyles)
  const palette = useThemedPalette()
  const navigation = useNavigation()
  const { projects, loading, error, refreshProjects } = useProjects(dashboardType)
  const config = projectUtils.getDashboardConfig(dashboardType)

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: palette.surface }}>
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <View style={styles.container}>
            <View style={styles.loadingState}>
              <ActivityIndicator size="large" color={palette.primary} />
              <Text style={styles.loadingText}>Cargando proyectos...</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    )
  }

  if (error) {
    return (
      <View style={{ flex: 1, backgroundColor: palette.surface }}>
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <View style={styles.container}>
            <View style={styles.header}>
              <MaterialCommunityIcons 
                name="folder-multiple" 
                size={28} 
                color={palette.text}
              />
              <Text style={styles.title}>{config.title}</Text>
            </View>
            
            <View style={styles.errorState}>
              <View style={styles.errorIcon}>
                <MaterialCommunityIcons 
                  name="alert-circle-outline" 
                  size={32} 
                  color={palette.errorText}
                />
              </View>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity 
                style={styles.retryButton}
                onPress={refreshProjects}
                activeOpacity={0.7}
              >
                <Text style={styles.retryButtonText}>Intentar de nuevo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: palette.surface }}>
      <ScrollView 
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <MaterialCommunityIcons 
              name="folder-multiple" 
              size={28} 
              color={palette.text}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{config.title}</Text>
              <Text style={styles.subtitle}>
                {projectUtils.getProjectCountText(projects.length, dashboardType)}
              </Text>
            </View>
          </View>

          {/* Projects List */}
          {projects.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <MaterialCommunityIcons 
                  name="folder-outline" 
                  size={32} 
                  color={palette.textSecondary}
                />
              </View>
              <Text style={styles.emptyText}>No hay proyectos disponibles</Text>
            </View>
          ) : (
            projects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                config={config}
                statusConfig={statusConfig}
                navigation={navigation}
                isLast={index === projects.length - 1}
              />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  )
}

interface ProjectCardProps {
  project: Project
  config: any
  statusConfig: any
  navigation: any
  isLast: boolean
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  config,
  statusConfig,
  navigation,
  isLast
}) => {
  const styles = useThemedStyles(createProjectsStyles)
  const palette = useThemedPalette()
  
  const statusCfg = statusConfig[project.status] || {
    color: '#6B7280',
    bgColor: '#F3F4F6',
    textColor: '#374151'
  }

  return (
    <View style={[styles.projectCard, !isLast && { marginBottom: spacing.md }]}>
      {/* Header: Título y Estado */}
      <View style={styles.projectHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.projectTitle} numberOfLines={2}>
            {project.title}
          </Text>
          <Text style={styles.projectDescription} numberOfLines={2}>
            {project.description}
          </Text>
          {config.showCompany && (
            <Text style={styles.projectCompany}>
              <Text style={styles.projectCompanyLabel}>Titular: </Text>
              {project.company}
            </Text>
          )}
        </View>
        
        {/* Status Badge */}
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: statusCfg.bgColor }
          ]}
        >
          <View 
            style={[
              styles.statusDot,
              { backgroundColor: statusCfg.color }
            ]} 
          />
          <Text style={[styles.statusText, { color: statusCfg.textColor }]}>
            {project.status}
          </Text>
        </View>
      </View>

      {/* Meta Info: Fechas y Deliverables */}
      <View style={styles.metaInfo}>
        <View style={styles.metaRow}>
          <MaterialCommunityIcons name="calendar" size={16} color={palette.primary} />
          <Text style={styles.metaText}>
            Asignado: {projectUtils.formatDate(project.assigmentDate)}
          </Text>
        </View>
        
        <View style={styles.metaRow}>
          <MaterialCommunityIcons name="clock-outline" size={16} color={palette.primary} />
          <Text style={styles.metaText}>
            Actividad: {projectUtils.calculateDaysElapsed(project.lastActivity)}
          </Text>
        </View>

        {config.showDeliverables && project.deliverables > 0 && (
          <View style={styles.metaRow}>
            <MaterialCommunityIcons name="file-document-outline" size={16} color={palette.primary} />
            <Text style={styles.metaText}>
              {project.deliverables} entregable{project.deliverables !== 1 ? 's' : ''}
            </Text>
          </View>
        )}
      </View>

      {config.showStudents && project.students && project.students.length > 0 && (
        <View style={styles.studentsSection}>
          <View style={styles.avatarsContainer}>
            {project.students.slice(0, 3).map((student, idx) => {
              const names = student.name.split(' ')
              const firstName = names[0]
              const lastName = names[names.length - 1]
              
              return (
                <Avatar
                  key={idx}
                  firstName={firstName}
                  lastName={lastName}
                  size="small"
                  style={idx > 0 ? { marginLeft: -8 } : undefined}
                />
              )
            })}
          </View>
          
          <View style={styles.studentsInfo}>
            <Text style={styles.studentsLabel}>
              {project.students.length} miembro{project.students.length !== 1 ? 's' : ''}
            </Text>
            {project.students.slice(0, 2).map((student, idx) => (
              <Text 
                key={idx} 
                style={styles.studentName}
                numberOfLines={1}
              >
                {student.name}
              </Text>
            ))}
            {project.students.length > 2 && (
              <Text style={styles.studentsMore}>
                +{project.students.length - 2} más
              </Text>
            )}
          </View>
        </View>
      )}

      <View style={styles.actions}>
        {config.showDetailsButton && (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('ProjectDetails' as never, {
                uuid: project.uuid_project
              } as never)
            }}
            style={[styles.actionButton, styles.detailsButton]}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="file-document-outline" size={16} color={palette.onPrimary} />
            <Text style={styles.detailsButtonText}>Ver detalles</Text>
          </TouchableOpacity>
        )}
        
        {config.showContactButton && project.students && project.students.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('TeamPage' as never, {
                uuid: project.uuid_project
              } as never)
            }}
            style={[styles.actionButton, styles.contactButton]}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="account-group" size={16} color={palette.onPrimary} />
            <Text style={styles.contactButtonText}>Ver equipo</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

export default Projects