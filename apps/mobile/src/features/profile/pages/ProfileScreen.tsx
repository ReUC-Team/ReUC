// apps/mobile/src/features/profile/pages/ProfileScreen.tsx

import React, { useState } from 'react'
import { ScrollView, View, ActivityIndicator, Text } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import ProfileHeader from '../components/ProfileHeader'
import ProfileTabs from '../components/ProfileTabs'
import ProfileInfo from '../components/ProfileInfo'
import EditProfileModal from '../components/EditProfileModal'
import { useThemedStyles, useThemedPalette } from '../../../hooks/useThemedStyles'
import { createProfileScreenStyles } from '../../../styles/screens/ProfileScreen.styles'
import { useProfile } from '../../../context/ProfileContext'
import { useCallback } from 'react'

const ProfileScreen = () => {
  const styles = useThemedStyles(createProfileScreenStyles)
  const palette = useThemedPalette()
  const [activeTab, setActiveTab] = useState('overview')
  const [modalVisible, setModalVisible] = useState(false)
  
  // Usar ProfileContext
  const { profile, isLoading, refreshProfile } = useProfile()

  // Recargar perfil cuando la pantalla se enfoca
  useFocusEffect(
    useCallback(() => {
      console.log('📱 ProfileScreen focused - refreshing profile')
      refreshProfile()
    }, [refreshProfile])
  )

  const handleEditPress = () => {
    setModalVisible(true)
  }

  const handleContactPress = () => {
    console.log('Contact pressed')
    // Abrir opciones de contacto
  }

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
  }

  const handleModalClose = async () => {
    setModalVisible(false)
    // Recargar el perfil cuando se cierra el modal
    console.log('🔄 Modal closed - refreshing profile...')
    await refreshProfile()
  }

  const getContentForTab = () => {
    switch (activeTab) {
      case 'overview':
        return profile?.description || 'Sin descripción disponible'
      case 'proyectos':
        return 'Aquí se mostrarán los proyectos de la empresa...'
      case 'feedback':
        return 'Aquí se mostrará el feedback de los clientes...'
      default:
        return ''
    }
  }

  // Mostrar loading mientras carga el perfil
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={palette.primary} />
        <Text style={styles.loadingText}>Cargando perfil...</Text>
      </View>
    )
  }

  // Valores por defecto si el perfil está vacío (como en web)
  const firstName = profile?.firstName || 'ReUC'
  const middleName = profile?.middleName || ''
  const lastName = profile?.lastName || ''
  const fullName = `${firstName} ${middleName} ${lastName}`.trim()
  const location = profile?.location || 'México'
  const organizationName = profile?.organizationName || 'Sin organización'

  console.log('👤 Rendering ProfileScreen with:', { firstName, middleName, lastName })

  return (
    <View style={styles.container}>
      <ScrollView>
        <ProfileHeader
          firstName={firstName}
          middleName={middleName}
          lastName={lastName}
          name={fullName}
          location={location}
          onEditPress={handleEditPress}
          onContactPress={handleContactPress}
        />
        
        <ProfileTabs onTabChange={handleTabChange} />
        
        <ProfileInfo
          title={organizationName}
          description={getContentForTab()}
        />
      </ScrollView>

      {/* Modal de edición */}
      <EditProfileModal
        visible={modalVisible}
        onClose={handleModalClose}
        profile={profile}
      />
    </View>
  )
}

export default ProfileScreen