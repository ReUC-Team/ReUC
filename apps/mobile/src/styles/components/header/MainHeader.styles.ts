// apps/mobile/src/styles/components/header/MainHeader.styles.ts

import { StyleSheet } from 'react-native'
import { ColorPalette } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { typography } from '../../theme/typography'

export const createMainHeaderStyles = (palette: ColorPalette, fontMode: string) =>
  StyleSheet.create({
    container: {
      width: '100%',
      backgroundColor: palette.background,
      paddingHorizontal: spacing.md,
      paddingTop: spacing.sm,
      paddingBottom: spacing.sm,
      ...(palette.background === '#0F172A' && {
        borderBottomWidth: 1,
        borderBottomColor: palette.surface,
      }),
    },
    topRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    leftSection: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    hamburgerBtn: {
      padding: spacing.xs,
      marginRight: spacing.xs,
    },
    hamburgerIcon: {
      color: palette.text,
    },
    logo: {
      fontSize: typography.xl2,
      fontWeight: '900',
      color: palette.primary,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System'
    },
    profileBtn: {
      width: spacing.xl,
      height: spacing.xl,
      borderRadius: spacing.xl,
      backgroundColor: palette.grayLight,
      alignItems: 'center',
      justifyContent: 'center',
    },
  })