// apps/mobile/src/components/BottomNav.tsx

import React, { useState } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useThemedStyles, useThemedPalette } from '../hooks/useThemedStyles'
import { createBottomNavStyles } from '../styles/components/header/BottomNav.styles'
import SearchModal from '../features/search/components/SearchModal'

export default function BottomNav() {
  const nav = useNavigation<any>()
  const styles = useThemedStyles(createBottomNavStyles)
  const palette = useThemedPalette()
  const [isSearchVisible, setIsSearchVisible] = useState(false)

  const openSearch = () => {
    setIsSearchVisible(true)
  }

  const closeSearch = () => {
    setIsSearchVisible(false)
  }

  return (
    <>
      <View style={styles.container}>


        {/* Buscar */}
        <TouchableOpacity style={styles.navButton} onPress={openSearch}>
          <Ionicons name="search-outline" size={28} color={palette.textSecondary} />
        </TouchableOpacity>

        {/* Home */}
        <TouchableOpacity style={styles.navButton} onPress={() => nav.navigate('Dashboard')}>
          <Ionicons name="home-outline" size={28} color={palette.textSecondary} />
        </TouchableOpacity>

        {/* Perfil */}
        <TouchableOpacity style={styles.navButton} onPress={() => nav.navigate('Profile')}>
          <Ionicons name="person-outline" size={28} color={palette.textSecondary} />
        </TouchableOpacity>
      </View>

      <SearchModal visible={isSearchVisible} onClose={closeSearch} />
    </>
  )
}