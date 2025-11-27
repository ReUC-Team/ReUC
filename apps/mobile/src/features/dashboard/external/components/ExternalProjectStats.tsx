import React, { useRef, useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator} from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useThemedStyles, useThemedPalette } from '../../../../hooks/useThemedStyles'
import { createProjectStatsStyles } from '../../../../styles/components/dashboard/dashboardComponents.styles'
import { spacing } from '../../../../styles/theme/spacing'
import { useExternalStats } from '../hooks/useExternalStats'
import { Dimensions } from 'react-native'

const { width: screenWidth } = Dimensions.get('window')
const cardWidth = screenWidth * 0.7 // 70% del ancho de pantalla

const ExternalProjectStats: React.FC = () => {
  const styles = useThemedStyles(createProjectStatsStyles)
  const palette = useThemedPalette()

  const { statsData, stats, isLoading, error } = useExternalStats()
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

  const handleSolicitarProyecto = () => {
  }

  return (
    <ScrollView 
      style={{ flex: 1, backgroundColor: palette.surface }}
      showsVerticalScrollIndicator={false}
      bounces={true}
    >
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <Text style={styles.heroTitle}>¡Haz Realidad tu Proyecto!</Text>
        <Text style={styles.heroSubtitle}>
          Conecta con desarrolladores y convierte tus ideas en soluciones digitales exitosas
        </Text>
        <TouchableOpacity 
          style={styles.heroButton}
          onPress={handleSolicitarProyecto}
          activeOpacity={0.8}
        >
          <Text style={styles.heroButtonText}>Solicitar Proyecto</Text>
        </TouchableOpacity>
      </View>

      {/* Resumen General Section */}
      <View style={styles.summarySection}>
        <Text style={styles.summaryTitle}>Resumen General</Text>
        <Text style={styles.summarySubtitle}>Estado actual de todos los proyectos asignados</Text>
        
        {isLoading ? (
          <View style={{ paddingVertical: 24 }}>
            <ActivityIndicator size="large" color={palette.primary} />
          </View>
        ) : (
          <View style={styles.summaryStats}>
            <View style={styles.summaryStatItem}>
              <Text style={styles.summaryStatNumber}>{stats.totalProjects}</Text>
              <Text style={styles.summaryStatLabel}>Proyectos Asignados</Text>
            </View>
            
            <View style={styles.summaryStatItem}>
              <Text style={styles.summaryStatProgress}>
                {stats.approvalRate}%
              </Text>
              <Text style={styles.summaryStatLabel}>Tasa Aprobación</Text>
            </View>
          </View>
        )}
      </View>

      {/* Estadísticas Title */}
      <Text style={styles.sectionTitle}>Estadísticas</Text>

      {/* Loading State */}
      {isLoading ? (
        <View style={{ paddingVertical: 32, alignItems: 'center' }}>
          <ActivityIndicator size="large" color={palette.primary} />
          <Text style={{ color: palette.textSecondary, marginTop: 16 }}>
            Cargando estadísticas...
          </Text>
        </View>
      ) : (
        <>
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
        </>
      )}

     
      <View style={{ height: spacing.xl }} />
    </ScrollView>
  )
}

export default ExternalProjectStats
