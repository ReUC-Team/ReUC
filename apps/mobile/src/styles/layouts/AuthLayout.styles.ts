// apps/mobile/src/styles/layouts/AuthLayout.styles.ts

import { StyleSheet } from 'react-native'
import { palette } from '../theme/colors'
import { spacing } from '../theme/spacing'

export const AuthLayoutStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background, 
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.md,                 
  },
})
