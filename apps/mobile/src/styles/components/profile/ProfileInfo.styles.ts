import { StyleSheet } from 'react-native';
import { ColorPalette } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export const createProfileInfoStyles = (palette: ColorPalette, fontMode: string) =>
  StyleSheet.create({
    container: {
      backgroundColor: palette.background,
      padding: spacing.lg,
      margin: spacing.md,
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 3,
    },
    title: {
      fontSize: typography.xl,
      fontWeight: '700',
      color: palette.titleDescription,
      marginBottom: spacing.md,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    description: {
      fontSize: typography.lg,
      lineHeight: 24,
      color: palette.textSecondary,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
  });