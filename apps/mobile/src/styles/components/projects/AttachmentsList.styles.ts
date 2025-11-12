// apps/mobile/src/styles/components/AttachmentsList.styles.ts

import { StyleSheet } from 'react-native'
import { ColorPalette } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { typography } from '../../theme/typography'

export const createAttachmentsListStyles = (palette: ColorPalette) =>
  StyleSheet.create({
    container: {
      marginBottom: spacing.md,
    },
    label: {
      fontSize: typography.base,
      fontWeight: '600',
      color: palette.text,
      marginBottom: spacing.xs,
    },
    optional: {
      fontSize: typography.sm,
      color: palette.textSecondary,
      fontWeight: '400',
    },
    addButton: {
      backgroundColor: palette.surface,
      borderWidth: 2,
      borderColor: palette.primary,
      borderStyle: 'dashed',
      borderRadius: 8,
      paddingVertical: spacing.md,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.sm,
    },
    addButtonDisabled: {
      borderColor: palette.grayLight,
      opacity: 0.5,
    },
    addButtonContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    addButtonText: {
      fontSize: typography.base,
      color: palette.primary,
      marginLeft: spacing.xs,
      fontWeight: '600',
    },
    addButtonTextDisabled: {
      color: palette.textSecondary,
    },
    fileItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: palette.surface,
      borderWidth: 1,
      borderColor: palette.grayLight,
      borderRadius: 8,
      padding: spacing.sm,
      marginBottom: spacing.xs,
    },
    fileIcon: {
      width: 40,
      height: 40,
      backgroundColor: palette.grayLight,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing.sm,
    },
    fileInfo: {
      flex: 1,
    },
    fileName: {
      fontSize: typography.sm,
      fontWeight: '600',
      color: palette.text,
      marginBottom: 2,
    },
    fileSize: {
      fontSize: typography.sm,
      color: palette.textSecondary,
    },
    removeButton: {
      padding: spacing.xs,
    },
    infoText: {
      fontSize: typography.sm,
      color: palette.textSecondary,
      marginTop: spacing.xs,
    },
  })