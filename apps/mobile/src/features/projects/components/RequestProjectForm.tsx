// apps/mobile/src/features/projects/components/RequestProjectForm.tsx

import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useThemedStyles, useThemedPalette } from '../../../hooks/useThemedStyles'
import { createRequestProjectFormStyles } from '../../../styles/components/projects/RequestProjectForm.styles'
import MultiSelectDropdown from '../../../components/MultiSelectDropdown'
import BannerSelector from '../components/BannerSelector'
import AttachmentsList from '../components/AttachmentsList'
import useFormProjectMetadata from '../hooks/useFormProjectMetadata'

interface RequestProjectFormProps {
  form: any
  fieldErrors: Record<string, string>
  isLoading: boolean
  handleChange: (name: string, value: any) => void
  handleBannerSelection: (uuid: string) => void
  handlePickCustomBanner: () => void
  handlePickAttachments: () => void
  handleRemoveAttachment: (index: number) => void
  handleSubmit: () => void
}

const RequestProjectForm: React.FC<RequestProjectFormProps> = ({
  form,
  fieldErrors,
  isLoading,
  handleChange,
  handleBannerSelection,
  handlePickCustomBanner,
  handlePickAttachments,
  handleRemoveAttachment,
  handleSubmit,
}) => {
  const styles = useThemedStyles(createRequestProjectFormStyles)
  const palette = useThemedPalette()
  const [showHelp, setShowHelp] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)

  // Cargar metadata (facultades, tipos de proyecto, etc.)
  const {
    faculties,
    projectTypes,
    problemTypes,
    defaultBanners,
    isLoading: metadataLoading,
  } = useFormProjectMetadata()

  // Manejar cambio de fecha
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios')
    
    if (selectedDate) {
      // Formatear fecha como YYYY-MM-DD para el backend
      const year = selectedDate.getFullYear()
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0')
      const day = String(selectedDate.getDate()).padStart(2, '0')
      const formattedDate = `${year}-${month}-${day}`
      
      handleChange('deadline', formattedDate)
    }
  }

  // Formatear fecha para mostrar
  const getDisplayDate = () => {
    if (!form.deadline) return 'Seleccionar fecha'
    
    const date = new Date(form.deadline)
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  // Mostrar loading mientras carga metadata
  if (metadataLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={palette.primary} />
        <Text style={{ marginTop: 16, color: palette.textSecondary }}>
          Cargando formulario...
        </Text>
      </View>
    )
  }

  // Convertir datos a formato para MultiSelectDropdown
  const facultyOptions = faculties.map((f) => ({
    id: f.faculty_id,
    label: f.abbreviation || f.name,
  }))

  const projectTypeOptions = projectTypes.map((pt) => ({
    id: pt.project_type_id,
    label: pt.name,
  }))

  const problemTypeOptions = problemTypes.map((pt) => ({
    id: pt.problem_type_id,
    label: pt.name,
  }))

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header dentro del scroll */}
      <View style={styles.headerInScroll}>
        <Text style={styles.titleInScroll}>
          Solicitar un <Text style={styles.titleAccentInScroll}>proyecto</Text>
        </Text>
        <TouchableOpacity onPress={() => setShowHelp(!showHelp)}>
          <Ionicons
            name="information-circle-outline"
            size={28}
            color="#4E4E4E"
          />
        </TouchableOpacity>
      </View>

      {/* Help box */}
      {showHelp && (
        <View style={styles.helpBox}>
          <Text style={styles.helpTitle}>
            Recomendaciones para llenar el formulario:
          </Text>
          <Text style={styles.helpText}>
            • Título: Sé claro y conciso{'\n'}
            • Descripción corta: Resume en 1-2 líneas{'\n'}
            • Descripción detallada: Explica el problema a resolver{'\n'}
            • Banner: Selecciona una imagen representativa{'\n'}
            • Adjuntos: Puedes agregar hasta 5 archivos
          </Text>
        </View>
      )}

      <View style={styles.form}>
        {/* TÍTULO DEL PROYECTO */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información del proyecto</Text>

          <View style={styles.field}>
            <Text style={styles.label}>Título del proyecto *</Text>
            <TextInput
              style={[
                styles.input,
                fieldErrors.title && { borderColor: palette.error },
              ]}
              placeholder="Título atractivo y claro"
              placeholderTextColor={palette.textSecondary}
              value={form.title}
              onChangeText={(text) => handleChange('title', text)}
              editable={!isLoading}
            />
            {fieldErrors.title && (
              <Text style={{ color: palette.error, fontSize: 12, marginTop: 4 }}>
                {fieldErrors.title}
              </Text>
            )}
          </View>

          {/* DESCRIPCIÓN CORTA */}
          <View style={styles.field}>
            <Text style={styles.label}>Descripción corta *</Text>
            <TextInput
              style={[
                styles.input,
                fieldErrors.shortDescription && { borderColor: palette.error },
              ]}
              placeholder="Resumen breve (aparecerá en la tarjeta)"
              placeholderTextColor={palette.textSecondary}
              value={form.shortDescription}
              onChangeText={(text) => handleChange('shortDescription', text)}
              editable={!isLoading}
              maxLength={150}
            />
            {fieldErrors.shortDescription && (
              <Text style={{ color: palette.error, fontSize: 12, marginTop: 4 }}>
                {fieldErrors.shortDescription}
              </Text>
            )}
          </View>

          {/* DESCRIPCIÓN DETALLADA */}
          <View style={styles.field}>
            <Text style={styles.label}>Descripción detallada *</Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                fieldErrors.description && { borderColor: palette.error },
              ]}
              placeholder="Describe el proyecto que necesitas resolver"
              placeholderTextColor={palette.textSecondary}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              value={form.description}
              onChangeText={(text) => handleChange('description', text)}
              editable={!isLoading}
            />
            {fieldErrors.description && (
              <Text style={{ color: palette.error, fontSize: 12, marginTop: 4 }}>
                {fieldErrors.description}
              </Text>
            )}
          </View>
        </View>

        {/* TIPO DE PROYECTO */}
        <View style={styles.section}>
          <MultiSelectDropdown
            label="Tipo de proyecto"
            options={projectTypeOptions}
            selectedIds={form.projectType}
            onChange={(ids) => handleChange('projectType', ids)}
            placeholder="Selecciona uno o más tipos"
            optional
          />
        </View>

        {/* FACULTAD SUGERIDA */}
        <View style={styles.section}>
          <MultiSelectDropdown
            label="Facultad sugerida"
            options={facultyOptions}
            selectedIds={form.faculty}
            onChange={(ids) => handleChange('faculty', ids)}
            placeholder="Selecciona una o más facultades"
            optional
          />
        </View>

        {/* TIPO DE PROBLEMÁTICA */}
        <View style={styles.section}>
          <MultiSelectDropdown
            label="Tipo de problemática"
            options={problemTypeOptions}
            selectedIds={form.problemType}
            onChange={(ids) => handleChange('problemType', ids)}
            placeholder="Selecciona uno o más tipos"
            optional
          />

          {/* Campo "Otro" si está seleccionado */}
          {form.problemType.some((id: number) => {
            const problemType = problemTypes.find((pt) => pt.problem_type_id === id)
            return problemType?.name.toLowerCase() === 'otro'
          }) && (
            <View style={styles.field}>
              <Text style={styles.label}>¿Cuál? *</Text>
              <TextInput
                style={styles.input}
                placeholder="Describe tu problemática"
                placeholderTextColor={palette.textSecondary}
                value={form.problemTypeOther}
                onChangeText={(text) => handleChange('problemTypeOther', text)}
                editable={!isLoading}
              />
            </View>
          )}
        </View>

        {/* VIGENCIA */}
        <View style={styles.section}>
          <View style={styles.field}>
            <Text style={styles.label}>Vigencia *</Text>
            <TouchableOpacity
              style={[
                styles.input,
                fieldErrors.deadline && { borderColor: palette.error },
                { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
              ]}
              onPress={() => setShowDatePicker(true)}
              disabled={isLoading}
            >
              <Text
                style={{
                  color: form.deadline ? palette.text : palette.textSecondary,
                }}
              >
                {getDisplayDate()}
              </Text>
              <Ionicons
                name="calendar-outline"
                size={20}
                color={palette.textSecondary}
              />
            </TouchableOpacity>
            {fieldErrors.deadline && (
              <Text style={{ color: palette.error, fontSize: 12, marginTop: 4 }}>
                {fieldErrors.deadline}
              </Text>
            )}
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={form.deadline ? new Date(form.deadline) : new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}
        </View>

        {/* BANNER */}
        <View style={styles.section}>
          <BannerSelector
            label="Banner del proyecto *"
            defaultBanners={defaultBanners}
            selectedBannerUuid={form.selectedBannerUuid}
            customBannerName={form.customBannerName}
            onSelectBanner={handleBannerSelection}
            onPickCustomBanner={handlePickCustomBanner}
            error={fieldErrors.banner}
          />
        </View>

        {/* ARCHIVOS ADJUNTOS */}
        <View style={styles.section}>
          <AttachmentsList
            attachments={form.attachments}
            onRemove={handleRemoveAttachment}
            onAdd={handlePickAttachments}
            maxFiles={5}
          />
        </View>

        {/* BOTONES */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => {
              // Limpiar formulario
            }}
            disabled={isLoading}
          >
            <Text style={styles.clearButtonText}>Limpiar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.submitButton,
              isLoading && { opacity: 0.5 },
            ]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={palette.onPrimary} />
            ) : (
              <Text style={styles.submitButtonText}>Enviar solicitud</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}

export default RequestProjectForm