// apps/mobile/src/styles/components/projects/AttachmentCard.styles.ts

import { StyleSheet } from 'react-native'
import { ColorPalette } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { typography } from '../../theme/typography'

export const createAttachmentCardStyles = (palette: ColorPalette, fontMode: string) =>
  StyleSheet.create({
    container: {
      backgroundColor: palette.background,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: palette.grayLight,
      padding: spacing.sm,
      marginBottom: spacing.sm,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    containerDisabled: {
      opacity: 0.5,
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    leftContent: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    iconContainer: {
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
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    metaInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    fileSize: {
      fontSize: typography.sm,
      color: palette.textSecondary,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    pdfHint: {
      fontSize: typography.sm,
      color: palette.primary,
      fontWeight: '500',
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    downloadButton: {
      backgroundColor: palette.primary,
      padding: spacing.xs,
      borderRadius: 6,
      marginLeft: spacing.sm,
    },
    downloadButtonDisabled: {
      backgroundColor: palette.gray,
      opacity: 0.5,
    },
  })