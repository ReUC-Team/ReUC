// apps/mobile/src/features/projects/pages/MyApplicationDetails.tsx

import React, { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Alert,
} from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { useThemedStyles, useThemedPalette } from '../../../hooks/useThemedStyles'
import { createApplicationDetailsStyles } from '../../../styles/screens/ApplicationDetails.styles'
import useApplicationDetails from '../hooks/useApplicationDetails'
import { downloadAllAttachments } from '../services/projectsService'
import Toast from 'react-native-toast-message'
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
  const [isDownloadingAll, setIsDownloadingAll] = useState(false)

  // Formatear fechas
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No especificada'
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  // Manejar descarga de todos los archivos
  const handleDownloadAll = async () => {
    if (!application?.attachments || application.attachments.length === 0) {
      Alert.alert('Sin archivos', 'No hay archivos para descargar')
      return
    }

    setIsDownloadingAll(true)

    try {
      const result = await downloadAllAttachments(application.attachments)

      if (result.failed > 0) {
        Alert.alert(
          'Descarga parcial',
          `Se descargaron ${result.successful} de ${application.attachments.length} archivos.\n\nErrores:\n${result.errors.join('\n')}`
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

  // Manejar contacto con soporte
  const handleContactSupport = () => {
    const supportEmail = 'soporte@reuc.com' 
    Linking.openURL(
      `mailto:${supportEmail}?subject=Consulta sobre solicitud: ${application?.title}`
    )
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

  // Información del proyecto
  const projectInfo = [
    {
      label: 'Tipo de proyecto',
      value:
        application.projectTypes?.length > 0
          ? application.projectTypes
              .map((pt: any) => (typeof pt === 'object' ? pt.name : pt))
              .join(', ')
          : 'No especificado',
    },
    {
      label: 'Facultades',
      value:
        application.faculties?.length > 0
          ? application.faculties.map((f: any) => (typeof f === 'object' ? f.name : f)).join(', ')
          : 'No especificada',
    },
    {
      label: 'Tipo de problemática',
      value:
        application.problemTypes?.length > 0
          ? application.problemTypes
              .map((pt: any) => (typeof pt === 'object' ? pt.name : pt))
              .join(', ')
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

  // Determinar el color e ícono del badge según el estado
  const getStatusBadgeStyles = () => {
    if (application.status === 'pending') {
      return {
        backgroundColor: `${palette.warning || '#FFA500'}20`,
        iconName: 'time-outline' as const,
        iconColor: palette.warning || '#FFA500',
        text: 'Pendiente de revisión',
      }
    } else if (application.status === 'approved') {
      return {
        backgroundColor: `${palette.success || '#4CAF50'}20`,
        iconName: 'checkmark-circle' as const,
        iconColor: palette.success || '#4CAF50',
        text: 'Aprobado',
      }
    } else if (application.status === 'rejected') {
      return {
        backgroundColor: `${palette.error || '#F44336'}20`,
        iconName: 'close-circle' as const,
        iconColor: palette.error || '#F44336',
        text: 'Rechazado',
      }
    }
    return {
      backgroundColor: `${palette.gray || '#9E9E9E'}20`,
      iconName: 'help-circle-outline' as const,
      iconColor: palette.gray || '#9E9E9E',
      text: application.status,
    }
  }

  const statusBadge = getStatusBadgeStyles()

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Detalles de <Text style={styles.titleAccent}>solicitud</Text>
        </Text>

        {/* Badge de estado */}
        <View style={[styles.statusBadge, { backgroundColor: statusBadge.backgroundColor }]}>
          <Ionicons name={statusBadge.iconName} size={16} color={statusBadge.iconColor} />
          <Text style={styles.statusBadgeText}>{statusBadge.text}</Text>
        </View>
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
        {application.attachments?.length > 0 && (
          <>
            <Text style={styles.attachmentsTitle}>
              Documentos <Text style={styles.titleAccent}>adjuntos</Text>
            </Text>
            {application.attachments.map((file: any, index: number) => (
              <AttachmentCard key={index} file={file} />
            ))}
          </>
        )}

        {/* Botones de acción */}
        <View style={styles.actionsContainer}>
          {/* Botón Descargar Todos */}
          <TouchableOpacity
            style={[
              styles.downloadAllButton,
              (isDownloadingAll || application.attachments?.length === 0) &&
                styles.downloadAllButtonDisabled,
            ]}
            onPress={handleDownloadAll}
            disabled={isDownloadingAll || application.attachments?.length === 0}
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
                  Descargar todos ({application.attachments?.length || 0})
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* Botón Contactar Soporte */}
          <TouchableOpacity
            style={[styles.contactButton, isDownloadingAll && styles.contactButtonDisabled]}
            onPress={handleContactSupport}
            disabled={isDownloadingAll}
          >
            <Text style={styles.contactButtonText}>Contactar soporte</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}

export default MyApplicationDetails