// apps/mobile/src/features/projects/pages/ProjectDetails.tsx

import React, { useState, useMemo } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { useThemedStyles, useThemedPalette } from '../../../hooks/useThemedStyles'
import { createProjectDetailsStyles } from '../../../styles/screens/ProjectDetails.styles'
import { useAuth } from '../../../context/AuthContext'
import useProjectDetails from '../hooks/useProjectDetails'
import useProjectActions from '../hooks/useProjectActions'
import useProjectValidation from '../hooks/useProjectValidation' 
import { downloadAllAttachments } from '../services/projectsService'
import { formatDateStringSpanish } from '../../../utils/dateUtils'
import Toast from 'react-native-toast-message'
import ProjectImage from '../components/ProjectImage'
import ProjectSummary from '../components/ProjectSummary'
import ProjectInfoCard from '../components/ProjectInfoCard'
import AttachmentCard from '../components/AttachmentCard'
import ProjectStatusBadge from '../components/ProjectStatusBadge'
import StartProjectModal from '../components/StartProjectModal'
import RollbackProjectModal from '../components/RollbackProjectModal'
import UpdateDeadlineModal from '../components/UpdateDeadlineModal'

const ProjectDetails: React.FC = () => {
  const styles = useThemedStyles(createProjectDetailsStyles)
  const palette = useThemedPalette()
  const route = useRoute<any>()
  const navigation = useNavigation<any>()
  const { uuid } = route.params || {}
  const { user } = useAuth()

  const { project, isLoading, error } = useProjectDetails(uuid)
  const {
    isStarting,
    isRollingBack,
    isUpdatingDeadline,
    handleStart,
    handleRollback,
    handleUpdateDeadline,
  } = useProjectActions(uuid)

  const [isDownloadingAll, setIsDownloadingAll] = useState(false)
  const [showStartModal, setShowStartModal] = useState(false)
  const [showRollbackModal, setShowRollbackModal] = useState(false)
  const [showUpdateDeadlineModal, setShowUpdateDeadlineModal] = useState(false)

  // 🔍 LOG 1: Ver datos crudos del proyecto
  console.log('📦 PROJECT RAW DATA:', {
    teamConstraints: project?.teamConstraints,
    teamConstraintsType: typeof project?.teamConstraints,
    teamConstraintsKeys: project?.teamConstraints ? Object.keys(project.teamConstraints) : [],
    teamConstraintsJSON: JSON.stringify(project?.teamConstraints, null, 2),
  })

  

  //  Validación del proyecto
const validation = useProjectValidation(project, project?.teamConstraints || {})

  //  Ver resultado de la validación
  console.log('🔍 VALIDACIÓN DEL PROYECTO:', {
    canStart: validation.canStart,
    teamValid: validation.teamValid,
    deadlineValid: validation.deadlineValid,
    errors: validation.errors,
    missingRoles: validation.missingRoles,
    teamMembers: project?.teamMembers?.length || 0,
    teamMembersData: project?.teamMembers,
  })

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No especificada'
    return formatDateStringSpanish(dateString)
  }

  const extractNames = (items: any[] | null | undefined, fallback: string = 'No especificado'): string => {
    if (!items || !Array.isArray(items) || items.length === 0) {
      return fallback
    }
    
    try {
      const names = items
        .filter(item => item != null)
        .map(item => {
          if (typeof item === 'string') return item
          if (typeof item === 'object' && item.name) return item.name
          return String(item)
        })
        .filter(name => name && name !== 'undefined' && name !== 'null')
      
      return names.length > 0 ? names.join(', ') : fallback
    } catch (err) {
      console.error('Error extracting names:', err)
      return fallback
    }
  }

  // Manejar descarga de todos los archivos
  const handleDownloadAll = async () => {
    if (!project?.attachments || project.attachments.length === 0) {
      Alert.alert('Sin archivos', 'No hay archivos para descargar')
      return
    }

    setIsDownloadingAll(true)

    try {
      const result = await downloadAllAttachments(project.attachments)

      if (result.failed > 0) {
        Alert.alert(
          'Descarga parcial',
          `Se descargaron ${result.successful} de ${project.attachments.length} archivos.\n\nErrores:\n${result.errors.join('\n')}`
        )
      } else {
        Toast.show({
          type: 'success',
          text1: '✓ Archivos descargados',
          text2: `Se descargaron ${result.successful} archivos exitosamente`,
          position: 'bottom',
          visibilityTime: 3000,
        })
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error desconocido al descargar archivos')
    } finally {
      setIsDownloadingAll(false)
    }
  }

  // Manejar inicio de proyecto
  const handleStartProject = async () => {
    const success = await handleStart()
    if (success) {
      setShowStartModal(false)
      setTimeout(() => {
        navigation.navigate('ProjectDetails', { uuid })
      }, 1500)
    }
  }

  // Manejar reversión de proyecto
  const handleRollbackProject = async () => {
    const success = await handleRollback()
    if (success) {
      setShowRollbackModal(false)
      setTimeout(() => {
        navigation.navigate('MyApplications')
      }, 1500)
    }
  }

  // Manejar actualización de fecha límite
  const handleUpdateDeadlineSubmit = async (newDeadline: Date) => {
    const success = await handleUpdateDeadline(newDeadline)
    if (success) {
      setShowUpdateDeadlineModal(false)
      setTimeout(() => {
        navigation.navigate('ProjectDetails', { uuid })
      }, 1500)
    }
  }

  // Manejar navegación a equipo
  const handleViewTeam = () => {
    navigation.navigate('TeamPage', { uuid })
  }

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={palette.primary} />
        <Text style={styles.loadingText}>Cargando detalles...</Text>
      </View>
    )
  }

  // Error state
  if (error || !project) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons
            name="alert-circle-outline"
            size={48}
            color={palette.errorText}
            style={styles.errorIcon}
          />
          <Text style={styles.errorText}>{error || 'No se pudo cargar la información'}</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    )
  }

  // Determinar permisos
  const isCreator = user?.uuid === project.uuidCreator
  const isProfessor = user?.role?.slug === 'professor'
  const statusSlug = typeof project.status === 'string' ? project.status : project.status?.slug

  const canStart = isProfessor && isCreator && statusSlug === 'project_approved'
  const canRollback = isProfessor && isCreator && (statusSlug === 'project_approved' || statusSlug === 'project_in_progress')
  const canUpdateDeadline = isProfessor && (statusSlug === 'project_approved' || statusSlug === 'project_in_progress')

  // Información del proyecto
  const projectInfo = [
    {
      label: 'Tipo de proyecto',
      value: extractNames(project.projectTypes),
    },
    {
      label: 'Facultades',
      value: extractNames(project.faculties, 'No especificada'),
    },
    {
      label: 'Tipo de problemática',
      value: extractNames(project.problemTypes),
    },
    {
      label: 'Fecha límite',
      value: formatDate(project.estimatedDate),
    },
    {
      label: 'Fecha de creación',
      value: formatDate(project.createdAt),
    },
    {
      label: 'Fecha de aprobación',
      value: formatDate(project.approvedAt),
    },
  ]

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>
          Detalles del <Text style={styles.titleAccent}>proyecto</Text>
        </Text>

        {/* Badge de estado */}
        {project.status && (
          <View style={{ marginTop: 8, alignItems: 'center' }}>
            <ProjectStatusBadge status={project.status} />
          </View>
        )}
      </View>

      <View style={styles.content}>
        {/* Banner */}
        {project.bannerUrl && (
          <ProjectImage source={{ uri: project.bannerUrl }} alt={project.title} />
        )}

        {/* Resumen */}
        <ProjectSummary title={project.title} description={project.detailedDescription} />

        {/* Información del proyecto */}
        <Text style={styles.sectionTitle}>
          Información del <Text style={styles.titleAccent}>proyecto</Text>
        </Text>
        <ProjectInfoCard items={projectInfo} />

        {/* Archivos adjuntos */}
        {project.attachments?.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>
              Documentos <Text style={styles.titleAccent}>adjuntos</Text>
            </Text>
            {project.attachments.map((file: any, index: number) => (
              <AttachmentCard key={index} file={file} />
            ))}
          </>
        )}

        {/* BOTÓN GENERAL - DESCARGAR TODOS */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[
              styles.downloadAllButton,
              (isDownloadingAll || project.attachments?.length === 0) &&
                styles.downloadAllButtonDisabled,
            ]}
            onPress={handleDownloadAll}
            disabled={isDownloadingAll || project.attachments?.length === 0}
          >
            {isDownloadingAll ? (
              <>
                <ActivityIndicator size="small" color={palette.onPrimary} />
                <Text style={styles.downloadAllButtonText}>Descargando...</Text>
              </>
            ) : (
              <>
                <Ionicons name="download-outline" size={20} color={palette.onPrimary} />
                <Text style={styles.downloadAllButtonText}>
                  Descargar todos ({project.attachments?.length || 0})
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* TÍTULO DE SECCIÓN - ACCIONES DEL PROYECTO */}
        <Text style={styles.sectionTitle}>
          Acciones del <Text style={styles.titleAccent}>proyecto</Text>
        </Text>

        {/* Botón Ver Equipo */}
        <TouchableOpacity
          style={styles.viewTeamButton}
          onPress={handleViewTeam}
        >
          <Ionicons name="people" size={20} color={palette.onPrimary} />
          <Text style={styles.viewTeamButtonText}>Ver Equipo</Text>
        </TouchableOpacity>

        {/* ACCIONES SOLO PARA PROFESORES CREADORES */}
        {isProfessor && isCreator && (
          <>
            {/*  BOTÓN INICIAR PROYECTO -  VALIDACIÓN VISUAL */}
            {canStart && statusSlug === 'project_approved' && (
              <TouchableOpacity
                style={[
                  styles.startButton, 
                  (!validation.canStart || isStarting) && styles.startButtonDisabled
                ]}
                onPress={() => setShowStartModal(true)}
                disabled={!validation.canStart || isStarting}
              >
                {isStarting ? (
                  <>
                    <ActivityIndicator size="small" color={palette.onPrimary} />
                    <Text style={styles.startButtonText}>Iniciando...</Text>
                  </>
                ) : (
                  <>
                    <Ionicons 
                      name={validation.canStart ? 'play-circle' : 'ban'} 
                      size={20} 
                      color={palette.onPrimary} 
                    />
                    <Text style={styles.startButtonText}>
                      {validation.canStart ? 'Iniciar proyecto' : 'No se puede iniciar'}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            )}

            {/*  WARNING BOX - EQUIPO INCOMPLETO O FECHA INVÁLIDA */}
            {canStart && statusSlug === 'project_approved' && !validation.canStart && (
              <View style={styles.teamIncompleteWarning}>
                <Ionicons name="warning" size={24} color="#DC2626" style={{ marginTop: 2 }} />
                <View style={{ flex: 1 }}>
                  {!validation.teamValid && (
                    <>
                      <Text style={styles.warningTitle}>Equipo incompleto</Text>
                      <Text style={styles.warningText}>
                        Complete el equipo según las restricciones para poder iniciar el proyecto:
                      </Text>
                      {validation.missingRoles.map((roleInfo, idx) => (
                        <Text key={idx} style={styles.warningItem}>
                          • {roleInfo.role}: Tienes {roleInfo.current}, necesitas mínimo{' '}
                          {roleInfo.min} - Faltan {roleInfo.needed}
                        </Text>
                      ))}
                    </>
                  )}
                  {!validation.deadlineValid && (
                    <>
                      <Text style={styles.warningTitle}>Fecha límite inválida</Text>
                      <Text style={styles.warningText}>
                        La fecha límite no cumple con los requisitos del tipo de proyecto.
                        Por favor actualice la fecha límite.
                      </Text>
                    </>
                  )}
                </View>
              </View>
            )}

            {/* Botón Actualizar Fecha Límite */}
            {canUpdateDeadline && (
              <TouchableOpacity
                style={[
                  styles.updateDeadlineButton,
                  isUpdatingDeadline && styles.updateDeadlineButtonDisabled,
                ]}
                onPress={() => setShowUpdateDeadlineModal(true)}
                disabled={isUpdatingDeadline}
              >
                {isUpdatingDeadline ? (
                  <>
                    <ActivityIndicator size="small" color={palette.onPrimary} />
                    <Text style={styles.updateDeadlineButtonText}>Actualizando...</Text>
                  </>
                ) : (
                  <>
                    <Ionicons name="calendar" size={20} color={palette.onPrimary} />
                    <Text style={styles.updateDeadlineButtonText}>Actualizar fecha límite</Text>
                  </>
                )}
              </TouchableOpacity>
            )}

            {/* Botón Revertir Proyecto - SOLO si está en 'project_in_progress' */}
            {canRollback && statusSlug === 'project_in_progress' && (
              <TouchableOpacity
                style={[styles.rollbackButton, isRollingBack && styles.rollbackButtonDisabled]}
                onPress={() => setShowRollbackModal(true)}
                disabled={isRollingBack}
              >
                {isRollingBack ? (
                  <>
                    <ActivityIndicator size="small" color={palette.onPrimary} />
                    <Text style={styles.rollbackButtonText}>Revirtiendo...</Text>
                  </>
                ) : (
                  <>
                    <Ionicons name="arrow-undo" size={20} color={palette.onPrimary} />
                    <Text style={styles.rollbackButtonText}>Revertir proyecto</Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </>
        )}
      </View>

      {/* Modales */}
      <StartProjectModal
        isOpen={showStartModal}
        onClose={() => setShowStartModal(false)}
        project={project}
        onConfirm={handleStartProject}
        isLoading={isStarting}
      />

      <RollbackProjectModal
        isOpen={showRollbackModal}
        onClose={() => setShowRollbackModal(false)}
        project={project}
        onConfirm={handleRollbackProject}
        isLoading={isRollingBack}
      />

      <UpdateDeadlineModal
        isOpen={showUpdateDeadlineModal}
        onClose={() => setShowUpdateDeadlineModal(false)}
        project={project}
        onConfirm={handleUpdateDeadlineSubmit}
        isLoading={isUpdatingDeadline}
      />
    </ScrollView>
  )
}

export default ProjectDetails