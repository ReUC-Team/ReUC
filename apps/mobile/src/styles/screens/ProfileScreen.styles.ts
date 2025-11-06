import { StyleSheet } from 'react-native';
import { ColorPalette } from '../theme/colors';

export const createProfileScreenStyles = (palette: ColorPalette) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: palette.surface,
    },
  });