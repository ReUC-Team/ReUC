// apps/mobile/src/features/projects/components/EditApplicationModal.tsx

import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useThemedStyles, useThemedPalette } from '../../../hooks/useThemedStyles'
import { createEditApplicationModalStyles } from '../../../styles/components/projects/EditApplicationModal.styles'
import useFormProjectMetadata from '../hooks/useFormProjectMetadata'
import { formatDateSpanish, parseDateLocal } from '../../../utils/dateUtils'

interface EditApplicationModalProps {
  isOpen: boolean
  onClose: () => void
  application: any
  onSaveSuccess: () => void
  onApproveSuccess: (projectUuid: string) => void
  isLoading: boolean
  onSaveOnly: (data: any) => void
  onSaveAndApprove: (data: any) => void
}

const EditApplicationModal: React.FC<EditApplicationModalProps> = ({
  isOpen,
  onClose,
  application,
  onSaveSuccess,
  onApproveSuccess,
  isLoading,
  onSaveOnly,
  onSaveAndApprove,
}) => {
  const styles = useThemedStyles(createEditApplicationModalStyles)
  const palette = useThemedPalette()
  const { faculties, projectTypes, problemTypes } = useFormProjectMetadata()

  const [form, setForm] = useState({
    projectType: [] as number[],
    faculty: [] as number[],
    problemType: [] as (number | string)[],
    problemTypeOther: '',
    deadline: null as Date | null,
  })

  const [showDatePicker, setShowDatePicker] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [deadlineConstraints, setDeadlineConstraints] = useState<any>(null)

  // Inicializar formulario con datos de la aplicación
  useEffect(() => {
    if (isOpen && application) {
      const projectTypeIds = application.projectTypes?.map((pt: any) => pt.project_type_id) || []
      const facultyIds = application.faculties?.map((f: any) => f.faculty_id) || []
      const problemTypeIds = application.problemTypes?.map((pt: any) => pt.problem_type_id) || []

      setForm({
        projectType: projectTypeIds,
        faculty: facultyIds,
        problemType: problemTypeIds,
        problemTypeOther: '',
        deadline: application.deadline ? parseDateLocal(application.deadline.split('T')[0]) : null,
      })
    }
  }, [isOpen, application])

  // Calcular constraints de fecha
  useEffect(() => {
    if (form.projectType.length > 0 && form.deadline && application?.createdAt) {
      const selectedTypeId = form.projectType[0]
      const projectType = projectTypes.find(pt => pt.project_type_id === selectedTypeId)

      if (projectType) {
        const appDate = parseDateLocal(application.createdAt.split('T')[0])
        if (!appDate) return

        // Fecha mínima = deadline original
        const minDate = form.deadline
        // Fecha máxima = deadline original + 1 mes
        const maxDate = new Date(minDate)
        maxDate.setMonth(maxDate.getMonth() + 1)

        const minMonths = Math.round(
          (minDate.getFullYear() - appDate.getFullYear()) * 12 +
            (minDate.getMonth() - appDate.getMonth())
        )

        setDeadlineConstraints({
          minDate,
          maxDate,
          minMonths,
          maxMonths: minMonths + 1,
          projectTypeName: projectType.name,
          applicationDate: appDate,
        })
      }
    }
  }, [form.projectType, form.deadline, projectTypes, application])

  const handleClose = () => {
    if (!isLoading) {
      setFieldErrors({})
      onClose()
    }
  }

  const handleProjectTypeToggle = (id: number) => {
    setForm(prev => ({
      ...prev,
      projectType: prev.projectType.includes(id)
        ? prev.projectType.filter(x => x !== id)
        : [...prev.projectType, id],
    }))
    if (fieldErrors.projectType) {
      setFieldErrors(prev => ({ ...prev, projectType: '' }))
    }
  }

  const handleFacultySelect = (id: number) => {
    setForm(prev => ({ ...prev, faculty: [id] }))
    if (fieldErrors.faculty) {
      setFieldErrors(prev => ({ ...prev, faculty: '' }))
    }
  }

  const handleProblemTypeToggle = (id: number | string) => {
    setForm(prev => ({
      ...prev,
      problemType: prev.problemType.includes(id)
        ? prev.problemType.filter(x => x !== id)
        : [...prev.problemType, id],
    }))
    if (fieldErrors.problemType) {
      setFieldErrors(prev => ({ ...prev, problemType: '' }))
    }
  }

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false)
    }
    if (selectedDate) {
      setForm(prev => ({ ...prev, deadline: selectedDate }))
    }
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (form.projectType.length === 0) {
      errors.projectType = 'Selecciona al menos un tipo de proyecto'
    }
    if (form.faculty.length === 0) {
      errors.faculty = 'Selecciona una facultad'
    }
    if (form.problemType.length === 0) {
      errors.problemType = 'Selecciona al menos un tipo de problemática'
    }
    if (form.problemType.includes('otro') && !form.problemTypeOther.trim()) {
      errors.problemTypeOther = 'Describe la problemática personalizada'
    }
    if (!form.deadline) {
      errors.deadline = 'La fecha de vigencia es obligatoria'
    }

    return errors
  }

  const handleSaveOnly = () => {
    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    const year = form.deadline!.getFullYear()
    const month = String(form.deadline!.getMonth() + 1).padStart(2, '0')
    const day = String(form.deadline!.getDate()).padStart(2, '0')
    const deadlineStr = `${year}-${month}-${day}`

    const payload = {
      title: application.title,
      shortDescription: application.shortDescription,
      description: application.detailedDescription,
      deadline: deadlineStr,
      projectType: form.projectType,
      faculty: form.faculty,
      problemType: form.problemType.filter(pt => pt !== 'otro'),
      problemTypeOther: form.problemType.includes('otro') ? form.problemTypeOther.trim() : undefined,
    }

    onSaveOnly(payload)
  }

  const handleSaveAndApprove = () => {
    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    const year = form.deadline!.getFullYear()
    const month = String(form.deadline!.getMonth() + 1).padStart(2, '0')
    const day = String(form.deadline!.getDate()).padStart(2, '0')
    const deadlineStr = `${year}-${month}-${day}`

    const payload = {
      title: application.title,
      shortDescription: application.shortDescription,
      description: application.detailedDescription,
      deadline: deadlineStr,
      projectType: form.projectType,
      faculty: form.faculty,
      problemType: form.problemType.filter(pt => pt !== 'otro'),
      problemTypeOther: form.problemType.includes('otro') ? form.problemTypeOther.trim() : undefined,
    }

    onSaveAndApprove(payload)
  }

  if (!isOpen) return null

  return (
    <Modal visible={isOpen} transparent animationType="fade" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Editar Proyecto</Text>
            <TouchableOpacity onPress={handleClose} disabled={isLoading}>
              <Ionicons name="close" size={24} color={palette.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Tipo de Proyecto */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tipo de proyecto *</Text>
              {projectTypes.map(pt => (
                <TouchableOpacity
                  key={pt.project_type_id}
                  style={styles.checkboxContainer}
                  onPress={() => handleProjectTypeToggle(pt.project_type_id)}
                  disabled={isLoading}
                >
                  <View
                    style={[
                      styles.checkbox,
                      form.projectType.includes(pt.project_type_id) && styles.checkboxChecked,
                    ]}
                  >
                    {form.projectType.includes(pt.project_type_id) && (
                      <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                    )}
                  </View>
                  <View style={styles.checkboxLabel}>
                    <Text style={styles.checkboxText}>{pt.name}</Text>
                    <Text style={styles.checkboxSubtext}>
                      {pt.minEstimatedMonths} a {pt.maxEstimatedMonths} meses
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
              {fieldErrors.projectType && (
                <Text style={styles.errorText}>{fieldErrors.projectType}</Text>
              )}
            </View>

            {/* Facultad */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Facultad *</Text>
              {faculties.map(f => (
                <TouchableOpacity
                  key={f.faculty_id}
                  style={styles.radioContainer}
                  onPress={() => handleFacultySelect(f.faculty_id)}
                  disabled={isLoading}
                >
                  <View
                    style={[
                      styles.radio,
                      form.faculty.includes(f.faculty_id) && styles.radioSelected,
                    ]}
                  >
                    {form.faculty.includes(f.faculty_id) && (
                      <View style={styles.radioDot} />
                    )}
                  </View>
                  <Text style={styles.radioText}>{f.abbreviation || f.name}</Text>
                </TouchableOpacity>
              ))}
              {fieldErrors.faculty && <Text style={styles.errorText}>{fieldErrors.faculty}</Text>}
            </View>

            {/* Tipo de Problemática */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tipo de problemática *</Text>
              {problemTypes.map(pt => (
                <TouchableOpacity
                  key={pt.problem_type_id}
                  style={styles.checkboxContainer}
                  onPress={() => handleProblemTypeToggle(pt.problem_type_id)}
                  disabled={isLoading}
                >
                  <View
                    style={[
                      styles.checkbox,
                      form.problemType.includes(pt.problem_type_id) && styles.checkboxChecked,
                    ]}
                  >
                    {form.problemType.includes(pt.problem_type_id) && (
                      <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                    )}
                  </View>
                  <Text style={styles.checkboxText}>{pt.name}</Text>
                </TouchableOpacity>
              ))}

              {/* Otro */}
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => handleProblemTypeToggle('otro')}
                disabled={isLoading}
              >
                <View
                  style={[
                    styles.checkbox,
                    form.problemType.includes('otro') && styles.checkboxChecked,
                  ]}
                >
                  {form.problemType.includes('otro') && (
                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                  )}
                </View>
                <Text style={styles.checkboxText}>Otro</Text>
              </TouchableOpacity>

              {form.problemType.includes('otro') && (
                <TextInput
                  style={styles.textInput}
                  placeholder="Describe la problemática"
                  value={form.problemTypeOther}
                  onChangeText={text => setForm(prev => ({ ...prev, problemTypeOther: text }))}
                  editable={!isLoading}
                  multiline
                />
              )}
              {fieldErrors.problemType && (
                <Text style={styles.errorText}>{fieldErrors.problemType}</Text>
              )}
            </View>

            {/* Fecha de Vigencia */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Vigencia *</Text>
              {deadlineConstraints && (
                <View style={styles.constraintsBox}>
                  <Text style={styles.constraintsText}>
                    Fecha de solicitud: {formatDateSpanish(deadlineConstraints.applicationDate)}
                  </Text>
                  <Text style={styles.constraintsText}>
                    Fecha mínima: {formatDateSpanish(deadlineConstraints.minDate)}
                  </Text>
                  <Text style={styles.constraintsText}>
                    Fecha máxima: {formatDateSpanish(deadlineConstraints.maxDate)}
                  </Text>
                  <Text style={styles.constraintsText}>
                    Duración: {deadlineConstraints.minMonths} a {deadlineConstraints.maxMonths}{' '}
                    meses
                  </Text>
                </View>
              )}

              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
                disabled={isLoading}
              >
                <Ionicons name="calendar-outline" size={20} color={palette.primary} />
                <Text style={styles.dateButtonText}>
                  {form.deadline ? formatDateSpanish(form.deadline) : 'Selecciona una fecha'}
                </Text>
              </TouchableOpacity>

              {(showDatePicker || Platform.OS === 'ios') && form.deadline && (
                <DateTimePicker
                  value={form.deadline}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleDateChange}
                  minimumDate={deadlineConstraints?.minDate}
                  maximumDate={deadlineConstraints?.maxDate}
                />
              )}

              {fieldErrors.deadline && <Text style={styles.errorText}>{fieldErrors.deadline}</Text>}
            </View>

            {/* Información importante */}
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>Información importante:</Text>
              <Text style={styles.infoText}>
                • "Guardar cambios": Solo actualiza la información
              </Text>
              <Text style={styles.infoText}>
                • "Guardar y aprobar": Actualiza y crea el proyecto
              </Text>
            </View>
          </ScrollView>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.buttonSave]}
              onPress={handleSaveOnly}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={palette.onPrimary} />
              ) : (
                <Text style={styles.buttonSaveText}>Guardar cambios</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonApprove]}
              onPress={handleSaveAndApprove}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={palette.onPrimary} />
              ) : (
                <Text style={styles.buttonApproveText}>Guardar y aprobar</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default EditApplicationModal