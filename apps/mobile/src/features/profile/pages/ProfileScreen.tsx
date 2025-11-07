// apps/mobile/src/features/profile/pages/ProfileScreen.tsx

import React, { useState, useCallback } from 'react'
import { ScrollView, View, ActivityIndicator, Text } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import ProfileHeader from '../components/ProfileHeader'
import ProfileTabs from '../components/ProfileTabs'
import ProfileInfo from '../components/ProfileInfo'
import EditProfileModal from '../components/EditProfileModal'
import { useThemedStyles, useThemedPalette } from '../../../hooks/useThemedStyles'
import { createProfileScreenStyles } from '../../../styles/screens/ProfileScreen.styles'
import { getProfile } from '../services/profileServiceNative'
import { AuthenticationError, getDisplayMessage } from '../../../utils/errorHandler'
import Toast from 'react-native-toast-message'

const ProfileScreen = () => {
  const styles = useThemedStyles(createProfileScreenStyles)
  const palette = useThemedPalette()
  const [activeTab, setActiveTab] = useState('overview')
  const [modalVisible, setModalVisible] = useState(false)
  const [profile, setProfile] = useState<any>({})
  const [isLoading, setIsLoading] = useState(true)

  // Función para cargar el perfil
  const loadProfile = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await getProfile()
      setProfile(data.profile || {})
    } catch (err: any) {
      console.error('Error loading profile:', err)
      
      if (err instanceof AuthenticationError) {
        // Manejar error de autenticación si es necesario
        Toast.show({
          type: 'error',
          text1: 'Error de autenticación',
          position: 'bottom',
        })
      } else {
        Toast.show({
          type: 'error',
          text1: getDisplayMessage(err),
          position: 'bottom',
        })
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Recargar perfil cuando la pantalla se enfoca
  useFocusEffect(
    useCallback(() => {
      loadProfile()
    }, [loadProfile])
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

  const handleModalClose = () => {
    setModalVisible(false)
    // Recargar el perfil cuando se cierra el modal
    loadProfile()
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
        onClose={handleModalClose}
        profile={profile}
      />
    </View>
  )
}

export default ProfileScreen