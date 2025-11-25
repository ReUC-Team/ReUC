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
  deadlineConstraints: any
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
  deadlineConstraints,
}) => {
  const styles = useThemedStyles(createRequestProjectFormStyles)
  const palette = useThemedPalette()
  const [showHelp, setShowHelp] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)

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
      const year = selectedDate.getFullYear()
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0')
      const day = String(selectedDate.getDate()).padStart(2, '0')
      const formattedDate = `${year}-${month}-${day}`
      
      handleChange('deadline', formattedDate)
    }
  }

  // Formatear fecha para mostrar
  const getDisplayDate = () => {
    if (!form.deadline) return 'dd/mm/aaaa'
    
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
    label: f.name,
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
            color={palette.text}
          />
        </TouchableOpacity>
      </View>

      {/* Help box */}
      {showHelp && (
        <View style={styles.helpBox}>
          <View style={styles.helpIcon}>
            <Ionicons name="bulb-outline" size={20} color="#92400E" />
          </View>
          <View style={styles.helpContent}>
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
        </View>
      )}

      <View style={styles.form}>
        {/* SECCIÓN: INFORMACIÓN DEL PROYECTO */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIcon}>
              <Ionicons name="document-text-outline" size={20} color={palette.primary} />
            </View>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>Información Básica</Text>
              <Text style={styles.sectionSubtitle}>Describe tu proyecto de manera clara y concisa</Text>
            </View>
          </View>

          {/* Título */}
          <View style={styles.field}>
            <Text style={styles.label}>
              Título del proyecto <Text style={styles.requiredIndicator}>*</Text>
            </Text>
            <TextInput
              style={[
                styles.input,
                fieldErrors.title && { borderColor: '#DC2626', borderWidth: 2 },
              ]}
              placeholder="Ej: Sistema de gestión de inventario"
              placeholderTextColor={palette.textSecondary}
              value={form.title}
              onChangeText={(text) => handleChange('title', text)}
              editable={!isLoading}
            />
            {fieldErrors.title && (
              <Text style={styles.errorText}>{fieldErrors.title}</Text>
            )}
          </View>

          {/* Descripción corta */}
          <View style={styles.field}>
            <Text style={styles.label}>
              Descripción corta <Text style={styles.requiredIndicator}>*</Text>
            </Text>
            <TextInput
              style={[
                styles.input,
                fieldErrors.shortDescription && { borderColor: '#DC2626', borderWidth: 2 },
              ]}
              placeholder="Resumen en una línea para la tarjeta del proyecto"
              placeholderTextColor={palette.textSecondary}
              value={form.shortDescription}
              onChangeText={(text) => handleChange('shortDescription', text)}
              editable={!isLoading}
              maxLength={150}
            />
            {fieldErrors.shortDescription && (
              <Text style={styles.errorText}>{fieldErrors.shortDescription}</Text>
            )}
          </View>

          {/* Descripción detallada */}
          <View style={styles.field}>
            <Text style={styles.label}>
              Descripción detallada <Text style={styles.requiredIndicator}>*</Text>
            </Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                fieldErrors.description && { borderColor: '#DC2626', borderWidth: 2 },
              ]}
              placeholder="Describe el problema a resolver, objetivos, alcance y cualquier detalle relevante..."
              placeholderTextColor={palette.textSecondary}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              value={form.description}
              onChangeText={(text) => handleChange('description', text)}
              editable={!isLoading}
            />
            {fieldErrors.description && (
              <Text style={styles.errorText}>{fieldErrors.description}</Text>
            )}
          </View>
        </View>

        {/* SECCIÓN: CLASIFICACIÓN */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIcon}>
              <Ionicons name="pricetag-outline" size={20} color={palette.primary} />
            </View>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>Clasificación</Text>
              <Text style={styles.sectionSubtitle}>Categoriza tu proyecto (opcional)</Text>
            </View>
          </View>

          {/* Tipo de proyecto */}
          <MultiSelectDropdown
            label="Tipo de proyecto"
            options={projectTypeOptions}
            selectedIds={form.projectType}
            onChange={(ids) => handleChange('projectType', ids)}
            placeholder="Selecciona uno o más tipos"
            optional
          />

          {/* Facultad sugerida */}
          <MultiSelectDropdown
            label="Facultad sugerida"
            options={facultyOptions}
            selectedIds={form.faculty}
            onChange={(ids) => handleChange('faculty', ids)}
            placeholder="Selecciona una o más facultades"
            optional
          />

          {/* Tipo de problemática */}
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

        {/* SECCIÓN: FECHA LÍMITE */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIcon}>
              <Ionicons name="calendar-outline" size={20} color={palette.primary} />
            </View>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>Fecha Límite</Text>
              <Text style={styles.sectionSubtitle}>¿Cuándo necesitas completar el proyecto?</Text>
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>
              Vigencia <Text style={styles.requiredIndicator}>*</Text>
            </Text>
            
            {/* Mostrar restricciones si hay un tipo de proyecto seleccionado */}
            {deadlineConstraints && deadlineConstraints.min && (
              <View style={styles.infoBox}>
                <Ionicons name="information-circle-outline" size={20} color="#92400E" />
                <Text style={styles.infoText}>
                  Selecciona un tipo de proyecto para ver el rango de fechas permitidas
                </Text>
              </View>
            )}
            
            <TouchableOpacity
              style={[
                styles.input,
                fieldErrors.deadline && { borderColor: '#DC2626', borderWidth: 2 },
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
              <Text style={styles.errorText}>{fieldErrors.deadline}</Text>
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

        {/* SECCIÓN: BANNER */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIcon}>
              <Ionicons name="image-outline" size={20} color={palette.primary} />
            </View>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>Banner del Proyecto</Text>
              <Text style={styles.sectionSubtitle}>Imagen principal que representará tu proyecto</Text>
            </View>
          </View>

          <BannerSelector
            label=""
            defaultBanners={defaultBanners}
            selectedBannerUuid={form.selectedBannerUuid}
            customBannerName={form.customBannerName}
            onSelectBanner={handleBannerSelection}
            onPickCustomBanner={handlePickCustomBanner}
            error={fieldErrors.banner}
          />
        </View>

        {/* SECCIÓN: ARCHIVOS ADJUNTOS */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIcon}>
              <Ionicons name="attach-outline" size={20} color={palette.primary} />
            </View>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>Archivos Adjuntos</Text>
              <Text style={styles.sectionSubtitle}>Documentos de apoyo (opcional, máximo 5 archivos)</Text>
            </View>
          </View>

          <AttachmentsList
            attachments={form.attachments}
            onRemove={handleRemoveAttachment}
            onAdd={handlePickAttachments}
            maxFiles={5}
          />
        </View>
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
            isLoading && { opacity: 0.6 },
          ]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={palette.onPrimary} />
          ) : (
            <Text style={styles.submitButtonText}>Enviar Solicitud</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

export default RequestProjectForm