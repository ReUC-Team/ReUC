// apps/mobile/src/layouts/DashboardLayout.tsx

import React from 'react'
import { SafeAreaView, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import MainHeader from '../components/MainHeader'
import BottomNav from '../components/BottomNav'
import { useThemedStyles, useThemedPalette } from '../hooks/useThemedStyles'
import { createDashboardLayoutStyles } from '../styles/layouts/DashboardLayout.styles'

type Props = { children: React.ReactNode }

export default function DashboardLayout({ children }: Props) {
  const nav = useNavigation<any>()
  const styles = useThemedStyles(createDashboardLayoutStyles)
  const palette = useThemedPalette()

  return (
    <SafeAreaView style={styles.container}>
      {/* Nuevo header para el dashboard */}
      <MainHeader
        onProfilePress={() => nav.navigate('Profile')}
      />

      {/* Área principal donde se renderizan las pantallas del dashboard */}
      <View style={styles.content}>
        {children}
      </View>

      {/* Barra de navegación inferior */}
      <BottomNav />
    </SafeAreaView>
  )
}