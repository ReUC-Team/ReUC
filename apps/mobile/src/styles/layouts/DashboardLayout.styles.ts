// apps/mobile/src/styles/layouts/DashboardLayout.styles.ts

import { StyleSheet } from 'react-native'
import { ColorPalette } from '../theme/colors'
import { spacing } from '../theme/spacing'

export const createDashboardLayoutStyles = (palette: ColorPalette) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: palette.background,
    },
    content: {
      flex: 1,
      backgroundColor: palette.background,
    },
  })