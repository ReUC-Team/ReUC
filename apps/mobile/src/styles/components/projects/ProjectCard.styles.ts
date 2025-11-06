import { StyleSheet } from 'react-native';
import { ColorPalette } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export const createProjectCardStyles = (palette: ColorPalette) =>
  StyleSheet.create({
    container: {
      backgroundColor: palette.background,
      borderRadius: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      marginBottom: spacing.md,
      overflow: 'hidden',
      position: 'relative',
    },
    favoriteButton: {
      position: 'absolute',
      top: spacing.sm,
      right: spacing.sm,
      zIndex: 10,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderRadius: 20,
      padding: spacing.xs,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 5,
    },
    image: {
      width: '100%',
      height: 200,
      resizeMode: 'cover',
    },
    content: {
      padding: spacing.md,
    },
    title: {
      fontSize: typography.xl,
      fontWeight: '700',
      color: palette.text,
      marginBottom: spacing.xs,
    },
    description: {
      fontSize: typography.base,
      color: palette.textSecondary,
      marginBottom: spacing.md,
      lineHeight: 20,
    },
    button: {
      backgroundColor: palette.primary,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: 8,
      alignItems: 'center',
    },
    buttonText: {
      color: palette.onPrimary,
      fontSize: typography.base,
      fontWeight: '600',
    },
  });