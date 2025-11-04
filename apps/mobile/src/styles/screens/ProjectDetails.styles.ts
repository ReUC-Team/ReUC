import { StyleSheet } from 'react-native';
import { palette } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

export const styles = StyleSheet.create({
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
  content: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
  },
  sectionTitle: {
    fontSize: typography.xl,
    fontWeight: '700',
    color: palette.text,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  buttonsContainer: {
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  acceptButton: {
    backgroundColor: palette.primary,
    paddingVertical: spacing.base,
    borderRadius: 8,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: palette.onPrimary,
    fontSize: typography.lg,
    fontWeight: '600',
  },
  rejectButton: {
    backgroundColor: palette.gray,
    paddingVertical: spacing.base,
    borderRadius: 8,
    alignItems: 'center',
  },
  rejectButtonText: {
    color: palette.onPrimary,
    fontSize: typography.lg,
    fontWeight: '600',
  },
  contactButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: palette.primary,
    paddingVertical: spacing.base,
    borderRadius: 8,
    alignItems: 'center',
  },
  contactButtonText: {
    color: palette.primary,
    fontSize: typography.lg,
    fontWeight: '600',
  },
});