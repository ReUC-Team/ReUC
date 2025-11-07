// apps/mobile/src/styles/components/ProfileIncompleteModal.styles.ts

import { StyleSheet } from 'react-native'
import { ColorPalette } from '../theme/colors'
import { spacing } from '../theme/spacing'
import { typography } from '../theme/typography'

export const createProfileIncompleteModalStyles = (palette: ColorPalette, fontMode: string) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.md,
    },
    modal: {
      backgroundColor: palette.surface,
      borderRadius: 12,
      padding: spacing.lg,
      width: '100%',
      maxWidth: 400,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    iconContainer: {
      backgroundColor: '#FEF3C7',
      padding: spacing.xs,
      borderRadius: 20,
      marginRight: spacing.sm,
    },
    title: {
      flex: 1,
      fontSize: typography.lg,
      fontWeight: '600',
      color: palette.text,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic' : 'System',
    },
    closeButton: {
      padding: spacing.xxs,
    },
    body: {
      marginBottom: spacing.lg,
    },
    message: {
      fontSize: typography.base,
      color: palette.textSecondary,
      marginBottom: spacing.xs,
      lineHeight: 20,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic' : 'System',
    },
    subMessage: {
      fontSize: typography.sm,
      color: palette.textSecondary,
      lineHeight: 18,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic' : 'System',
    },
    actions: {
      gap: spacing.sm,
    },
    primaryButton: {
      backgroundColor: palette.primary,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: 8,
      alignItems: 'center',
    },
    primaryButtonText: {
      color: palette.onPrimary,
      fontSize: typography.base,
      fontWeight: '600',
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic' : 'System',
    },
    secondaryButton: {
      backgroundColor: palette.graybtn,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: 8,
      alignItems: 'center',
    },
    secondaryButtonText: {
      color: palette.textSecondary,
      fontSize: typography.base,
      fontWeight: '600',
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic' : 'System',
    },
  })