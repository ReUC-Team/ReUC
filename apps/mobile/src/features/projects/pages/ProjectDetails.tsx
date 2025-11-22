// apps/mobile/src/features/projects/pages/ProjectDetails.tsx

import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Linking, Alert } from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { useThemedStyles, useThemedPalette } from '../../../hooks/useThemedStyles'
import { createProjectDetailsStyles } from '../../../styles/screens/ProjectDetails.styles'
import useProjectDetails from '../hooks/useProjectDetails'
import { downloadAllAttachments } from '../services/projectsService'
import Toast from 'react-native-toast-message'
import ProjectImage from '../components/ProjectImage'
import ProjectSummary from '../components/ProjectSummary'
import ProjectInfoCard from '../components/ProjectInfoCard'
import AttachmentCard from '../components/AttachmentCard'

const ProjectDetails: React.FC = () => {
  const styles = useThemedStyles(createProjectDetailsStyles)
  const palette = useThemedPalette()
  const route = useRoute<any>()
  const navigation = useNavigation<any>()
  const { uuid } = route.params || {}
  const [isDownloadingAll, setIsDownloadingAll] = useState(false)

  console.log('🔍 ProjectDetails - Route params:', route.params)
  console.log('🔍 ProjectDetails - UUID:', uuid)

  const { project, isLoading, error } = useProjectDetails(uuid)
  console.log('📦 Project data:', project)
  console.log('📎 Attachments:', project?.attachments)
  console.log('📎 Attachments length:', project?.attachments?.length)
  // Formatear fechas
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No especificada'
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  // Manejar contacto
  const handleContact = () => {
    if (project?.author?.email) {
      Linking.openURL(`mailto:${project.author.email}?subject=Consulta sobre proyecto: ${project.title}`)
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
          text1: '✅ Archivos descargados',
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

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>
            Detalles del <Text style={styles.titleAccent}>proyecto</Text>
          </Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={palette.primary} />
          <Text style={styles.loadingText}>Cargando detalles...</Text>
        </View>
      </View>
    )
  }

  // Error state
  if (error || !project) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>
            Detalles del <Text style={styles.titleAccent}>proyecto</Text>
          </Text>
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={palette.errorText} style={styles.errorIcon} />
          <Text style={styles.errorText}>{error || 'No se pudo cargar la información'}</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    )
  }

  // Determinar si es outsider o profesor
  const isOutsider = !!project.author?.organizationName
  const authorRole = isOutsider ? 'Outsider' : 'Profesor'

  // Información del autor
  const authorInfo = [
    { label: 'Nombre', value: project.author?.fullName || 'No especificado' },
    { label: 'Tipo de usuario', value: authorRole },
    { label: 'Información', value: isOutsider ? 'Proyecto solicitado por un outsider' : 'Proyecto creado por un profesor' },
    ...(isOutsider
      ? [
          { label: 'Organización', value: project.author?.organizationName || 'N/A' },
          { label: 'Teléfono de contacto', value: project.author?.phoneNumber || 'N/A' },
          { label: 'Ubicación', value: project.author?.location || 'N/A' },
        ]
      : []),
  ]

  // Información del proyecto
  const projectInfo = [
    {
      label: 'Tipo de proyecto',
      value:
        project.projectTypes?.length > 0
          ? project.projectTypes.map((pt: any) => (typeof pt === 'object' ? pt.name : pt)).join(', ')
          : 'No especificado',
    },
    {
      label: 'Facultades',
      value:
        project.faculties?.length > 0
          ? project.faculties.map((f: any) => (typeof f === 'object' ? f.name : f)).join(', ')
          : 'No especificada',
    },
    {
      label: 'Tipo de problemática',
      value:
        project.problemTypes?.length > 0
          ? project.problemTypes.map((pt: any) => (typeof pt === 'object' ? pt.name : pt)).join(', ')
          : 'No especificado',
    },
    {
      label: 'Fecha estimada',
      value: formatDate(project.deadline),
    },
    {
      label: 'Fecha de creación',
      value: formatDate(project.createdAt),
    },
    {
      label: 'Estado',
      value: project.status === 'approved' ? 'Aprobado' : project.status === 'pending' ? 'Pendiente' : project.status,
    },
  ]

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Detalles del <Text style={styles.titleAccent}>proyecto</Text>
        </Text>
      </View>

      <View style={styles.content}>
        {/* Banner */}
        {project.bannerUrl && <ProjectImage source={{ uri: project.bannerUrl }} alt={project.title} />}

        {/* Resumen */}
        <ProjectSummary title={project.title} description={project.detailedDescription} />

        {/* Información del solicitante */}
        <Text style={styles.sectionTitle}>
          Información del <Text style={styles.titleAccent}>solicitante</Text>
        </Text>
        <ProjectInfoCard items={authorInfo} />

        {/* Información del proyecto */}
        <Text style={styles.sectionTitle}>
          Información del <Text style={styles.titleAccent}>proyecto</Text>
        </Text>
        <ProjectInfoCard items={projectInfo} />

        {/* Archivos adjuntos */}
        {project.attachments && project.attachments.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>
              Documentos <Text style={styles.titleAccent}>adjuntos</Text>
            </Text>
            {project.attachments.map((file: any, index: number) => (
              <AttachmentCard key={`attachment-${index}`} file={file} />
            ))}
          </>
        )}

        {/* Botones de acción */}
        <View style={styles.actionsContainer}>
          {/* Botón Descargar Todos */}
          {project.attachments && project.attachments.length > 0 && (
            <TouchableOpacity
              style={[
                styles.downloadAllButton,
                isDownloadingAll && styles.downloadAllButtonDisabled,
              ]}
              onPress={handleDownloadAll}
              disabled={isDownloadingAll}
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
                    Descargar todos ({project.attachments.length})
                  </Text>
                </>
              )}
            </TouchableOpacity>
          )}

          {/* Botón Ponerse en Contacto */}
          {project.author?.email && (
            <TouchableOpacity
              style={[
                styles.contactButton,
                isDownloadingAll && styles.contactButtonDisabled,
              ]}
              onPress={handleContact}
              disabled={isDownloadingAll}
            >
              <Text style={styles.contactButtonText}>Ponerse en contacto</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  )
}

export default ProjectDetails