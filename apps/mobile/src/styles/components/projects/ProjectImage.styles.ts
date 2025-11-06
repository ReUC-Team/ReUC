import { StyleSheet } from 'react-native';
import { ColorPalette } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export const createProjectImageStyles = (palette: ColorPalette) =>
  StyleSheet.create({
    container: {
      width: '100%',
      borderRadius: 12,
      overflow: 'hidden',
      marginBottom: spacing.md,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    image: {
      width: '100%',
      height: 250,
    },
  });