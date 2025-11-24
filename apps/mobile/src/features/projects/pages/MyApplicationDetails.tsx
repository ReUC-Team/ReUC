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
import { formatDateStringSpanish } from '../../../utils/dateUtils'
import Toast from 'react-native-toast-message'
import ProjectImage from '../components/ProjectImage'
import ProjectSummary from '../components/ProjectSummary'
import ProjectInfoCard from '../components/ProjectInfoCard'
import AttachmentCard from '../components/AttachmentCard'
import ProjectStatusBadge from '../components/ProjectStatusBadge'

const MyApplicationDetails: React.FC = () => {
  const styles = useThemedStyles(createApplicationDetailsStyles)
  const palette = useThemedPalette()
  const route = useRoute<any>()
  const navigation = useNavigation<any>()
  const { uuid } = route.params || {}

  const { application, isLoading, error } = useApplicationDetails(uuid)
  const [isDownloadingAll, setIsDownloadingAll] = useState(false)

  
  const formatDate = (dateString?: string) => {
    
    
    if (!dateString) {
      console.log(' No date string provided')
      return 'No especificada'
    }
    
    try {
      const formatted = formatDateStringSpanish(dateString)
      
      
      if (!formatted || formatted === 'Invalid Date' || formatted === 'Invalid date') {
        console.log(' Invalid formatted date')
        return 'No especificada'
      }
      return formatted
    } catch (error) {
      console.error(' Error formatting date:', error)
      return 'No especificada'
    }
  }

  //  Helper para extraer nombres de arrays
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

  //  Información del proyecto con labels correctos
  const projectInfo = [
    {
      label: 'Tipo de proyecto',
      value: extractNames(application.projectTypes),
    },
    {
      label: 'Facultades',
      value: extractNames(application.faculties, 'No especificada'),
    },
    {
      label: 'Tipo de problemática',
      value: extractNames(application.problemTypes),
    },
    {
      label: 'Fecha límite',  
      value: formatDate(application.deadline),
    },
    {
      label: 'Fecha de creación',
      value: formatDate(application.createdAt),
    },
  ]

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>
          Detalles de <Text style={styles.titleAccent}>solicitud</Text>
        </Text>

        {/* Badge de estado */}
        {application.status && (
          <View style={{ marginTop: 8, alignItems: 'center' }}>
            <ProjectStatusBadge status={application.status} />
          </View>
        )}
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