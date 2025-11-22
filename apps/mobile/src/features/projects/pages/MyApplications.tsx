// apps/mobile/src/features/projects/pages/MyApplications.tsx

import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import { useThemedStyles } from '../../../hooks/useThemedStyles'
import { createMyApplicationsStyles } from '../../../styles/screens/MyApplications.styles'
import MyApplicationsList from '../components/MyApplicationsList'

const MyApplications: React.FC = () => {
  const styles = useThemedStyles(createMyApplicationsStyles)

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Mis <Text style={styles.titleAccent}>solicitudes</Text>
        </Text>
      </View>

      <MyApplicationsList />
    </View>
  )
}

export default MyApplications