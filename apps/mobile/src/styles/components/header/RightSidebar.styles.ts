// apps/mobile/src/styles/components/header/RightSidebar.styles.ts

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
      width: '80%',
      maxWidth: 320,
      backgroundColor: palette.background,
      height: '100%',
      shadowColor: '#000',
      shadowOffset: {
        width: -2,
        height: 0,
      },
      shadowOpacity: 0.25,
      shadowRadius: 8,
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
      borderRadius: 20,
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
      zIndex: 1,
    },
    closeIcon: {
      color: palette.textSecondary,
    },
    profileContainer: {
      alignItems: 'center',
      paddingHorizontal: spacing.md,
    },
    userEmail: {
      fontSize: typography.sm,
      color: palette.textSecondary,
      textAlign: 'center',
      marginTop: spacing.sm,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Regular' : 'System',
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
      fontSize: typography.xs,
      fontWeight: '700',
      color: palette.textSecondary,
      letterSpacing: 0.5,
      marginBottom: spacing.sm,
      marginLeft: spacing.xs,
      textTransform: 'uppercase',
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
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
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Regular' : 'System',
    },
    chevronIcon: {
      color: palette.textSecondary,
      marginLeft: spacing.xs,
    },
    submenuContainer: {
      backgroundColor: palette.grayExtraLight,
      marginHorizontal: spacing.xs,
      borderRadius: 10,
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
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Regular' : 'System',
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
    logoutContainer: {
      borderTopWidth: 1,
      borderTopColor: palette.grayExtraLight,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
    },
    logoutButton: {
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.sm,
      borderRadius: 12,
      backgroundColor: 'transparent',
    },
    logoutContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    logoutIconContainer: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: palette.errorBg,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing.sm,
    },
    logoutIcon: {
      color: palette.error,
    },
    logoutText: {
      fontSize: typography.base,
      color: palette.error,
      fontWeight: '500',
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Regular' : 'System',
    },
  })