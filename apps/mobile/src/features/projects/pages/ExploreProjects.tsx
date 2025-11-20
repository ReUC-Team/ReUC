// apps/mobile/src/features/projects/pages/ExploreProjects.tsx

import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import { useThemedStyles } from '../../../hooks/useThemedStyles'
import { createExploreProjectsStyles } from '../../../styles/screens/ExploreProjects.styles'
import ExploreProjectsList from '../components/ExploreProjectsList'

const ExploreProjects: React.FC = () => {
  const styles = useThemedStyles(createExploreProjectsStyles)

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Explorar <Text style={styles.titleAccent}>proyectos</Text>
        </Text>
      </View>

      <ExploreProjectsList />
    </View>
  )
}

export default ExploreProjects