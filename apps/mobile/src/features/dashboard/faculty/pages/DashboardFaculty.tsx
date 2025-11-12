// apps/mobile/src/features/dashboards/faculty/pages/DashboardFaculty.tsx

import React from 'react'
import { View } from 'react-native'
import { useThemedStyles } from '../../../../hooks/useThemedStyles'
import { createDashboardMainStyles } from '../../../../styles/screens/DashboardMain.styles'
import DashboardTabs from './DashboardTabs'

export default function DashboardFaculty() {
  const styles = useThemedStyles(createDashboardMainStyles)

  return (
    <View style={styles.container}>
      <DashboardTabs />
    </View>
  )
}