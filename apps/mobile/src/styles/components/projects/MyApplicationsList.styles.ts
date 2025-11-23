// apps/mobile/src/styles/components/projects/MyApplicationsList.styles.ts

import { StyleSheet } from 'react-native'
import { ColorPalette } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { typography } from '../../theme/typography'

export const createMyApplicationsListStyles = (palette: ColorPalette, fontMode: string) =>
  StyleSheet.create({
    container: {
      flex: 1,
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
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    titleAccent: {
      color: palette.primary,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: spacing.xxl,
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
      paddingVertical: spacing.xxl,
      paddingHorizontal: spacing.md,
    },
    errorText: {
      marginTop: spacing.md,
      fontSize: typography.base,
      color: palette.errorText,
      textAlign: 'center',
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: palette.background,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: palette.grayLight,
      paddingHorizontal: spacing.md,
      marginHorizontal: spacing.md,
      marginBottom: spacing.md,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    searchIcon: {
      marginRight: spacing.xs,
    },
    searchInput: {
      flex: 1,
      paddingVertical: spacing.sm,
      fontSize: typography.base,
      color: palette.text,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    listContent: {
      paddingHorizontal: spacing.md,
      paddingBottom: spacing.md,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: spacing.xxl,
      paddingHorizontal: spacing.md,
    },
    emptyTitle: {
      fontSize: typography.xl,
      fontWeight: '600',
      color: palette.text,
      marginTop: spacing.md,
      marginBottom: spacing.xs,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    emptySubtitle: {
      fontSize: typography.base,
      color: palette.textSecondary,
      textAlign: 'center',
      marginBottom: spacing.md,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    createButton: {
      backgroundColor: palette.primary,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.lg,
      borderRadius: 8,
      marginTop: spacing.sm,
    },
    createButtonText: {
      fontSize: typography.base,
      fontWeight: '600',
      color: palette.onPrimary,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    paginationContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
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
      fontSize: typography.base,
      fontWeight: '600',
      color: palette.onPrimary,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    paginationText: {
      fontSize: typography.base,
      fontWeight: '500',
      color: palette.text,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    resultsText: {
      fontSize: typography.sm,
      color: palette.textSecondary,
      textAlign: 'center',
      paddingBottom: spacing.md,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
  })