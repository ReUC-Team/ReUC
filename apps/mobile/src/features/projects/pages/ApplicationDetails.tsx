// apps/mobile/src/features/projects/pages/ApplicationDetails.tsx

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
import { approveApplication, downloadAllAttachments } from '../services/projectsService'
import { getDisplayMessage } from '../../../utils/errorHandler'
import Toast from 'react-native-toast-message'
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
  const [isApproving, setIsApproving] = useState(false)
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

  // Manejar contacto
  const handleContact = () => {
  if (application.author?.email) {
    Linking.openURL(
      `mailto:${application.author.email}?subject=Consulta sobre proyecto: ${application.title}`
    )
    return
  }

  if (application.author?.phoneNumber) {
    Linking.openURL(`tel:${application.author.phoneNumber}`)
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
          text1: ' Archivos descargados',
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

// Manejar aprobación
const handleApprove = async () => {
  Alert.alert(
    'Confirmar aprobación',
    `¿Estás seguro de que deseas aprobar el proyecto "${application?.title}"?\n\nEsto lo convertirá en un proyecto activo y aparecerá en "Mis Proyectos".`,
    [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Aprobar',
        style: 'default',
        onPress: async () => {
          if (!uuid) {
            console.error(' No hay UUID')
            // Justo antes del return
            console.log(' Application projectTypes:', application?.projectTypes)
            console.log(' Application faculties:', application?.faculties)
            console.log(' Application problemTypes:', application?.problemTypes)
            console.log(' Application deadline:', application?.deadline)
            return
          }

          setIsApproving(true)

          try {
            console.log(' Aprobando proyecto con UUID:', uuid)
            console.log(' Application data:', application)
            
            // ✅ Extraer IDs y filtrar nulls
            const projectTypeIds = application.projectTypes
              ?.map((pt: any) => pt?.project_type_id || pt?.id)
              .filter((id: any) => id != null) || []
            
            const facultyIds = application.faculties
              ?.map((f: any) => f?.faculty_id || f?.id)
              .filter((id: any) => id != null) || []
            
            const problemTypeIds = application.problemTypes
              ?.map((pt: any) => pt?.problem_type_id || pt?.id)
              .filter((id: any) => id != null) || []

            // ✅ Formatear fecha a YYYY-MM-DD
            const estimatedDate = application.deadline 
              ? new Date(application.deadline).toISOString().split('T')[0]
              : undefined

            console.log(' Extracted IDs:', {
              projectTypeIds,
              facultyIds,
              problemTypeIds,
              estimatedDate,
            })

            const projectData = {
              title: application.title,
              shortDescription: application.shortDescription,
              description: application.detailedDescription,
              estimatedDate,
              projectType: projectTypeIds,
              faculty: facultyIds,
              problemType: problemTypeIds,
            }

            console.log('📦 Project data to send:', projectData)
            
            await approveApplication(uuid, projectData)

            Toast.show({
              type: 'success',
              text1: ' Proyecto aprobado',
              text2: 'El proyecto ha sido aprobado exitosamente',
              position: 'bottom',
              visibilityTime: 3000,
            })

            setTimeout(() => {
              navigation.navigate('MyProjects')
            }, 1500)
          } catch (error: any) {
            console.error(' Error aprobando proyecto:', error)

            Toast.show({
              type: 'error',
              text1: 'Error al aprobar',
              text2: getDisplayMessage(error),
              position: 'bottom',
              visibilityTime: 4000,
            })
          } finally {
            setIsApproving(false)
          }
        },
      },
    ]
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

  // Determinar si es outsider o profesor
  const isOutsider = !!application.author?.organizationName
  const authorRole = isOutsider ? 'Outsider' : 'Profesor'

  // Información del autor
  const authorInfo = [
    { label: 'Nombre', value: application.author?.fullName || 'No especificado' },
    { label: 'Tipo de usuario', value: authorRole },
    ...(isOutsider
      ? [
          { label: 'Organización', value: application.author?.organizationName || 'N/A' },
          { label: 'Teléfono de contacto', value: application.author?.phoneNumber || 'N/A' },
          { label: 'Ubicación', value: application.author?.location || 'N/A' },
        ]
      : [{ label: 'Información', value: 'Proyecto creado por un profesor' }]),
  ]

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

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
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
          {/* Botón Aceptar Proyecto */}
          <TouchableOpacity
            style={[styles.approveButton, isApproving && styles.approveButtonDisabled]}
            onPress={handleApprove}
            disabled={isApproving}
          >
            {isApproving ? (
              <>
                <ActivityIndicator size="small" color={palette.onPrimary} />
                <Text style={styles.approveButtonText}>Aprobando...</Text>
              </>
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={20} color={palette.onPrimary} />
                <Text style={styles.approveButtonText}>Aceptar proyecto</Text>
              </>
            )}
          </TouchableOpacity>

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

          {/* Botón Ponerse en Contacto */}
        {(application.author?.email || application.author?.phoneNumber) && (
        <TouchableOpacity
            style={[
            styles.contactButton,
            (isApproving || isDownloadingAll) && styles.contactButtonDisabled,
            ]}
            onPress={handleContact}
            disabled={isApproving || isDownloadingAll}
        >
            <Text style={styles.contactButtonText}>Ponerse en contacto</Text>
        </TouchableOpacity>
        )}
        </View>
      </View>
    </ScrollView>
  )
}

export default ApplicationDetails