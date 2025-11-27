// apps/mobile/src/styles/features/settings/SettingsScreen.styles.ts

import { StyleSheet } from 'react-native'
import { ColorPalette } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { typography } from '../../theme/typography'

export const createSettingsScreenStyles = (palette: ColorPalette, fontMode: string) =>
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

    // Setting Item
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      backgroundColor: palette.background,
      borderBottomWidth: 1,
      borderBottomColor: palette.grayExtraLight,
    },
    settingItemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 10,
      backgroundColor: palette.grayExtraLight,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing.sm,
    },
    iconContainerDestructive: {
      backgroundColor: palette.errorBg,
    },
    settingIcon: {
      color: palette.primary,
    },
    settingIconDestructive: {
      color: palette.error,
    },
    settingTextContainer: {
      flex: 1,
    },
    settingTitle: {
      fontSize: typography.base,
      fontWeight: '500',
      color: palette.text,
      marginBottom: 2,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Regular' : 'System',
    },
    settingTitleDestructive: {
      color: palette.error,
    },
    settingSubtitle: {
      fontSize: typography.sm,
      color: palette.textSecondary,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Regular' : 'System',
    },
    chevronIcon: {
      color: palette.textSecondary,
      marginLeft: spacing.xs,
    },

    // Version
    versionContainer: {
      alignItems: 'center',
      paddingVertical: spacing.xl,
    },
    versionText: {
      fontSize: typography.sm,
      color: palette.textSecondary,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Regular' : 'System',
    },
  })