// apps/mobile/src/styles/components/projects/ExploreProjectsList.styles.ts

import { StyleSheet } from 'react-native'
import { ColorPalette } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { typography } from '../../theme/typography'

export const createExploreProjectsListStyles = (palette: ColorPalette, fontMode: string) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: palette.background,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: spacing.xxl,
      backgroundColor: palette.background,
    },
    loadingText: {
      marginTop: spacing.md,
      fontSize: typography.base,
      color: palette.textSecondary,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: spacing.xxl,
      paddingHorizontal: spacing.md,
      backgroundColor: palette.background,
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
      backgroundColor: palette.surface,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: palette.grayLight,
      paddingHorizontal: spacing.md,
      marginHorizontal: spacing.md,
      marginTop: spacing.md,
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
    filtersSection: {
      marginBottom: spacing.md,
    },
    filtersTitle: {
      fontSize: typography.base,
      fontWeight: '600',
      color: palette.text,
      marginHorizontal: spacing.md,
      marginBottom: spacing.sm,
      textAlign: 'center',
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    filtersContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: spacing.xs,
      paddingHorizontal: spacing.md,
    },
    filterTag: {
      backgroundColor: palette.graybtn,
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.md,
      borderRadius: 20,
      marginHorizontal: spacing.xxs,
      marginVertical: spacing.xxs,
    },
    filterTagActive: {
      backgroundColor: palette.primary,
    },
    filterTagText: {
      fontSize: typography.sm,
      fontWeight: '600',
      color: palette.onGBtn,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    filterTagTextActive: {
      color: palette.onPrimary,
    },
    cardWrapper: {
      paddingHorizontal: spacing.md,
      marginBottom: spacing.sm,
    },
    emptyContainer: {
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
      textAlign: 'center',
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    emptySubtitle: {
      fontSize: typography.base,
      color: palette.textSecondary,
      textAlign: 'center',
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    paginationContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      marginTop: spacing.md,
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
      paddingVertical: spacing.md,
      paddingBottom: spacing.xxl,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
  })