// apps/mobile/src/styles/features/settings/SettingsDetail.styles.ts

import { StyleSheet } from 'react-native'
import { ColorPalette } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { typography } from '../../theme/typography'

export const createSettingsDetailStyles = (palette: ColorPalette, fontMode: string) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: palette.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.md,
      backgroundColor: palette.background,
      borderBottomWidth: 1,
      borderBottomColor: palette.grayExtraLight,
    },
    backButton: {
      padding: spacing.xs,
    },
    backIcon: {
      color: palette.text,
    },
    headerTitle: {
      fontSize: typography.xl,
      fontWeight: '700',
      color: palette.text,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    headerSpacer: {
      width: 40,
    },

    // Content
    content: {
      flex: 1,
    },
    section: {
      marginTop: spacing.lg,
    },
    sectionTitle: {
      fontSize: typography.xs,
      fontWeight: '700',
      color: palette.textSecondary,
      letterSpacing: 0.5,
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.sm,
      textTransform: 'uppercase',
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    sectionContent: {
      backgroundColor: palette.surface,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: palette.grayExtraLight,
    },

    // Option Item (para selección de opciones)
    optionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      backgroundColor: palette.surface,
      borderBottomWidth: 1,
      borderBottomColor: palette.grayExtraLight,
    },
    optionText: {
      fontSize: typography.base,
      fontWeight: '400',
      color: palette.text,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Regular' : 'System',
    },
    checkIcon: {
      color: palette.primary,
    },

    // Toggle Item (para switches)
    toggleItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      backgroundColor: palette.background,
      borderBottomWidth: 1,
      borderBottomColor: palette.grayExtraLight,
    },
    toggleLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      marginRight: spacing.md,
    },
    toggleIcon: {
      color: palette.primary,
      marginRight: spacing.sm,
    },
    toggleTextContainer: {
      flex: 1,
    },
    toggleTitle: {
      fontSize: typography.base,
      fontWeight: '500',
      color: palette.text,
      marginBottom: 2,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Regular' : 'System',
    },
    toggleSubtitle: {
      fontSize: typography.sm,
      color: palette.textSecondary,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Regular' : 'System',
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

    // Warning Card (para logout)
    warningCard: {
      flexDirection: 'row',
      backgroundColor: palette.errorBg,
      padding: spacing.lg,
      margin: spacing.lg,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: palette.errorBorder,
    },
    warningIcon: {
      color: palette.error,
      marginRight: spacing.md,
    },
    warningContent: {
      flex: 1,
    },
    warningTitle: {
      fontSize: typography.lg,
      fontWeight: '700',
      color: palette.errorText,
      marginBottom: spacing.xs,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    warningText: {
      fontSize: typography.base,
      color: palette.errorText,
      lineHeight: 22,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Regular' : 'System',
    },

    // Logout Button
    logoutButton: {
      backgroundColor: palette.error,
      paddingVertical: spacing.md,
      marginHorizontal: spacing.lg,
      marginTop: spacing.md,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    logoutButtonText: {
      fontSize: typography.base,
      fontWeight: '600',
      color: palette.background,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },

    // Legal Content
    legalContent: {
      padding: spacing.lg,
    },
    legalDescription: {
      fontSize: typography.sm,
      color: palette.textSecondary,
      marginBottom: spacing.lg,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Regular' : 'System',
    },
    legalSection: {
      marginBottom: spacing.lg,
    },
    legalSectionTitle: {
      fontSize: typography.lg,
      fontWeight: '600',
      color: palette.text,
      marginBottom: spacing.sm,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    legalSectionContent: {
      fontSize: typography.base,
      color: palette.textSecondary,
      lineHeight: 22,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Regular' : 'System',
    },

    // Help Button (nuevo)
    helpButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: palette.primary,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.lg,
      borderRadius: 10,
      marginTop: spacing.md,
    },
    helpButtonIcon: {
      color: palette.onPrimary,
      marginRight: spacing.xs,
    },
    helpButtonText: {
      fontSize: typography.base,
      fontWeight: '600',
      color: palette.onPrimary,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },

    // App Info (nuevo)
    appInfoContainer: {
      marginTop: spacing.md,
      backgroundColor: palette.surface,
      borderRadius: 10,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: palette.grayExtraLight,
    },
    appInfoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: spacing.xs,
    },
    appInfoLabel: {
      fontSize: typography.sm,
      color: palette.textSecondary,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Regular' : 'System',
    },
    appInfoValue: {
      fontSize: typography.sm,
      color: palette.text,
      fontWeight: '500',
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Regular' : 'System',
    },
  })