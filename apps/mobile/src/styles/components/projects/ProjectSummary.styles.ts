import { StyleSheet } from 'react-native';
import { palette } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.xl2,
    fontWeight: '700',
    color: palette.text,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: typography.base,
    color: palette.textSecondary,
    lineHeight: 22,
  },
});