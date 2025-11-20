// apps/mobile/src/features/projects/pages/ProjectDetails.tsx

import React from 'react'
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Linking } from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { useThemedStyles, useThemedPalette } from '../../../hooks/useThemedStyles'
import { createProjectDetailsStyles } from '../../../styles/screens/ProjectDetails.styles'
import useProjectDetails from '../hooks/useProjectDetails'
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

  const { project, isLoading, error } = useProjectDetails(uuid)

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

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>
            Detalles del <Text style={styles.titleAccent}>proyecto</Text>
          </Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={palette.primary} />
          <Text style={{ marginTop: 16, fontSize: 14, color: palette.textSecondary }}>
            Cargando detalles...
          </Text>
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
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
          <Ionicons name="alert-circle-outline" size={48} color={palette.errorText} />
          <Text
            style={{
              marginTop: 16,
              fontSize: 14,
              color: palette.errorText,
              textAlign: 'center',
              marginBottom: 16,
            }}
          >
            {error || 'No se pudo cargar la información'}
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: palette.primary,
              paddingVertical: 12,
              paddingHorizontal: 24,
              borderRadius: 8,
            }}
            onPress={() => navigation.goBack()}
          >
            <Text style={{ fontSize: 14, fontWeight: '600', color: palette.onPrimary }}>Volver</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    )
  }

  // Determinar si es outsider o profesor
  const isOutsider = !!project.author.organizationName

  // Información del autor
  const authorInfo = [
    { label: 'Nombre', value: project.author.fullName },
    ...(isOutsider
      ? [
          { label: 'Organización', value: project.author.organizationName || 'N/A' },
          { label: 'Teléfono de contacto', value: project.author.phoneNumber || 'N/A' },
          { label: 'Ubicación', value: project.author.location || 'N/A' },
        ]
      : []),
  ]

  // Información del proyecto
  const projectInfo = [
    {
      label: 'Tipo de proyecto',
      value:
        project.projectTypes.length > 0
          ? project.projectTypes.map((pt: any) => (typeof pt === 'object' ? pt.name : pt)).join(', ')
          : 'No especificado',
    },
    {
      label: 'Facultades',
      value:
        project.faculties.length > 0
          ? project.faculties.map((f: any) => (typeof f === 'object' ? f.name : f)).join(', ')
          : 'No especificada',
    },
    {
      label: 'Tipo de problemática',
      value:
        project.problemTypes.length > 0
          ? project.problemTypes.map((pt: any) => (typeof pt === 'object' ? pt.name : pt)).join(', ')
          : 'No especificado',
    },
    {
      label: 'Fecha estimada',
      value: formatDate(project.deadline),
    },
  ]

  return (
    <ScrollView style={styles.container}>
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
        {authorInfo.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>
              Información del <Text style={styles.titleAccent}>solicitante</Text>
            </Text>
            <ProjectInfoCard items={authorInfo} />
          </>
        )}

        {/* Información del proyecto */}
        <Text style={styles.sectionTitle}>
          Información del <Text style={styles.titleAccent}>proyecto</Text>
        </Text>
        <ProjectInfoCard items={projectInfo} />

        {/* Archivos adjuntos */}
        {project.attachments.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>
              Documentos <Text style={styles.titleAccent}>adjuntos</Text>
            </Text>
            {project.attachments.map((file: any, index: number) => (
              <AttachmentCard key={index} file={file} />
            ))}
          </>
        )}

        {/* Botón de contacto */}
        {project.author.email && (
          <TouchableOpacity style={styles.contactButton} onPress={handleContact}>
            <Text style={styles.contactButtonText}>Ponerse en contacto</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  )
}

export default ProjectDetails