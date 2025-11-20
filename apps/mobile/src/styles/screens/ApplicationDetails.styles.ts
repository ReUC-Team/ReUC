// apps/mobile/src/styles/screens/ApplicationDetails.styles.ts

import { StyleSheet } from 'react-native'
import { ColorPalette } from '../theme/colors'
import { spacing } from '../theme/spacing'
import { typography } from '../theme/typography'

export const createApplicationDetailsStyles = (palette: ColorPalette, fontMode: string) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: palette.background,
    },
    header: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.lg,
      alignItems: 'center',
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

    // ============================================
    // ESTILOS DE BOTONES DE ACCIÓN
    // ============================================
    actionsContainer: {
      marginTop: spacing.lg,
      gap: spacing.sm,
      marginBottom: spacing.xl,
    },
    
    approveButton: {
      backgroundColor: palette.primary,
      paddingVertical: spacing.md,
      borderRadius: 8,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      gap: spacing.xs,
    },
    approveButtonDisabled: {
      opacity: 0.6,
    },
    approveButtonText: {
      color: palette.onPrimary,
      fontSize: typography.base,
      fontWeight: '600',
    },
    
    downloadAllButton: {
      backgroundColor: palette.gray,
      paddingVertical: spacing.md,
      borderRadius: 8,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      gap: spacing.xs,
    },
    downloadAllButtonDisabled: {
      opacity: 0.5,
    },
    downloadAllButtonText: {
      color: palette.onPrimary,
      fontSize: typography.base,
      fontWeight: '600',
    },
    
    contactButton: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: palette.primary,
      paddingVertical: spacing.md,
      borderRadius: 8,
      alignItems: 'center',
    },
    contactButtonDisabled: {
      opacity: 0.5,
      borderColor: palette.gray,
    },
    contactButtonText: {
      color: palette.primary,
      fontSize: typography.base,
      fontWeight: '600',
    },
  })