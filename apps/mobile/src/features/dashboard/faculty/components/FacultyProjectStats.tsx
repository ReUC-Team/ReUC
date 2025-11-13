// apps/mobile/src/features/dashboards/faculty/components/FacultyProjectStats.tsx

import React, { useRef, useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useThemedStyles, useThemedPalette } from '../../../../hooks/useThemedStyles'
import { createProjectStatsStyles } from '../../../../styles/components/dashboard/dashboardComponents.styles'
import { spacing } from '../../../../styles/theme/spacing'
import { useFacultyStats } from '../hooks/useFacultyStats'

const { width: screenWidth } = Dimensions.get('window')
const cardWidth = screenWidth * 0.7

const FacultyProjectStats: React.FC = () => {
  const styles = useThemedStyles(createProjectStatsStyles)
  const palette = useThemedPalette()

  const { statsData } = useFacultyStats()
  const scrollViewRef = useRef<ScrollView>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleScroll = (event: any) => {
    const scrollX = event.nativeEvent.contentOffset.x
    const newIndex = Math.round(scrollX / (cardWidth + 16))
    setCurrentIndex(newIndex)
  }

  const scrollToIndex = (index: number) => {
    scrollViewRef.current?.scrollTo({
      x: index * (cardWidth + 16),
      animated: true
    })
  }

  return (
    <ScrollView 
      style={{ flex: 1, backgroundColor: palette.surface }}
      showsVerticalScrollIndicator={false}
      bounces={true}
    >
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <Text style={styles.heroTitle}>Panel Académico</Text>
        <Text style={styles.heroSubtitle}>
          Supervisa, acompaña y gestiona los proyectos asignados a tu coordinación
        </Text>
      </View>

      {/* Resumen General Section */}
      <View style={styles.summarySection}>
        <Text style={styles.summaryTitle}>Resumen General</Text>
        <Text style={styles.summarySubtitle}>Estado actual de todos los proyectos asignados</Text>
        
        <View style={styles.summaryStats}>
          <View style={styles.summaryStatItem}>
            <Text style={styles.summaryStatNumber}>8</Text>
            <Text style={styles.summaryStatLabel}>Proyectos Asignados</Text>
          </View>
          
          <View style={styles.summaryStatItem}>
            <Text style={styles.summaryStatProgress}>87.5%</Text>
            <Text style={styles.summaryStatLabel}>Tasa Progreso</Text>
          </View>
        </View>
      </View>

      {/* Estadísticas Title */}
      <Text style={styles.sectionTitle}>Estadísticas</Text>

      {/* Horizontal Scrollable Cards */}
      <ScrollView 
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalScrollContainer}
        decelerationRate="fast"
        snapToInterval={cardWidth + 16}
        snapToAlignment="start"
        onScroll={handleScroll}
        scrollEventThrottle={16}
        nestedScrollEnabled={true}
      >
        {statsData.map((stat, i) => (
          <TouchableOpacity 
            key={i} 
            style={[
              styles.horizontalCard, 
              { width: cardWidth },
              i === 0 && styles.horizontalCardFirst
            ]}
            activeOpacity={0.9}
          >
            {/* Floating Icon */}
            <View style={styles.floatingIcon}>
              <MaterialCommunityIcons
                name={stat.icon as any}
                size={32}
                color={palette.primary}
              />
            </View>

            {/* Card Content */}
            <View style={styles.horizontalCardContent}>
              <Text style={styles.horizontalLabel}>{stat.label}</Text>
              <Text style={styles.horizontalValue}>{stat.value}</Text>
            </View>

            {/* Gradient Overlay */}
            <View style={styles.gradientOverlay} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Indicadores de posición (puntos) */}
      <View style={styles.paginationContainer}>
        {statsData.map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => scrollToIndex(index)}
            style={[
              styles.paginationDot,
              currentIndex === index 
                ? styles.paginationDotActive 
                : styles.paginationDotInactive
            ]}
          />
        ))}
      </View>

      {/* Espacio adicional al final */}
      <View style={{ height: spacing.xl }} />
    </ScrollView>
  )
}

export default FacultyProjectStats