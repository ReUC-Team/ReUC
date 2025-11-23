// apps/mobile/src/styles/components/search/SearchModal.styles.ts

import { StyleSheet, Platform, StatusBar } from 'react-native'
import { ColorPalette } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { typography } from '../../theme/typography'

export const createSearchModalStyles = (palette: ColorPalette, fontMode: string) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
    
      paddingTop: Platform.OS === 'ios' 
        ? spacing.xl + 30  
        : (StatusBar.currentHeight || 0) + spacing.lg, 
      paddingBottom: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: palette.grayLight,
    },
    closeButton: {
      marginRight: spacing.sm,
      padding: spacing.xs,
    },
    searchContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: palette.surface,
      borderRadius: 24,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderWidth: 2,
      borderColor: palette.grayLight,
    },
    searchIcon: {
      marginRight: spacing.xs,
    },
    searchInput: {
      flex: 1,
      fontSize: typography.base,
      color: palette.text,
      paddingVertical: 0,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    clearButton: {
      padding: spacing.xxs,
    },
    content: {
      flex: 1,
      paddingHorizontal: spacing.md,
      paddingTop: spacing.md,
    },
    listContent: {
      paddingBottom: spacing.lg,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: spacing.xl,
    },
    emptyTitle: {
      fontSize: typography.xl,
      fontWeight: '600',
      color: palette.text,
      marginTop: spacing.lg,
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
    footer: {
      paddingVertical: spacing.sm + 10,
      paddingHorizontal: spacing.md,
      borderTopWidth: 1,
      borderTopColor: palette.grayLight,
      alignItems: 'center',
    },
    footerText: {
      fontSize: typography.sm,
      color: palette.textSecondary,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
  })