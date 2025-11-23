// apps/mobile/src/styles/components/sidebar/RightSidebar.styles.ts

import { StyleSheet } from 'react-native'
import { ColorPalette } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { typography } from '../../theme/typography'

export const createRightSidebarStyles = (palette: ColorPalette, fontMode: string) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    sidebar: {
      width: '75%',
      maxWidth: 280,
      backgroundColor: palette.background,
      height: '100%',
      shadowColor: '#000',
      shadowOffset: {
        width: -2,
        height: 0,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    profileSection: {
      backgroundColor: palette.surface,
      paddingTop: spacing.xxl + spacing.lg,
      paddingBottom: spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: palette.grayExtraLight,
    },
    closeButton: {
      position: 'absolute',
      top: spacing.xxl + spacing.md,
      right: spacing.md,
      padding: spacing.xs,
      zIndex: 1,
    },
    closeIcon: {
      color: palette.textSecondary,
    },
    profileContainer: {
      alignItems: 'center',
      paddingHorizontal: spacing.md,
    },
    profileAvatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      marginBottom: spacing.sm,
      backgroundColor: palette.grayLight,
    },
    userEmail: {
      fontSize: typography.base,
      color: palette.textSecondary,
      textAlign: 'center',
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System'
    },
    menuContainer: {
      flex: 1,
      paddingVertical: spacing.md,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
    },
    menuIcon: {
      color: palette.text,
      marginRight: spacing.md,
    },
    menuText: {
      fontSize: typography.base,
      color: palette.text,
      fontWeight: '400',
      flex: 1,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System'
    },
    chevronIcon: {
      color: palette.textSecondary,
      marginLeft: 'auto',
    },
    submenuContainer: {
      backgroundColor: palette.grayExtraLight,
      marginHorizontal: spacing.md,
      borderRadius: spacing.xs,
      marginTop: spacing.xs,
      marginBottom: spacing.sm,
      paddingVertical: spacing.xs,
    },
    submenuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
    },
    submenuItemContent: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    submenuIcon: {
      color: palette.text,
      marginRight: spacing.sm,
    },
    submenuText: {
      fontSize: typography.sm,
      color: palette.text,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System'
    },
    switch: {
      transform: [{ scale: 0.8 }],
    },
    switchTrack: {
      color: palette.gray,
    },
    switchTrackActive: {
      color: palette.primary,
    },
    switchThumb: {
      color: palette.background,
    },
    logoutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderTopWidth: 1,
      borderTopColor: palette.grayExtraLight,
      marginBottom: spacing.lg,
    },
    logoutIcon: {
      color: palette.error,
      marginRight: spacing.md,
    },
    logoutText: {
      fontSize: typography.base,
      color: palette.error,
      fontWeight: '500',
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System'
    },
  })
