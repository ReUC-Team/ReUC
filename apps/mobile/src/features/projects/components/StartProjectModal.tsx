// apps/mobile/src/features/projects/components/StartProjectModal.tsx

import React from 'react'
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useThemedStyles, useThemedPalette } from '../../../hooks/useThemedStyles'
import { createStartProjectModalStyles } from '../../../styles/components/projects/StartProjectModal.styles'
import useProjectValidation from '../hooks/useProjectValidation'

interface StartProjectModalProps {
  isOpen: boolean
  onClose: () => void
  project: any
  onConfirm: () => void
  isLoading: boolean
}

const StartProjectModal: React.FC<StartProjectModalProps> = ({
  isOpen,
  onClose,
  project,
  onConfirm,
  isLoading,
}) => {
  const styles = useThemedStyles(createStartProjectModalStyles)
  const palette = useThemedPalette()
  const validation = useProjectValidation(project, project?.teamConstraints)

  const handleClose = () => {
    if (!isLoading) {
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
            <Text style={styles.title}>Iniciar Proyecto</Text>
            <TouchableOpacity onPress={handleClose} disabled={isLoading}>
              <Ionicons name="close" size={24} color={palette.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Validations */}
            <View style={styles.validationsContainer}>
              <View style={styles.validationItem}>
                <Ionicons
                  name={validation.teamValid ? 'checkmark-circle' : 'close-circle'}
                  size={20}
                  color={validation.teamValid ? '#84CC16' : '#DC2626'}
                />
                <Text
                  style={[
                    styles.validationText,
                    { color: validation.teamValid ? '#84CC16' : '#DC2626' },
                  ]}
                >
                  Equipo completo
                </Text>
              </View>

              <View style={styles.validationItem}>
                <Ionicons
                  name={validation.deadlineValid ? 'checkmark-circle' : 'close-circle'}
                  size={20}
                  color={validation.deadlineValid ? '#84CC16' : '#DC2626'}
                />
                <Text
                  style={[
                    styles.validationText,
                    { color: validation.deadlineValid ? '#84CC16' : '#DC2626' },
                  ]}
                >
                  Fecha límite válida
                </Text>
              </View>
            </View>

            {/* Errors */}
            {validation.errors.length > 0 && (
              <View style={styles.errorBox}>
                <Text style={styles.errorTitle}>No se puede iniciar el proyecto:</Text>
                <View style={styles.errorList}>
                  {validation.errors.map((error, idx) => (
                    <Text key={idx} style={styles.errorItem}>
                      • {error}
                    </Text>
                  ))}
                </View>

                {/* Missing Roles Details */}
                {validation.missingRoles && validation.missingRoles.length > 0 && (
                  <View style={styles.missingRolesContainer}>
                    <Text style={styles.missingRolesTitle}>Miembros faltantes por rol:</Text>
                    {validation.missingRoles.map((roleInfo, idx) => (
                      <View key={idx} style={styles.missingRoleItem}>
                        <Ionicons name="alert-circle" size={16} color="#DC2626" />
                        <Text style={styles.missingRoleText}>
                          <Text style={styles.missingRoleBold}>{roleInfo.role}</Text>: Tienes{' '}
                          {roleInfo.current}, necesitas mínimo {roleInfo.min}
                          {roleInfo.max !== '∞' && ` (máximo ${roleInfo.max})`} -{' '}
                          <Text style={styles.missingRoleBold}>Faltan {roleInfo.needed}</Text>
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            )}

            {/* Success Message */}
            {validation.canStart && (
              <View style={styles.successBox}>
                <Text style={styles.successText}>
                  Una vez iniciado, no podrás modificar el equipo del proyecto.
                </Text>
              </View>
            )}
          </ScrollView>

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
                styles.buttonStart,
                (!validation.canStart || isLoading) && styles.buttonDisabled,
              ]}
              onPress={onConfirm}
              disabled={!validation.canStart || isLoading}
            >
              {isLoading ? (
                <>
                  <ActivityIndicator size="small" color={palette.onPrimary} />
                  <Text style={styles.buttonStartText}>Iniciando...</Text>
                </>
              ) : (
                <Text style={styles.buttonStartText}>Iniciar Proyecto</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default StartProjectModal