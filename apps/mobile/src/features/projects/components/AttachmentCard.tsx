// apps/mobile/src/features/projects/components/AttachmentCard.tsx

import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Linking } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useThemedStyles, useThemedPalette } from '../../../hooks/useThemedStyles'
import { createAttachmentCardStyles } from '../../../styles/components/projects/AttachmentCard.styles'
import { downloadFile } from '../services/projectsService'
import Toast from 'react-native-toast-message'

interface AttachmentCardProps {
  file: {
    downloadUrl: string
    name: string
    size?: number
    type?: string
  }
}

const AttachmentCard: React.FC<AttachmentCardProps> = ({ file }) => {
  const styles = useThemedStyles(createAttachmentCardStyles)
  const palette = useThemedPalette()
  const [isDownloading, setIsDownloading] = useState(false)

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return ''
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`
  }

  const getFileIcon = (mimeType?: string): any => {
    if (!mimeType) return 'document-outline'
    if (mimeType.includes('pdf')) return 'document-text'
    if (mimeType.includes('word')) return 'document'
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'grid'
    if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return 'easel'
    if (mimeType.includes('image')) return 'image'
    if (mimeType.includes('zip')) return 'archive'
    return 'document-outline'
  }

  const handleCardClick = async () => {
    if (isDownloading) return

    setIsDownloading(true)

    try {
      // PDFs: abrir en navegador, otros: descargar
      if (file.type === 'application/pdf') {
        await Linking.openURL(file.downloadUrl)
      } else {
        await downloadFile(file.downloadUrl, file.name)
      }
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Error al abrir archivo',
        text2: err.message || 'Error desconocido',
        position: 'bottom',
      })
    } finally {
      setIsDownloading(false)
    }
  }

  const handleDownload = async () => {
    if (isDownloading) return

    setIsDownloading(true)

    try {
      await downloadFile(file.downloadUrl, file.name)
      Toast.show({
        type: 'success',
        text1: 'Descarga iniciada',
        position: 'bottom',
      })
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Error al descargar',
        text2: err.message || 'Error desconocido',
        position: 'bottom',
      })
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <TouchableOpacity
      style={[styles.container, isDownloading && styles.containerDisabled]}
      onPress={handleCardClick}
      disabled={isDownloading}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        {/* Icono y nombre */}
        <View style={styles.leftContent}>
          <View style={styles.iconContainer}>
            <Ionicons name={getFileIcon(file.type)} size={24} color={palette.primary} />
          </View>

          <View style={styles.fileInfo}>
            <Text style={styles.fileName} numberOfLines={1}>
              {file.name}
            </Text>

            <View style={styles.metaInfo}>
              {file.size && <Text style={styles.fileSize}>{formatFileSize(file.size)}</Text>}

              {file.type === 'application/pdf' && (
                <Text style={styles.pdfHint}>• Click para vista previa</Text>
              )}
            </View>
          </View>
        </View>

        {/* Botón de descarga */}
        <TouchableOpacity
          style={[styles.downloadButton, isDownloading && styles.downloadButtonDisabled]}
          onPress={handleDownload}
          disabled={isDownloading}
        >
          {isDownloading ? (
            <Ionicons name="hourglass-outline" size={20} color={palette.onPrimary} />
          ) : (
            <Ionicons name="download-outline" size={20} color={palette.onPrimary} />
          )}
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )
}

export default AttachmentCard