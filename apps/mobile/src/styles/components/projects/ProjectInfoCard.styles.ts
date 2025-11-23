import { StyleSheet } from 'react-native';
import { ColorPalette } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export const createProjectInfoCardStyles = (palette: ColorPalette, fontMode:string) =>
  StyleSheet.create({
    container: {
      backgroundColor: palette.grayExtraLight,
      borderRadius: 12,
      padding: spacing.md,
      marginBottom: spacing.md,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    title: {
      fontSize: typography.lg,
      fontWeight: '700',
      color: palette.text,
      marginBottom: spacing.sm,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    itemsContainer: {
      gap: spacing.sm,
    },
    item: {
      marginBottom: spacing.xs,
    },
    label: {
      fontSize: typography.base,
      fontWeight: '600',
      color: palette.text,
      marginBottom: spacing.xxs,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    value: {
      fontSize: typography.base,
      color: palette.textSecondary,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
  });