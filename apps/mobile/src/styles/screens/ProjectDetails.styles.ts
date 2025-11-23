// apps/mobile/src/styles/screens/ProjectDetails.styles.ts

import { StyleSheet } from 'react-native'
import { ColorPalette } from '../theme/colors'
import { spacing } from '../theme/spacing'
import { typography } from '../theme/typography'

export const createProjectDetailsStyles = (palette: ColorPalette, fontMode: string) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: palette.background,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: palette.background,
    },
    loadingText: {
      marginTop: spacing.md,
      fontSize: typography.base,
      color: palette.textSecondary,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      backgroundColor: palette.background,
    },
    errorIcon: {
      marginBottom: spacing.md,
    },
    errorText: {
      fontSize: typography.base,
      color: palette.errorText,
      textAlign: 'center',
      marginBottom: spacing.lg,
    },
    backButton: {
      backgroundColor: palette.primary,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.lg,
      borderRadius: 8,
    },
    backButtonText: {
      fontSize: typography.base,
      fontWeight: '600',
      color: palette.onPrimary,
    },
    header: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.lg,
      alignItems: 'center',
      backgroundColor: palette.background,
    },
    title: {
      fontSize: typography.xl3,
      fontWeight: '700',
      color: palette.text,
      textAlign: 'center',
    },
    titleAccent: {
      color: palette.primary,
    },
    content: {
      paddingHorizontal: spacing.md,
      paddingBottom: spacing.xl,
    },
    sectionTitle: {
      fontSize: typography.xl,
      fontWeight: '600',
      color: palette.text,
      marginTop: spacing.lg,
      marginBottom: spacing.md,
    },
    actionsContainer: {
      marginTop: spacing.lg,
      gap: spacing.sm,
    },
    downloadAllButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: palette.onGBtn,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: 8,
      gap: spacing.xs,
    },
    downloadAllButtonDisabled: {
      backgroundColor: palette.gray,
      opacity: 0.5,
    },
    downloadAllButtonText: {
      fontSize: typography.base,
      fontWeight: '600',
      color: palette.onPrimary,
    },
    contactButton: {
      backgroundColor: palette.surface,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: 8,
      borderWidth: 2,
      borderColor: palette.primary,
    },
    contactButtonDisabled: {
      opacity: 0.5,
    },
    contactButtonText: {
      fontSize: typography.base,
      fontWeight: '600',
      color: palette.primary,
      textAlign: 'center',
    },
  })