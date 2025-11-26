// apps/mobile/src/styles/components/teams/MemberSearchResults.styles.ts

import { StyleSheet } from 'react-native'
import { ColorPalette } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { typography } from '../../theme/typography'

export const createMemberSearchResultsStyles = (palette: ColorPalette, fontMode: string) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      backgroundColor: palette.background,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: palette.grayLight,
      marginTop: spacing.xs,
      maxHeight: 300,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
      zIndex: 100,
    },
    scrollView: {
      maxHeight: 300,
    },
    resultItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: palette.grayLight,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: palette.grayExtraLight,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing.sm,
    },
    infoContainer: {
      flex: 1,
    },
    name: {
      fontSize: typography.base,
      fontWeight: '600',
      color: palette.text,
      marginBottom: spacing.xxs,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    highlightedText: {
      backgroundColor: palette.primary,
      color: palette.onPrimary,
      fontWeight: '700',
    },
    emailContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xxs,
    },
    email: {
      fontSize: typography.sm,
      color: palette.textSecondary,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic' : 'System',
    },
    universityId: {
      fontSize: typography.xs,
      color: palette.textSecondary,
      marginTop: spacing.xxs,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic' : 'System',
    },
  })