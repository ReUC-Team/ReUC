// apps/mobile/src/features/profile/pages/ProfileScreen.tsx

import React, { useState } from 'react'
import { ScrollView, View, ActivityIndicator, Text } from 'react-native'
import ProfileHeader from '../components/ProfileHeader'
import ProfileTabs from '../components/ProfileTabs'
import ProfileInfo from '../components/ProfileInfo'
import EditProfileModal from '../components/EditProfileModal'
import { useThemedStyles, useThemedPalette } from '../../../hooks/useThemedStyles'
import { createProfileScreenStyles } from '../../../styles/screens/ProfileScreen.styles'
import { useGetProfileNative } from '../hooks/useGetProfileNative'

const ProfileScreen = () => {
  const styles = useThemedStyles(createProfileScreenStyles)
  const palette = useThemedPalette()
  const [activeTab, setActiveTab] = useState('overview')
  const [modalVisible, setModalVisible] = useState(false)

  // Obtener datos del perfil
  const { profile, isLoading } = useGetProfileNative()

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

  const fullName = `${profile?.firstName || ''} ${profile?.middleName || ''} ${profile?.lastName || ''}`.trim() || 'Usuario'
  const location = profile?.location || 'Sin ubicación'
  const organizationName = profile?.organizationName || 'Sin organización'

  return (
    <View style={styles.container}>
      <ScrollView>
        <ProfileHeader
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
        onClose={() => setModalVisible(false)}
        profile={profile}
      />
    </View>
  )
}

export default ProfileScreen