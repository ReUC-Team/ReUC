// apps/mobile/src/features/projects/pages/ExploreProjects.tsx

import React, { useRef } from 'react'
import { View, Text, Animated } from 'react-native'
import { useThemedStyles } from '../../../hooks/useThemedStyles'
import { createExploreProjectsStyles } from '../../../styles/screens/ExploreProjects.styles'
import ExploreProjectsList from '../components/ExploreProjectsList'

const ExploreProjects: React.FC = () => {
  const styles = useThemedStyles(createExploreProjectsStyles)
  const scrollY = useRef(new Animated.Value(0)).current

  // Animar la opacidad y altura del header cuando se hace scroll
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  })

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  })

  return (
    <View style={styles.container}>
      {/* Header animado que desaparece al hacer scroll */}
      <Animated.View
        style={[
          styles.headerContainer,
          {
            opacity: headerOpacity,
            transform: [{ scaleY: headerHeight }],
          },
        ]}
      >
        <View style={styles.header}>
          <Text style={styles.title}>
            Explorar <Text style={styles.titleAccent}>proyectos</Text>
          </Text>
        </View>
      </Animated.View>

      {/* Lista con scroll */}
      <ExploreProjectsList scrollY={scrollY} />
    </View>
  )
}

export default ExploreProjects