// apps/mobile/src/features/projects/pages/ExploreProjects.tsx

import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import { useThemedStyles } from '../../../hooks/useThemedStyles'
import { createExploreProjectsStyles } from '../../../styles/screens/ExploreProjects.styles'
import ExploreProjectsList from '../components/ExploreProjectsList'

const ExploreProjects: React.FC = () => {
  const styles = useThemedStyles(createExploreProjectsStyles)

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Explorar <Text style={styles.titleAccent}>proyectos</Text>
        </Text>
      </View>

      {/* Lista de proyectos */}
      <ExploreProjectsList />
    </ScrollView>
  )
}

export default ExploreProjects