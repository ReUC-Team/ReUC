import { StyleSheet } from 'react-native';
import { ColorPalette } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

export const createExploreProjectsStyles = (palette: ColorPalette) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: palette.surface,
    },
    header: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.lg,
    },
    title: {
      fontSize: typography.xl3,
      fontWeight: '700',
      color: palette.text,
    },
    titleAccent: {
      color: palette.primary,
    },
    tagsContainer: {
      paddingHorizontal: spacing.md,
      paddingBottom: spacing.md,
      gap: spacing.sm,
    },
    tag: {
      backgroundColor: palette.graybtn,
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.md,
      borderRadius: 20,
      marginRight: spacing.xs,
    },
    tagActive: {
      backgroundColor: palette.primary,
    },
    tagText: {
      fontSize: typography.base,
      fontWeight: '600',
      color: palette.onGBtn,
    },
    tagTextActive: {
      color: palette.onPrimary,
    },
  });