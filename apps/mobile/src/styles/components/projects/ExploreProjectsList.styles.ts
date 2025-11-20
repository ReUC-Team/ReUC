// apps/mobile/src/styles/components/projects/ExploreProjectsList.styles.ts

import { StyleSheet } from 'react-native'
import { ColorPalette } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { typography } from '../../theme/typography'

export const createExploreProjectsListStyles = (palette: ColorPalette, fontMode: string) =>
  StyleSheet.create({
    container: {
      flex: 1,
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
    },
    filtersContainer: {
      marginBottom: spacing.md,
    },
    filtersList: {
      paddingHorizontal: spacing.md,
      gap: spacing.sm,
    },
    filterTag: {
      backgroundColor: palette.graybtn,
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.md,
      borderRadius: 20,
      marginRight: spacing.xs,
    },
    filterTagActive: {
      backgroundColor: palette.primary,
    },
    filterTagText: {
      fontSize: typography.base,
      fontWeight: '600',
      color: palette.onGBtn,
    },
    filterTagTextActive: {
      color: palette.onPrimary,
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
    },
    emptySubtitle: {
      fontSize: typography.base,
      color: palette.textSecondary,
      textAlign: 'center',
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
    },
    paginationText: {
      fontSize: typography.base,
      fontWeight: '500',
      color: palette.text,
    },
    resultsText: {
      fontSize: typography.sm,
      color: palette.textSecondary,
      textAlign: 'center',
      paddingBottom: spacing.md,
    },
  })