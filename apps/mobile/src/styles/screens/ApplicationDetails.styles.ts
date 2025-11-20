// apps/mobile/src/styles/screens/ApplicationDetails.styles.ts

import { StyleSheet } from 'react-native'
import { ColorPalette } from '../theme/colors'
import { spacing } from '../theme/spacing'
import { typography } from '../theme/typography'

export const createApplicationDetailsStyles = (palette: ColorPalette, fontMode: string) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: palette.surface,
    },
    header: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.lg,
    },
    title: {
      fontSize: typography.xl3,
      fontWeight: '700',
      color: palette.text,
    },
    titleAccent: {
      color: palette.primary,
    },
    content: {
      paddingHorizontal: spacing.md,
      paddingBottom: spacing.xxl,
    },
    sectionTitle: {
      fontSize: typography.xl,
      fontWeight: '700',
      color: palette.text,
      marginTop: spacing.lg,
      marginBottom: spacing.sm,
    },
    attachmentsTitle: {
      fontSize: typography.xl,
      fontWeight: '700',
      color: palette.text,
      marginTop: spacing.lg,
      marginBottom: spacing.sm,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
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
    },
    errorIcon: {
      marginBottom: spacing.md,
    },
    errorText: {
      fontSize: typography.base,
      color: palette.errorText,
      textAlign: 'center',
      marginBottom: spacing.md,
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
  })