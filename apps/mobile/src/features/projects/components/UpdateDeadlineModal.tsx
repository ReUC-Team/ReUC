// apps/mobile/src/features/projects/components/UpdateDeadlineModal.tsx

import React, { useState, useEffect, useMemo } from 'react'
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Platform,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useThemedStyles, useThemedPalette } from '../../../hooks/useThemedStyles'
import { createUpdateDeadlineModalStyles } from '../../../styles/components/projects/UpdateDeadlineModal.styles'
import { parseDateLocal, formatDateSpanish } from '../../../utils/dateUtils'

interface UpdateDeadlineModalProps {
  isOpen: boolean
  onClose: () => void
  project: any
  onConfirm: (newDeadline: string) => void
  isLoading: boolean
}

const UpdateDeadlineModal: React.FC<UpdateDeadlineModalProps> = ({
  isOpen,
  onClose,
  project,
  onConfirm,
  isLoading,
}) => {
  const styles = useThemedStyles(createUpdateDeadlineModalStyles)
  const palette = useThemedPalette()
  const [newDeadline, setNewDeadline] = useState<Date | null>(null)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [validationError, setValidationError] = useState('')

  // Calcular fechas mínimas y máximas basadas en el tipo de proyecto
  const dateConstraints = useMemo(() => {
    if (!project?.createdAt || !project?.projectTypes?.[0]) {
      return null
    }

    const projectType = project.projectTypes[0]
    const createdDate = parseDateLocal(project.createdAt.split('T')[0])
    
    if (!createdDate) return null

    const minMonths = projectType.minEstimatedMonths || 0
    
    // Mínimo: Fecha de creación + meses mínimos del tipo de proyecto
    const minDate = new Date(createdDate)
    minDate.setMonth(minDate.getMonth() + minMonths)

    // Máximo: Regla de negocio específica -> 1 mes después de la fecha mínima
    const maxDate = new Date(minDate)
    maxDate.setMonth(maxDate.getMonth() + 1)

    return {
      minDate,
      maxDate,
      minMonths,
      maxMonths: minMonths + 1,
      projectTypeName: projectType.name,
    }
  }, [project])

  // Inicializar con la fecha actual del proyecto o la mínima permitida
  useEffect(() => {
    if (isOpen && project?.estimatedDate && dateConstraints) {
      const currentDeadline = parseDateLocal(project.estimatedDate.split('T')[0])
      
      if (currentDeadline) {
        // Si la fecha actual es menor a la mínima permitida se usa la mínima
        if (currentDeadline < dateConstraints.minDate) {
          setNewDeadline(dateConstraints.minDate)
        } else {
          setNewDeadline(currentDeadline)
        }
      } else {
        setNewDeadline(dateConstraints.minDate)
      }
      setValidationError('')
    }
  }, [isOpen, project, dateConstraints])

  // Validar la fecha en tiempo real
  useEffect(() => {
    if (!newDeadline || !dateConstraints) {
      setValidationError('')
      return
    }

    // Normalizar a medianoche para comparar solo fechas sin horas
    const selectedTime = new Date(newDeadline).setHours(0, 0, 0, 0)
    const minTime = new Date(dateConstraints.minDate).setHours(0, 0, 0, 0)
    const maxTime = new Date(dateConstraints.maxDate).setHours(0, 0, 0, 0)
    
    if (selectedTime < minTime) {
      setValidationError(
        `La fecha seleccionada (${formatDateSpanish(newDeadline)}) es anterior al mínimo permitido: ${formatDateSpanish(dateConstraints.minDate)}`
      )
    } else if (selectedTime > maxTime) {
      setValidationError(
        `La fecha seleccionada (${formatDateSpanish(newDeadline)}) excede el límite permitido: ${formatDateSpanish(dateConstraints.maxDate)}`
      )
    } else {
      setValidationError('')
    }
  }, [newDeadline, dateConstraints])

  const handleConfirm = () => {
    if (!validationError && newDeadline && !isLoading) {
      // Formato YYYY-MM-DD
      const year = newDeadline.getFullYear()
      const month = String(newDeadline.getMonth() + 1).padStart(2, '0')
      const day = String(newDeadline.getDate()).padStart(2, '0')
      const formattedDate = `${year}-${month}-${day}`
      
      onConfirm(formattedDate)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setValidationError('')
      onClose()
    }
  }

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false)
    }
    
    if (selectedDate) {
      setNewDeadline(selectedDate)
    }
  }

  const isValid = !validationError && newDeadline

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
            <Text style={styles.title}>Actualizar Fecha Límite</Text>
            <TouchableOpacity onPress={handleClose} disabled={isLoading}>
              <Ionicons name="close" size={24} color={palette.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Project Info */}
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>
                Proyecto: <Text style={styles.infoValue}>{project?.title || 'Sin título'}</Text>
              </Text>
              <Text style={styles.infoLabel}>
                Tipo:{' '}
                <Text style={styles.infoValue}>
                  {dateConstraints?.projectTypeName || 'No especificado'}
                </Text>
              </Text>
            </View>

            {/* Constraints */}
            {dateConstraints && (
              <View style={styles.constraintsBox}>
                <Text style={styles.constraintsTitle}>Restricciones del tipo de proyecto:</Text>
                <Text style={styles.constraintItem}>
                  <Text style={styles.constraintLabel}>Mínimo:</Text>{' '}
                  {formatDateSpanish(dateConstraints.minDate)} ({dateConstraints.minMonths} meses)
                </Text>
                <Text style={styles.constraintItem}>
                  <Text style={styles.constraintLabel}>Máximo:</Text>{' '}
                  {formatDateSpanish(dateConstraints.maxDate)} ({dateConstraints.maxMonths} meses)
                </Text>
              </View>
            )}

            {/* Date Picker */}
            <View style={styles.datePickerContainer}>
              <Text style={styles.datePickerLabel}>Nueva Fecha Límite</Text>
              <TouchableOpacity
                style={styles.datePickerButton}
                onPress={() => setShowDatePicker(true)}
                disabled={isLoading}
              >
                <Ionicons name="calendar-outline" size={20} color={palette.primary} />
                <Text style={styles.datePickerText}>
                  {newDeadline ? formatDateSpanish(newDeadline) : 'Selecciona una fecha'}
                </Text>
              </TouchableOpacity>

              {(showDatePicker || Platform.OS === 'ios') && newDeadline && (
                <DateTimePicker
                  value={newDeadline}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleDateChange}
                  minimumDate={dateConstraints?.minDate}
                  maximumDate={dateConstraints?.maxDate}
                  textColor={palette.text}
                  themeVariant="light"
                  style={styles.iosDatePicker}
                />
              )}
            </View>

            {/* Validation Error */}
            {validationError && (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={20} color="#DC2626" />
                <Text style={styles.errorText}>{validationError}</Text>
              </View>
            )}

            {/* Success Preview */}
            {isValid && (
              <View style={styles.successBox}>
                <Ionicons name="checkmark-circle" size={20} color="#84CC16" />
                <Text style={styles.successText}>
                  Nueva fecha límite:{' '}
                  <Text style={styles.successBold}>{formatDateSpanish(newDeadline!)}</Text>
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
                styles.buttonUpdate,
                (!isValid || isLoading) && styles.buttonDisabled,
              ]}
              onPress={handleConfirm}
              disabled={!isValid || isLoading}
            >
              {isLoading ? (
                <>
                  <ActivityIndicator size="small" color={palette.onPrimary} />
                  <Text style={styles.buttonUpdateText}>Actualizando...</Text>
                </>
              ) : (
                <Text style={styles.buttonUpdateText}>Actualizar Fecha</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default UpdateDeadlineModal