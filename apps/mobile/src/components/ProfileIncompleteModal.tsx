// apps/mobile/src/components/ProfileIncompleteModal.tsx

import React from 'react'
import { View, Text, TouchableOpacity, Modal } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useThemedStyles, useThemedPalette } from '../hooks/useThemedStyles'
import { createProfileIncompleteModalStyles } from '../styles/components/ProfileIncompleteModal.styles'

interface ProfileIncompleteModalProps {
  isOpen: boolean
  onClose?: () => void
  showCloseButton?: boolean
  title?: string
  message?: string
  subMessage?: string
}

const ProfileIncompleteModal: React.FC<ProfileIncompleteModalProps> = ({
  isOpen,
  onClose,
  showCloseButton = true,
  title = 'Perfil Incompleto',
  message = 'Para poder solicitar proyectos, necesitas completar tu información de perfil.',
  subMessage = 'Esto nos ayuda a conectarte mejor con los estudiantes y proyectos adecuados.',
}) => {
  const styles = useThemedStyles(createProfileIncompleteModalStyles)
  const palette = useThemedPalette()
  const navigation = useNavigation<any>()

  const handleGoToProfile = () => {
    onClose?.()
    navigation.navigate('Profile')
  }

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Ionicons name="warning" size={24} color="#D97706" />
            </View>
            <Text style={styles.title}>{title}</Text>
            {showCloseButton && (
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={palette.gray} />
              </TouchableOpacity>
            )}
          </View>

          {/* Body */}
          <View style={styles.body}>
            <Text style={styles.message}>{message}</Text>
            <Text style={styles.subMessage}>{subMessage}</Text>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleGoToProfile}
            >
              <Text style={styles.primaryButtonText}>Completar Perfil</Text>
            </TouchableOpacity>

            {showCloseButton && (
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={onClose}
              >
                <Text style={styles.secondaryButtonText}>Más tarde</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default ProfileIncompleteModal