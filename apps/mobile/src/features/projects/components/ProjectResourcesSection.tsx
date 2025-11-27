// apps/mobile/src/features/projects/components/ProjectResourcesSection.tsx

import React from 'react'
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { ColorPalette } from '../../../styles/theme/colors'
import { spacing } from '../../../styles/theme/spacing'
import { typography } from '../../../styles/theme/typography'
import type { ProjectDetails } from '../types/project.types'
import { useProjectResources } from '../hooks/useProjectResources'
import ResourceItem from './ResourceItem'
import { StyleSheet } from 'react-native'

interface ProjectResourcesSectionProps {
  project: ProjectDetails
  canManage: boolean
  palette: ColorPalette
  fontMode: string
  onResourceChange: () => void
}

export default function ProjectResourcesSection({
  project,
  canManage,
  palette,
  fontMode,
  onResourceChange,
}: ProjectResourcesSectionProps) {
  const { uploadResource, updateResource, deleteResource, isLoading } =
    useProjectResources(project.uuid_project)

  const resources = project.resources || []

  const handleUpload = async () => {
    try {
      await uploadResource()
      onResourceChange()
    } catch (error) {
      // Error already handled in hook
    }
  }

  const handleUpdate = async (resourceUuid: string) => {
    try {
      await updateResource(resourceUuid)
      onResourceChange()
    } catch (error) {
      // Error already handled in hook
    }
  }

  const handleDelete = async (resourceUuid: string, resourceName: string) => {
    try {
      await deleteResource(resourceUuid, resourceName)
      onResourceChange()
    } catch (error) {
      // Error already handled in hook or cancelled
    }
  }

  const styles = createStyles(palette, fontMode)

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Recursos del </Text>
          <Text style={styles.titleAccent}>proyecto</Text>
        </View>

        {canManage && (
          <TouchableOpacity
            onPress={handleUpload}
            style={styles.uploadButton}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={palette.onPrimary} />
            ) : (
              <>
                <MaterialCommunityIcons
                  name="plus"
                  size={20}
                  color={palette.onPrimary}
                />
                <Text style={styles.uploadButtonText}>Subir recurso</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>

      {resources.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons
            name="file-document-outline"
            size={48}
            color={palette.gray}
          />
          <Text style={styles.emptyText}>
            No hay recursos subidos en este proyecto.
          </Text>
        </View>
      ) : (
        <ScrollView style={styles.resourcesList} nestedScrollEnabled>
          {resources.map((resource) => (
            <ResourceItem
              key={resource.uuid}
              resource={resource}
              teamMembers={project.teamMembers || []}
              canManage={canManage}
              palette={palette}
              fontMode={fontMode}
              onEdit={(res) => handleUpdate(res.uuid)}
              onDelete={(res) => handleDelete(res.uuid, res.name)}
            />
          ))}
        </ScrollView>
      )}
    </View>
  )
}

const createStyles = (palette: ColorPalette, fontMode: string) =>
  StyleSheet.create({
    container: {
      marginTop: spacing.lg,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    title: {
      fontSize: typography.xl,
      fontWeight: '600',
      color: palette.text,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    titleAccent: {
      fontSize: typography.xl,
      fontWeight: '600',
      color: palette.primary,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    uploadButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      backgroundColor: palette.primary,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: 8,
    },
    uploadButtonText: {
      fontSize: typography.sm,
      fontWeight: '600',
      color: palette.onPrimary,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    emptyState: {
      backgroundColor: palette.grayExtraLight,
      borderWidth: 1,
      borderColor: palette.grayLight,
      borderRadius: 8,
      padding: spacing.xl,
      alignItems: 'center',
    },
    emptyText: {
      fontSize: typography.base,
      color: palette.textSecondary,
      marginTop: spacing.sm,
      textAlign: 'center',
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Regular' : 'System',
    },
    resourcesList: {
      maxHeight: 400,
    },
  })