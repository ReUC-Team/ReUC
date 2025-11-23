// apps/mobile/src/components/MainHeader.tsx

import React, { useState } from 'react'
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { createMainHeaderStyles } from '../styles/components/header/MainHeader.styles'
import { useThemedStyles, useThemedPalette } from '../hooks/useThemedStyles'
import LeftSidebar from './LeftSidebar'
import RightSidebar from './RightSidebar'
import Avatar from './Avatar'
import { useProfile } from '../context/ProfileContext'

type Props = {
  onNavigate?: (screen: string) => void
}

export default function MainHeader({ onNavigate }: Props) {
  const styles = useThemedStyles(createMainHeaderStyles)
  const palette = useThemedPalette()
  const [isSidebarVisible, setIsSidebarVisible] = useState(false)
  const [isRightSidebarVisible, setIsRightSidebarVisible] = useState(false)

  const { profile, isLoading: isLoadingProfile } = useProfile()

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible)
  }

  const toggleRightSidebar = () => {
    setIsRightSidebarVisible(!isRightSidebarVisible)
  }

  const firstName = profile?.firstName || 'ReUC'
  const middleName = profile?.middleName || ''
  const lastName = profile?.lastName || ''
  const userEmail = profile?.email || 'usuario@ejemplo.com'

  return (
    <>
      <View style={styles.container}>
        <View style={styles.topRow}>
          <View style={styles.leftSection}>
            <TouchableOpacity style={styles.hamburgerBtn} onPress={toggleSidebar}>
              <Ionicons name="menu" size={24} style={styles.hamburgerIcon} />
            </TouchableOpacity>
            <Text style={styles.logo}>
              Re<Text style={{ color: styles.logo.color }}>UC</Text>
            </Text>
          </View>
          <TouchableOpacity style={styles.profileBtn} onPress={toggleRightSidebar}>
            {isLoadingProfile ? (
              <ActivityIndicator size="small" color={palette.primary} />
            ) : (
              <Avatar firstName={firstName} middleName={middleName} lastName={lastName} size="small" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <LeftSidebar
        isVisible={isSidebarVisible}
        onClose={() => setIsSidebarVisible(false)}
        onNavigate={onNavigate}
      />

      <RightSidebar
        isVisible={isRightSidebarVisible}
        onClose={() => setIsRightSidebarVisible(false)}
        onNavigate={onNavigate}
        userEmail={userEmail}
        firstName={firstName}
        middleName={middleName}
        lastName={lastName}
      />
    </>
  )
}