// apps/mobile/src/features/dashboards/shared/components/Projects.tsx

import React from 'react'
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useThemedStyles, useThemedPalette } from '../../../../hooks/useThemedStyles'
import { createProjectsStyles } from '../../../../styles/components/dashboard/dashboardSharedComponents.styles'
import { useProjects, Project } from '../hooks/useProjects'
import { statusConfig, projectUtils, DashboardType } from '../utils/ProjectsUtils'
import { generateAvatarFromName } from '../../../../utils/generateAvatar'
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
                onProjectClick={onProjectClick}
                onContactStudents={onContactStudents}
                onUploadComment={onUploadComment}
                onCheckDeliverables={onCheckDeliverables}
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
  onProjectClick?: (project: Project) => void
  onContactStudents?: (project: Project) => void
  onUploadComment?: (project: Project) => void
  onCheckDeliverables?: (project: Project) => void
  isLast: boolean
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  config,
  statusConfig,
  onProjectClick,
  onContactStudents,
  onUploadComment,
  onCheckDeliverables,
  isLast
}) => {
  const styles = useThemedStyles(createProjectsStyles)
  const palette = useThemedPalette()
  
  const statusCfg = statusConfig[project.status]

  return (
    <View style={[styles.projectCard, !isLast && { marginBottom: spacing.sm }]}>
      {/* Students Section - Solo si está habilitado */}
      {config.showStudents && project.students.length > 0 && (
        <View style={styles.studentsSection}>
          <View style={styles.avatarsContainer}>
            {project.students.map((student, idx) => {
              const names = student.name.split(' ')
              const firstName = names[0]
              const lastName = names[names.length - 1]
              
              return (
                <Avatar
                  key={idx}
                  firstName={firstName}
                  lastName={lastName}
                  size="small"
                  style={idx > 0 && { marginLeft: -8 }}
                />
              )
            })}
          </View>
          
          <View style={styles.studentsInfo}>
            {project.students.map((student, idx) => (
              <View 
                key={idx} 
                style={[
                  styles.studentItem,
                  idx > 0 && styles.studentItemBorder
                ]}
              >
                <Text style={styles.studentName} numberOfLines={1}>
                  {student.name}
                </Text>
                <Text style={styles.studentEmail} numberOfLines={1}>
                  {student.email}
                </Text>
              </View>
            ))}
            
            {project.students.length > 1 && (
              <View style={styles.studentsBadge}>
                <Text style={styles.studentsBadgeText}>
                  {project.students.length} estudiantes
                </Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Project Info */}
      <View style={styles.projectInfo}>
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
                <Text style={styles.projectCompanyLabel}>Empresa:</Text> {project.company}
              </Text>
            )}
          </View>
          
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

        {/* Progress Bar */}
        {config.showProgress && (
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Progreso</Text>
              <Text style={styles.progressValue}>{project.progress}%</Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View 
                style={[
                  styles.progressBarFill,
                  { width: `${project.progress}%` }
                ]}
              />
            </View>
          </View>
        )}

        {/* Meta Info */}
        <View style={styles.metaInfo}>
          <Text style={styles.metaText}>
            📅 Asignado: {projectUtils.formatDate(project.assigmentDate)}
          </Text>
          <Text style={styles.metaText}>
            ⏱️ Última actividad: {projectUtils.calculateDaysElapsed(project.lastActivity)}
          </Text>
          {config.showComments && (
            <Text style={styles.metaText}>💬 {project.comments} comentarios</Text>
          )}
          {config.showDeliverables && (
            <Text style={styles.metaText}>📋 {project.deliverables} entregables</Text>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          {config.showDetailsButton && (
            <TouchableOpacity
              onPress={() => onProjectClick?.(project)}
              style={[styles.actionButton, styles.detailsButton]}
              activeOpacity={0.7}
            >
              <Text style={styles.detailsButtonText}>Ver detalles</Text>
            </TouchableOpacity>
          )}
          
          {config.showContactButton && (
            <TouchableOpacity
              onPress={() => onContactStudents?.(project)}
              style={[styles.actionButton, styles.contactButton]}
              activeOpacity={0.7}
            >
              <Text style={styles.contactButtonText}>
                Contactar estudiante{project.students.length > 1 ? 's' : ''}
              </Text>
            </TouchableOpacity>
          )}
          
          {config.showCommentButton && (
            <TouchableOpacity
              onPress={() => onUploadComment?.(project)}
              style={[styles.actionButton, styles.commentButton]}
              activeOpacity={0.7}
            >
              <Text style={styles.commentButtonText}>Subir comentario</Text>
            </TouchableOpacity>
          )}
          
          {config.showDeliverablesButton && (
            <TouchableOpacity
              onPress={() => onCheckDeliverables?.(project)}
              style={[styles.actionButton, styles.deliverablesButton]}
              activeOpacity={0.7}
            >
              <Text style={styles.deliverablesButtonText}>Revisar entregables</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  )
}
export default Projects