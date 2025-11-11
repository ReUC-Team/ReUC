// apps/mobile/src/components/AttachmentsList.tsx

import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useThemedStyles, useThemedPalette } from '../../../hooks/useThemedStyles'
import { createAttachmentsListStyles } from '../../../styles/components/projects/AttachmentsList.styles'

interface Attachment {
  uri: string
  name: string
  size?: number
  mimeType?: string
}

interface AttachmentsListProps {
  attachments: Attachment[]
  onRemove: (index: number) => void
  onAdd: () => void
  maxFiles?: number
}

const AttachmentsList: React.FC<AttachmentsListProps> = ({
  attachments,
  onRemove,
  onAdd,
  maxFiles = 5,
}) => {
  const styles = useThemedStyles(createAttachmentsListStyles)
  const palette = useThemedPalette()

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return ''
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`
  }

  const getFileIcon = (mimeType?: string): string => {
    if (!mimeType) return 'document-outline'
    if (mimeType.includes('pdf')) return 'document-text'
    if (mimeType.includes('word')) return 'document'
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet'))
      return 'grid'
    if (mimeType.includes('powerpoint') || mimeType.includes('presentation'))
      return 'easel'
    if (mimeType.includes('image')) return 'image'
    if (mimeType.includes('zip')) return 'archive'
    return 'document-outline'
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Archivos adjuntos{' '}
        <Text style={styles.optional}>(opcional, máximo {maxFiles})</Text>
      </Text>

      {/* Botón para agregar archivos */}
      <TouchableOpacity
        style={[
          styles.addButton,
          attachments.length >= maxFiles && styles.addButtonDisabled,
        ]}
        onPress={onAdd}
        disabled={attachments.length >= maxFiles}
      >
        <View style={styles.addButtonContent}>
          <Ionicons
            name="add-circle-outline"
            size={24}
            color={
              attachments.length >= maxFiles
                ? palette.textSecondary
                : palette.primary
            }
          />
          <Text
            style={[
              styles.addButtonText,
              attachments.length >= maxFiles && styles.addButtonTextDisabled,
            ]}
          >
            Agregar archivos ({attachments.length}/{maxFiles})
          </Text>
        </View>
      </TouchableOpacity>

      {/* Lista de archivos adjuntos */}
      {attachments.map((file, index) => (
        <View key={index} style={styles.fileItem}>
          <View style={styles.fileIcon}>
            <Ionicons
              name={getFileIcon(file.mimeType) as any}
              size={24}
              color={palette.primary}
            />
          </View>

          <View style={styles.fileInfo}>
            <Text style={styles.fileName} numberOfLines={1}>
              {file.name}
            </Text>
            {file.size && (
              <Text style={styles.fileSize}>{formatFileSize(file.size)}</Text>
            )}
          </View>

          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => onRemove(index)}
          >
            <Ionicons name="close-circle" size={24} color={palette.error} />
          </TouchableOpacity>
        </View>
      ))}

      {attachments.length === 0 && (
        <Text style={styles.infoText}>
          Formatos: PDF, Word, Excel, PowerPoint, imágenes, ZIP, TXT
        </Text>
      )}
    </View>
  )
}

export default AttachmentsList