// apps/mobile/src/features/projects/components/RollbackProjectModal.tsx

import React, { useState } from 'react'
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useThemedStyles, useThemedPalette } from '../../../hooks/useThemedStyles'
import { createRollbackProjectModalStyles } from '../../../styles/components/projects/RollbackProjectModal.styles'

interface RollbackProjectModalProps {
  isOpen: boolean
  onClose: () => void
  project: {
    title: string
    status?: {
      name: string
      slug: string
    }
  } | null
  onConfirm: () => void
  isLoading: boolean
}

const RollbackProjectModal: React.FC<RollbackProjectModalProps> = ({
  isOpen,
  onClose,
  project,
  onConfirm,
  isLoading,
}) => {
  const styles = useThemedStyles(createRollbackProjectModalStyles)
  const palette = useThemedPalette()
  const [confirmText, setConfirmText] = useState('')
  const isConfirmValid = confirmText.trim().toUpperCase() === 'CONFIRMAR'

  const handleConfirm = () => {
    if (isConfirmValid && !isLoading) {
      onConfirm()
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setConfirmText('')
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Revertir Proyecto</Text>
            <TouchableOpacity onPress={handleClose} disabled={isLoading}>
              <Ionicons name="close" size={24} color={palette.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Warning Box */}
          <View style={styles.warningBox}>
            <Ionicons name="warning" size={24} color="#DC2626" style={styles.warningIcon} />
            <View style={styles.warningContent}>
              <Text style={styles.warningTitle}>
                ADVERTENCIA: Esta acción es destructiva e irreversible
              </Text>
              <View style={styles.warningList}>
                <Text style={styles.warningListItem}>• El proyecto será eliminado permanentemente</Text>
                <Text style={styles.warningListItem}>• La solicitud volverá al estado "En Revisión"</Text>
                <Text style={styles.warningListItem}>• Estará disponible para que otro profesor la apruebe</Text>
                <Text style={styles.warningListItem}>• Todo el progreso del proyecto se perderá</Text>
              </View>
            </View>
          </View>

          {/* Project Info */}
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>
              Proyecto: <Text style={styles.infoValue}>{project?.title || 'Sin título'}</Text>
            </Text>
            <Text style={styles.infoLabel}>
              Estado actual: <Text style={styles.infoValue}>{project?.status?.name || 'Desconocido'}</Text>
            </Text>
          </View>

          {/* Confirmation Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>
              Para confirmar, escribe <Text style={styles.inputLabelHighlight}>CONFIRMAR</Text> en mayúsculas:
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Escribe CONFIRMAR"
              placeholderTextColor={palette.textSecondary}
              value={confirmText}
              onChangeText={setConfirmText}
              editable={!isLoading}
              autoCapitalize="characters"
            />
            {confirmText && !isConfirmValid && (
              <Text style={styles.errorText}>
                El texto no coincide. Debe ser exactamente "CONFIRMAR" en mayúsculas.
              </Text>
            )}
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.buttonCancel]}
              onPress={handleClose}
              disabled={isLoading}
            >
              <Text style={styles.buttonCancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                styles.buttonRollback,
                (!isConfirmValid || isLoading) && styles.buttonDisabled,
              ]}
              onPress={handleConfirm}
              disabled={!isConfirmValid || isLoading}
            >
              {isLoading ? (
                <>
                  <ActivityIndicator size="small" color={palette.onPrimary} />
                  <Text style={styles.buttonRollbackText}>Revirtiendo...</Text>
                </>
              ) : (
                <Text style={styles.buttonRollbackText}>Revertir Proyecto</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default RollbackProjectModal