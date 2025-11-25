// apps/mobile/src/styles/components/teams/MemberSearchInput.styles.ts

import { StyleSheet } from 'react-native'
import { ColorPalette } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { typography } from '../../theme/typography'

export const createMemberSearchInputStyles = (palette: ColorPalette, fontMode: string) =>
  StyleSheet.create({
    container: {
      position: 'relative',
      zIndex: 10,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: palette.background,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: palette.grayLight,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
    },
    inputContainerWarning: {
      borderColor: palette.error,
      borderWidth: 2,
    },
    searchIcon: {
      marginRight: spacing.xs,
    },
    input: {
      flex: 1,
      fontSize: typography.base,
      color: palette.text,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic' : 'System',
    },
    loadingIcon: {
      marginLeft: spacing.xs,
    },
    warningContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: palette.errorBg,
      borderRadius: 8,
      padding: spacing.sm,
      marginTop: spacing.xs,
      gap: spacing.xs,
    },
    warningText: {
      flex: 1,
      fontSize: typography.sm,
      color: palette.errorText,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic' : 'System',
    },
  })