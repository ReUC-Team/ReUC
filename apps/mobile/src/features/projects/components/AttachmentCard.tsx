// apps/mobile/src/features/projects/components/AttachmentCard.tsx

import React, { useState } from 'react'
import { View, Text, TouchableOpacity, ActivityIndicator, Linking, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useThemedStyles, useThemedPalette } from '../../../hooks/useThemedStyles'
import { createAttachmentCardStyles } from '../../../styles/components/projects/AttachmentCard.styles'

interface AttachmentCardProps {
  file: {
    uuid_file?: string
    filename: string
    mimeType: string
    size: number
    url: string
  }
}

const AttachmentCard: React.FC<AttachmentCardProps> = ({ file }) => {
  const styles = useThemedStyles(createAttachmentCardStyles)
  const palette = useThemedPalette()
  const [isDownloading, setIsDownloading] = useState(false)
  const [isOpening, setIsOpening] = useState(false)


  const getDecodedFilename = (filename: string): string => {
    try {
      return decodeURIComponent(filename)
    } catch {
      return filename
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (!bytes) return '0 Bytes'
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`
  }

  const getFileIcon = (mimeType: string): string => {
    if (!mimeType) return 'document-outline'

    if (mimeType.includes('pdf')) return 'document-text'
    if (mimeType.includes('word') || mimeType.includes('document')) return 'document'
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'grid'
    if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return 'easel'
    if (mimeType.includes('image')) return 'image'
    if (mimeType.includes('video')) return 'videocam'
    if (mimeType.includes('audio')) return 'musical-notes'
    if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('compressed'))
      return 'archive'
    if (mimeType.includes('text')) return 'document-text-outline'

    return 'document-outline'
  }

  //  VISTA PREVIA - Abre en navegador para VISUALIZAR (solo PDFs)
  const handlePreview = async () => {
    if (isOpening || isDownloading || !file.url) return

    console.log(' Opening file for preview:', file.filename, file.url)
    setIsOpening(true)

    try {
      const canOpen = await Linking.canOpenURL(file.url)
      if (canOpen) {
        await Linking.openURL(file.url)
      } else {
        Alert.alert('Error', 'No se puede abrir este archivo para vista previa')
      }
    } catch (error: any) {
      console.error(' Error opening file for preview:', error)
      
      if (error.message?.includes('expired') || error.message?.includes('Authentication')) {
        Alert.alert(
          'Enlace expirado',
          'El enlace ha expirado. Por favor, vuelve a la lista y entra de nuevo a los detalles.',
          [{ text: 'OK' }]
        )
      } else {
        Alert.alert('Error', error.message || 'No se pudo abrir el archivo')
      }
    } finally {
      setIsOpening(false)
    }
  }

  //  DESCARGA - Abre en navegador con intención de descarga
  const handleDownload = async () => {
    if (isDownloading || isOpening || !file.url) return

    setIsDownloading(true)

    try {

      const decodedFilename = getDecodedFilename(file.filename)

      // Abrir la URL en el navegador - el sistema operativo manejará la descarga
      const canOpen = await Linking.canOpenURL(file.url)
      if (canOpen) {
        await Linking.openURL(file.url)
        
        // Mensaje informativo
        setTimeout(() => {
          Alert.alert(
            'Descarga iniciada',
            `${decodedFilename} se está descargando. Revisa tu carpeta de descargas.`,
            [{ text: 'OK' }]
          )
        }, 500)
      } else {
        Alert.alert('Error', 'No se puede descargar este archivo')
      }
    } catch (error: any) {
      console.error(' Error downloading file:', error)
      
      if (error.message?.includes('expired') || error.message?.includes('Authentication')) {
        Alert.alert(
          'Enlace expirado',
          'El enlace ha expirado. Por favor, vuelve a la lista y entra de nuevo a los detalles.',
          [{ text: 'OK' }]
        )
      } else {
        Alert.alert('Error al descargar', error.message || 'No se pudo descargar el archivo')
      }
    } finally {
      setIsDownloading(false)
    }
  }

  const iconName = getFileIcon(file.mimeType)
  const isPDF = file.mimeType.includes('pdf')
  const decodedFilename = getDecodedFilename(file.filename)
  const isLoading = isDownloading || isOpening

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.content}
        onPress={isPDF ? handlePreview : undefined}
        disabled={isLoading || !isPDF}
        activeOpacity={isPDF ? 0.7 : 1}
      >
        <View style={styles.iconContainer}>
          {isOpening ? (
            <ActivityIndicator size="small" color={palette.primary} />
          ) : (
            <Ionicons name={iconName as any} size={24} color={palette.primary} />
          )}
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.filename} numberOfLines={2}>
            {decodedFilename || 'Archivo sin nombre'}
          </Text>
          
          <Text style={styles.fileSize}>{formatFileSize(file.size)}</Text>
          
          {isPDF && !isLoading && (
            <Text style={styles.previewHint}> Toca para vista previa</Text>
          )}
          
          {isOpening && (
            <Text style={[styles.previewHint, { color: palette.primary }]}>Abriendo vista previa...</Text>
          )}
          
          {isDownloading && (
            <Text style={[styles.previewHint, { color: palette.primary }]}>Descargando...</Text>
          )}
        </View>

        <TouchableOpacity
          style={[styles.downloadButton, isLoading && styles.downloadButtonDisabled]}
          onPress={(e) => {
            e.stopPropagation()
            handleDownload()
          }}
          disabled={isLoading}
        >
          {isDownloading ? (
            <ActivityIndicator size="small" color={palette.background} />
          ) : (
            <Ionicons name="download-outline" size={20} color={palette.background} />
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  )
}

export default AttachmentCard