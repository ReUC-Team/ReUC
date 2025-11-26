// apps/mobile/src/styles/components/projects/StartProjectModal.styles.ts

import { StyleSheet } from 'react-native'
import { ColorPalette } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { typography } from '../../theme/typography'

export const createStartProjectModalStyles = (palette: ColorPalette, fontMode: string) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.lg,
    },
    modal: {
      backgroundColor: palette.background,
      borderRadius: 16,
      padding: spacing.lg,
      width: '100%',
      maxWidth: 500,
      maxHeight: '80%',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    title: {
      fontSize: typography.xl2,
      fontWeight: '700',
      color: palette.text,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    validationsContainer: {
      gap: spacing.sm,
      marginBottom: spacing.md,
    },
    validationItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    validationText: {
      fontSize: typography.base,
      fontWeight: '500',
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    errorBox: {
      backgroundColor: '#FEE2E2',
      borderWidth: 1,
      borderColor: '#FCA5A5',
      borderRadius: 12,
      padding: spacing.md,
      marginBottom: spacing.md,
    },
    errorTitle: {
      fontSize: typography.sm,
      fontWeight: '700',
      color: '#991B1B',
      marginBottom: spacing.xs,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    errorList: {
      gap: spacing.xxs,
    },
    errorItem: {
      fontSize: typography.sm,
      color: '#991B1B',
      lineHeight: 18,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Regular' : 'System',
    },
    missingRolesContainer: {
      marginTop: spacing.sm,
      paddingTop: spacing.sm,
      borderTopWidth: 1,
      borderTopColor: '#FCA5A5',
    },
    missingRolesTitle: {
      fontSize: typography.sm,
      fontWeight: '700',
      color: '#991B1B',
      marginBottom: spacing.xs,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    missingRoleItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing.xs,
      marginBottom: spacing.xs,
    },
    missingRoleText: {
      flex: 1,
      fontSize: typography.sm,
      color: '#991B1B',
      lineHeight: 18,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Regular' : 'System',
    },
    missingRoleBold: {
      fontWeight: '700',
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    successBox: {
      backgroundColor: '#ECFCCB',
      borderWidth: 1,
      borderColor: '#D9F99D',
      borderRadius: 12,
      padding: spacing.md,
      marginBottom: spacing.md,
    },
    successText: {
      fontSize: typography.sm,
      color: '#365314',
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Regular' : 'System',
    },
    actions: {
      flexDirection: 'row',
      gap: spacing.sm,
      marginTop: spacing.md,
    },
    button: {
      flex: 1,
      paddingVertical: spacing.sm,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: spacing.xs,
    },
    buttonCancel: {
      backgroundColor: palette.surface,
      borderWidth: 2,
      borderColor: palette.grayLight,
    },
    buttonCancelText: {
      fontSize: typography.base,
      fontWeight: '600',
      color: palette.text,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    buttonStart: {
      backgroundColor: '#84CC16',
    },
    buttonStartText: {
      fontSize: typography.base,
      fontWeight: '600',
      color: '#FFFFFF',
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
    buttonDisabled: {
      opacity: 0.5,
    },
  })