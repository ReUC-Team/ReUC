// apps/mobile/src/features/projects/pages/MyApplications.tsx

import React from 'react'
import { View, Text } from 'react-native'
import { useThemedStyles } from '../../../hooks/useThemedStyles'
import { createMyApplicationsStyles } from '../../../styles/screens/MyApplications.styles'
import MyApplicationsList from '../components/MyApplicationsList'

const MyApplications: React.FC = () => {
  const styles = useThemedStyles(createMyApplicationsStyles)

  return (
    <View style={styles.container}>
      <MyApplicationsList />
    </View>
  )
}

export default MyApplications