// apps/mobile/src/styles/components/header/LeftSidebar.styles.ts

import { StyleSheet } from 'react-native'
import { ColorPalette } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { typography } from '../../theme/typography'

export const createLeftSidebarStyles = (palette: ColorPalette, fontMode: string) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      flexDirection: 'row',
    },
    sidebar: {
      width: '80%',
      maxWidth: 320,
      backgroundColor: palette.background,
      height: '100%',
      shadowColor: '#000',
      shadowOffset: {
        width: 2,
        height: 0,
      },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 5,
    },
    header: {
      backgroundColor: palette.primary,
      paddingTop: spacing.xxl + spacing.lg,
      paddingBottom: spacing.lg,
      paddingHorizontal: spacing.lg,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    },
    headerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    logo: {
      fontSize: typography.xl3,
      fontWeight: '900',
      color: palette.onPrimary,
      letterSpacing: 1,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System'
    },
    logoAccent: {
      color: palette.onPrimary,
      opacity: 0.8,
    },
    closeButton: {
      padding: spacing.xs,
      borderRadius: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    closeIcon: {
      color: palette.onPrimary,
    },
    menuContainer: {
      flex: 1,
      paddingTop: spacing.md,
    },
    menuSection: {
      paddingHorizontal: spacing.md,
      marginBottom: spacing.lg,
    },
    sectionTitle: {
      fontSize: typography.sm,
      fontWeight: '700',
      color: palette.textSecondary,
      letterSpacing: 0.5,
      marginBottom: spacing.sm,
      marginLeft: spacing.xs,
      textTransform: 'uppercase',
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System'
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.sm,
      marginVertical: spacing.xxs,
      borderRadius: 12,
      backgroundColor: 'transparent',
    },
    menuItemContent: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    iconContainer: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: palette.grayExtraLight,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing.sm,
    },
    menuIcon: {
      color: palette.primary,
    },
    menuText: {
      fontSize: typography.base,
      color: palette.text,
      fontWeight: '500',
      flex: 1,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System'
    },
    chevronIcon: {
      color: palette.textSecondary,
      marginLeft: spacing.xs,
    },

  })