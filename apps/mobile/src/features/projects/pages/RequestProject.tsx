// apps/mobile/src/features/projects/pages/RequestProject.tsx

import React, { useState, useEffect } from 'react'
import { View, Alert, ActivityIndicator, Text } from 'react-native'
import RequestProjectForm from '../components/RequestProjectForm'
import useRequestProject from '../hooks/useRequestProject'
import { useThemedStyles, useThemedPalette } from '../../../hooks/useThemedStyles'
import { createRequestProjectStyles } from '../../../styles/screens/RequestProject.styles'
import { useProfileStatus } from '../../profile/hooks/useProfileStatus'
import ProfileIncompleteModal from '../../../components/ProfileIncompleteModal'

const RequestProject = () => {
  const styles = useThemedStyles(createRequestProjectStyles)
  const palette = useThemedPalette()
  const { form, error, handleChange, handleSubmit } = useRequestProject()
  const [showHelp, setShowHelp] = useState(false)
  
  // Hook para verificar estado del perfil
  const { isComplete, isLoading: profileLoading } = useProfileStatus()
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    // Mostrar modal si el perfil está incompleto
    if (!profileLoading && !isComplete) {
      setShowModal(true)
    }
  }, [profileLoading, isComplete])

  const onSubmit = () => {
    handleSubmit()
    if (error) {
      Alert.alert('Error', error)
    }
  }

  // Mostrar loading mientras se verifica el perfil
  if (profileLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={palette.primary} />
        <Text style={styles.loadingText}>Verificando perfil...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <ProfileIncompleteModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        showCloseButton={false} // No permitir cerrar sin completar perfil
      />

      <RequestProjectForm
        form={form}
        handleChange={handleChange}
        handleSubmit={onSubmit}
        showHelp={showHelp}
        setShowHelp={setShowHelp}
        error={error}
      />
    </View>
  )
}

export default RequestProject