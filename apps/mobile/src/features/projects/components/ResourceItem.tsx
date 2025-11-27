// apps/mobile/src/features/projects/components/ResourceItem.tsx

import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { ColorPalette } from '../../../styles/theme/colors'
import { spacing } from '../../../styles/theme/spacing'
import { typography } from '../../../styles/theme/typography'
import type { ProjectResource, TeamMember } from '../types/project.types'
import { StyleSheet } from 'react-native'
import * as FileSystem from 'expo-file-system'
import * as Sharing from 'expo-sharing'

interface ResourceItemProps {
  resource: ProjectResource
  teamMembers: TeamMember[]
  canManage: boolean
  palette: ColorPalette
  fontMode: string
  onEdit: (resource: ProjectResource) => void
  onDelete: (resource: ProjectResource) => void
}

export default function ResourceItem({
  resource,
  teamMembers,
  canManage,
  palette,
  fontMode,
  onEdit,
  onDelete,
}: ResourceItemProps) {
  const isDeleted = !!resource.deletedAt
  
  const author = teamMembers.find((member) => member.uuid_user === resource.uuidAuthor)
  const authorName = author?.fullName || 'Desconocido'

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate)
    return date.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const handleDownload = async () => {
    try {
      const fileUri = FileSystem.documentDirectory + resource.name
      
      const downloadResult = await FileSystem.downloadAsync(
        resource.downloadUrl,
        fileUri
      )

      if (downloadResult.status === 200) {
        const canShare = await Sharing.isAvailableAsync()
        if (canShare) {
          await Sharing.shareAsync(downloadResult.uri)
        }
      }
    } catch (error) {
      console.error('Error downloading file:', error)
    }
  }

  const styles = createStyles(palette, fontMode, isDeleted)

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name="file-document-outline"
            size={24}
            color={palette.primary}
          />
        </View>
        
        <View style={styles.info}>
          <Text
            style={styles.fileName}
            numberOfLines={1}
            ellipsizeMode="middle"
          >
            {resource.name}
          </Text>
          <View style={styles.meta}>
            <Text style={styles.metaText}>{formatDate(resource.createdAt)}</Text>
            <Text style={styles.metaText}> • </Text>
            <Text style={styles.metaText}>{authorName}</Text>
            {isDeleted && (
              <>
                <Text style={styles.metaText}> • </Text>
                <Text style={styles.deletedText}>Eliminado</Text>
              </>
            )}
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          onPress={handleDownload}
          style={styles.actionButton}
        >
          <MaterialCommunityIcons
            name="download"
            size={20}
            color={palette.primary}
          />
        </TouchableOpacity>

        {canManage && !isDeleted && (
          <>
            <TouchableOpacity
              onPress={() => onEdit(resource)}
              style={styles.actionButton}
            >
              <MaterialCommunityIcons
                name="refresh"
                size={20}
                color="#3B82F6"
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onDelete(resource)}
              style={styles.actionButton}
            >
              <MaterialCommunityIcons
                name="delete-outline"
                size={20}
                color="#DC2626"
              />
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  )
}

const createStyles = (palette: ColorPalette, fontMode: string, isDeleted: boolean) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: spacing.md,
      backgroundColor: isDeleted ? '#FEE2E2' : palette.surface,
      borderWidth: 1,
      borderColor: isDeleted ? '#FCA5A5' : palette.grayLight,
      borderRadius: 8,
      marginBottom: spacing.sm,
    },
    content: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: spacing.sm,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 8,
      backgroundColor: `${palette.primary}20`,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing.sm,
    },
    info: {
      flex: 1,
    },
    fileName: {
      fontSize: typography.base,
      fontWeight: '600',
      color: isDeleted ? palette.gray : palette.text,
      marginBottom: spacing.xxs,
      textDecorationLine: isDeleted ? 'line-through' : 'none',
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    meta: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    metaText: {
      fontSize: typography.xs,
      color: palette.textSecondary,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Regular' : 'System',
    },
    deletedText: {
      fontSize: typography.xs,
      color: '#DC2626',
      fontWeight: '600',
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    actions: {
      flexDirection: 'row',
      gap: spacing.xs,
    },
    actionButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: palette.grayExtraLight,
    },
  })