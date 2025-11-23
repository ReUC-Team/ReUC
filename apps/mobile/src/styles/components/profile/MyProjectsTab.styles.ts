// apps/mobile/src/styles/components/profile/MyProjectsTab.styles.ts

import { StyleSheet } from 'react-native'
import { ColorPalette } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { typography } from '../../theme/typography'

export const createMyProjectsTabStyles = (palette: ColorPalette, fontMode: string) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: palette.background,
    },
    listContent: {
      padding: spacing.md,
      paddingBottom: spacing.xl,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.xl,
      backgroundColor: palette.background,
    },
    loadingText: {
      marginTop: spacing.md,
      fontSize: typography.base,
      color: palette.textSecondary,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic' : 'System',
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.xl,
      backgroundColor: palette.background,
    },
    errorTitle: {
      fontSize: typography.lg,
      fontWeight: '600',
      color: palette.text,
      marginTop: spacing.md,
      marginBottom: spacing.xs,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic' : 'System',
    },
    errorText: {
      fontSize: typography.sm,
      color: palette.errorText,
      textAlign: 'center',
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic' : 'System',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.xl,
      backgroundColor: palette.background,
    },
    emptyTitle: {
      fontSize: typography.xl,
      fontWeight: '600',
      color: palette.text,
      marginTop: spacing.md,
      marginBottom: spacing.xs,
      textAlign: 'center',
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic' : 'System',
    },
    emptyText: {
      fontSize: typography.base,
      color: palette.textSecondary,
      textAlign: 'center',
      marginBottom: spacing.lg,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic' : 'System',
    },
    emptyButton: {
      backgroundColor: palette.primary,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.lg,
      borderRadius: 8,
    },
    emptyButtonText: {
      fontSize: typography.base,
      fontWeight: '600',
      color: palette.onPrimary,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic' : 'System',
    },
    paginationContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
    },
    paginationButton: {
      backgroundColor: palette.primary,
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.md,
      borderRadius: 8,
    },
    paginationButtonDisabled: {
      backgroundColor: palette.gray,
      opacity: 0.5,
    },
    paginationButtonText: {
      fontSize: typography.sm,
      fontWeight: '600',
      color: palette.onPrimary,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic' : 'System',
    },
    paginationText: {
      fontSize: typography.sm,
      fontWeight: '500',
      color: palette.text,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic' : 'System',
    },
    counterText: {
      fontSize: typography.sm,
      color: palette.textSecondary,
      textAlign: 'center',
      paddingBottom: spacing.md,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic' : 'System',
    },
  })