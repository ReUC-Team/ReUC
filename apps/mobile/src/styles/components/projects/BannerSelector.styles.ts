// apps/mobile/src/styles/components/BannerSelector.styles.ts

import { StyleSheet } from 'react-native'
import { ColorPalette } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { typography } from '../../theme/typography'

export const createBannerSelectorStyles = (palette: ColorPalette) =>
  StyleSheet.create({
    container: {
      marginBottom: spacing.md,
    },
    label: {
      fontSize: typography.base,
      fontWeight: '600',
      color: palette.text,
      marginBottom: spacing.xs,
    },
    errorText: {
      fontSize: typography.sm,
      color: palette.error,
      marginTop: spacing.xs,
    },
    uploadButton: {
      backgroundColor: palette.primary,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: 8,
      marginBottom: spacing.md,
    },
    uploadButtonText: {
      fontSize: typography.base,
      fontWeight: '600',
      color: palette.onPrimary,
      marginLeft: spacing.xs,
    },
    customBannerInfo: {
      backgroundColor: '#D1FAE5',
      borderWidth: 1,
      borderColor: '#6EE7B7',
      borderRadius: 8,
      padding: spacing.sm,
      marginBottom: spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
    },
    customBannerText: {
      fontSize: typography.sm,
      color: '#065F46',
      flex: 1,
      marginLeft: spacing.xs,
    },
    dividerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: spacing.md,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: palette.grayLight,
    },
    dividerText: {
      fontSize: typography.sm,
      color: palette.textSecondary,
      marginHorizontal: spacing.sm,
    },
    bannersGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
    },
    bannerItem: {
      width: '48%',
      aspectRatio: 16 / 9,
      borderRadius: 8,
      overflow: 'hidden',
      borderWidth: 3,
      borderColor: 'transparent',
    },
    bannerItemSelected: {
      borderColor: palette.primary,
    },
    bannerImage: {
      width: '100%',
      height: '100%',
    },
    bannerName: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      padding: spacing.xs,
    },
    bannerNameText: {
      fontSize: typography.sm,
      color: '#FFFFFF',
      textAlign: 'center',
    },
  })