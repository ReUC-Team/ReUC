// apps/mobile/src/features/projects/pages/ApplicationDetails.tsx

import React from 'react'
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Linking } from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { useThemedStyles, useThemedPalette } from '../../../hooks/useThemedStyles'
import { createApplicationDetailsStyles } from '../../../styles/screens/ApplicationDetails.styles'
import useApplicationDetails from '../hooks/useApplicationDetails'
import ProjectImage from '../components/ProjectImage'
import ProjectSummary from '../components/ProjectSummary'
import ProjectInfoCard from '../components/ProjectInfoCard'
import AttachmentCard from '../components/AttachmentCard'

const ApplicationDetails: React.FC = () => {
  const styles = useThemedStyles(createApplicationDetailsStyles)
  const palette = useThemedPalette()
  const route = useRoute<any>()
  const navigation = useNavigation<any>()
  const { uuid } = route.params || {}

  const { application, isLoading, error } = useApplicationDetails(uuid)

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
    if (application?.author?.email) {
      Linking.openURL(`mailto:${application.author.email}?subject=Consulta sobre proyecto: ${application.title}`)
    }
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
  if (error || !application) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={palette.errorText} style={styles.errorIcon} />
          <Text style={styles.errorText}>{error || 'Proyecto no encontrado'}</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    )
  }

  // Determinar si es outsider o profesor
  const isOutsider = !!application.author.organizationName
  const authorRole = isOutsider ? 'Outsider' : 'Profesor'

  // Información del autor
  const authorInfo = [
    { label: 'Nombre', value: application.author.fullName },
    { label: 'Tipo de usuario', value: authorRole },
    ...(isOutsider
      ? [
          { label: 'Organización', value: application.author.organizationName || 'N/A' },
          { label: 'Teléfono de contacto', value: application.author.phoneNumber || 'N/A' },
          { label: 'Ubicación', value: application.author.location || 'N/A' },
        ]
      : [{ label: 'Información', value: 'Proyecto creado por un profesor' }]),
  ]

  // Información del proyecto
  const projectInfo = [
    {
      label: 'Tipo de proyecto',
      value:
        application.projectTypes.length > 0
          ? application.projectTypes.map((pt: any) => (typeof pt === 'object' ? pt.name : pt)).join(', ')
          : 'No especificado',
    },
    {
      label: 'Facultades',
      value:
        application.faculties.length > 0
          ? application.faculties.map((f: any) => (typeof f === 'object' ? f.name : f)).join(', ')
          : 'No especificada',
    },
    {
      label: 'Tipo de problemática',
      value:
        application.problemTypes.length > 0
          ? application.problemTypes.map((pt: any) => (typeof pt === 'object' ? pt.name : pt)).join(', ')
          : 'No especificado',
    },
    {
      label: 'Fecha estimada',
      value: formatDate(application.deadline),
    },
    {
      label: 'Fecha de creación',
      value: formatDate(application.createdAt),
    },
    {
      label: 'Estado',
      value:
        application.status === 'pending'
          ? 'Pendiente'
          : application.status === 'approved'
          ? 'Aprobado'
          : application.status === 'rejected'
          ? 'Rechazado'
          : application.status,
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
        {application.bannerUrl && (
          <ProjectImage source={{ uri: application.bannerUrl }} alt={application.title} />
        )}

        {/* Resumen */}
        <ProjectSummary title={application.title} description={application.detailedDescription} />

        {/* Información del autor */}
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
        {application.attachments.length > 0 && (
          <>
            <Text style={styles.attachmentsTitle}>
              Documentos <Text style={styles.titleAccent}>adjuntos</Text>
            </Text>
            {application.attachments.map((file: any, index: number) => (
              <AttachmentCard key={index} file={file} />
            ))}
          </>
        )}

        {/* Botón de contacto */}
        {application.author.email && (
          <TouchableOpacity
            style={{
              backgroundColor: 'transparent',
              borderWidth: 2,
              borderColor: palette.primary,
              paddingVertical: 14,
              borderRadius: 8,
              alignItems: 'center',
              marginTop: 24,
            }}
            onPress={handleContact}
          >
            <Text style={{ color: palette.primary, fontSize: 16, fontWeight: '600' }}>Ponerse en contacto</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  )
}

export default ApplicationDetails