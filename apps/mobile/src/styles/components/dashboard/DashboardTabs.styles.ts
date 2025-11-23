// apps/mobile/src/styles/components/dashboard/DashboardTabs.styles.ts

import { StyleSheet } from 'react-native'
import { ColorPalette } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { typography } from '../../theme/typography'

export const createDashboardTabsStyles = (palette: ColorPalette,fontMode: string ) =>
  StyleSheet.create({
    tabBar: {
      backgroundColor: palette.background,
      elevation: 0,
      borderBottomWidth: palette.background === '#0F172A' ? 1 : 0,
      borderBottomColor: palette.grayLight,
    },
    indicator: {
      backgroundColor: palette.primary,
      height: 2,
    },
    label: {
      fontSize: typography.sm,
      fontWeight: '600',
      textTransform: 'none',
      margin: 0,
      padding: 0,
      color: palette.text,
      fontFamily: fontMode === 'dyslexic' ? 'OpenDyslexic-Bold' : 'System',
    },
  })
