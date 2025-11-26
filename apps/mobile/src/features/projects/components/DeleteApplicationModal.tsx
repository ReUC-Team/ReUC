// apps/mobile/src/features/projects/components/DeleteApplicationModal.tsx

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
import { createDeleteApplicationModalStyles } from '../../../styles/components/projects/DeleteApplicationModal.styles'

interface DeleteApplicationModalProps {
  isOpen: boolean
  onClose: () => void
  application: {
    title: string
    status?: {
      name: string
      slug: string
    }
  } | null
  onConfirm: () => void
  isLoading: boolean
}

const DeleteApplicationModal: React.FC<DeleteApplicationModalProps> = ({
  isOpen,
  onClose,
  application,
  onConfirm,
  isLoading,
}) => {
  const styles = useThemedStyles(createDeleteApplicationModalStyles)
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
            <Text style={styles.title}>Eliminar Solicitud</Text>
            <TouchableOpacity onPress={handleClose} disabled={isLoading}>
              <Ionicons name="close" size={24} color={palette.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Warning Box */}
          <View style={styles.warningBox}>
            <Ionicons name="warning" size={24} color="#DC2626" style={styles.warningIcon} />
            <View style={styles.warningContent}>
              <Text style={styles.warningTitle}>
                ADVERTENCIA: Esta acción eliminará tu solicitud
              </Text>
              <View style={styles.warningList}>
                <Text style={styles.warningListItem}>• La solicitud será eliminada permanentemente</Text>
                <Text style={styles.warningListItem}>• Ya no aparecerá en "Mis Solicitudes"</Text>
                <Text style={styles.warningListItem}>• No estará disponible en "Explorar Proyectos"</Text>
                <Text style={styles.warningListItem}>• Esta acción no se puede deshacer</Text>
              </View>
            </View>
          </View>

          {/* Application Info */}
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>
              Solicitud: <Text style={styles.infoValue}>{application?.title || 'Sin título'}</Text>
            </Text>
            <Text style={styles.infoLabel}>
              Estado actual: <Text style={styles.infoValue}>{application?.status?.name || 'Desconocido'}</Text>
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
                styles.buttonDelete,
                (!isConfirmValid || isLoading) && styles.buttonDisabled,
              ]}
              onPress={handleConfirm}
              disabled={!isConfirmValid || isLoading}
            >
              {isLoading ? (
                <>
                  <ActivityIndicator size="small" color={palette.onPrimary} />
                  <Text style={styles.buttonDeleteText}>Eliminando...</Text>
                </>
              ) : (
                <Text style={styles.buttonDeleteText}>Eliminar Solicitud</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default DeleteApplicationModal