import { StyleSheet } from 'react-native';
import { ColorPalette } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export const createProfileTabsStyles = (palette: ColorPalette, fontMode: string) =>
  StyleSheet.create({
    container: {
      backgroundColor: palette.background,
      borderBottomWidth: 1,
      borderBottomColor: palette.grayLight,
    },
    scrollContent: {
      paddingHorizontal: spacing.md,
    },
    tab: {
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      marginRight: spacing.xs,
      borderBottomWidth: 2,
      borderBottomColor: 'transparent',
    },
    activeTab: {
      borderBottomColor: palette.primary,
    },
    tabText: {
      fontSize: typography.lg,
      fontWeight: '500',
      color: palette.textSecondary,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    activeTabText: {
      color: palette.text,
      fontWeight: '600',
    },
  });