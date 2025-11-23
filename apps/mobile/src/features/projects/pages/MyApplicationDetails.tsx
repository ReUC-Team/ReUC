// apps/mobile/src/features/projects/pages/MyApplicationDetails.tsx

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

const MyApplicationDetails: React.FC = () => {
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
          <Text style={styles.errorText}>{error || 'No se pudo cargar la información'}</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    )
  }

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
          Detalles de <Text style={styles.titleAccent}>solicitud</Text>
        </Text>
      </View>

      <View style={styles.content}>
        {/* Banner */}
        {application.bannerUrl && (
          <ProjectImage source={{ uri: application.bannerUrl }} alt={application.title} />
        )}

        {/* Resumen */}
        <ProjectSummary title={application.title} description={application.detailedDescription} />

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
      </View>
    </ScrollView>
  )
}

export default MyApplicationDetails