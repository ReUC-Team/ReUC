import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemedStyles, useThemedPalette } from '../../../hooks/useThemedStyles';
import { createRequestProjectFormStyles } from '../../../styles/components/projects/RequestProjectForm.styles';

const PROJECT_TYPES = [
  { key: 'tesis', label: 'Tesis' },
  { key: 'servicio', label: 'Servicio Social Constitucional' },
  { key: 'proyecto-integrador', label: 'Proyectos Integradores' },
  { key: 'practicas-profesionales', label: 'Prácticas Profesionales' },
  { key: 'proyecto-investigacion', label: 'Proyectos de Investigación' },
];

const FACULTIES = [
  { key: 'FIE', label: 'FIE' },
  { key: 'FACIMAR', label: 'FACIMAR' },
  { key: 'FECAM', label: 'FECAM' },
  { key: 'EDUC', label: 'EDUC' },
];

const PROBLEM_TYPES = [
  { key: 'ambiental', label: 'Ambiental' },
  { key: 'tecnologica', label: 'Tecnológica' },
  { key: 'social', label: 'Social' },
  { key: 'logistica', label: 'Logística' },
  { key: 'otro', label: 'Otro' },
];

interface RequestProjectFormProps {
  form: any;
  handleChange: (name: string, value: any) => void;
  handleSubmit: () => void;
  showHelp: boolean;
  setShowHelp: (show: boolean) => void;
  error: string | null;
}

const RequestProjectForm: React.FC<RequestProjectFormProps> = ({
  form,
  handleChange,
  handleSubmit,
  showHelp,
  setShowHelp,
  error,
}) => {
  const styles = useThemedStyles(createRequestProjectFormStyles);
  const palette = useThemedPalette();
  const [showInfo, setShowInfo] = useState(false);

  const handleCheckboxChange = (fieldName: string, value: string) => {
    const currentValues = form[fieldName] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v: string) => v !== value)
      : [...currentValues, value];
    handleChange(fieldName, newValues);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header dentro del scroll - se ocultará al bajar */}
      <View style={styles.headerInScroll}>
        <Text style={styles.titleInScroll}>
          Solicitar un <Text style={styles.titleAccentInScroll}>proyecto</Text>
        </Text>
        <TouchableOpacity onPress={() => setShowHelp(!showHelp)}>
          <Ionicons name="information-circle-outline" size={28} color="#4E4E4E" />
        </TouchableOpacity>
      </View>

      {showHelp && (
        <View style={styles.helpBox}>
          <Text style={styles.helpTitle}>Recomendaciones para llenar el formulario:</Text>
          <Text style={styles.helpText}>
            • Proporciona información clara y detallada{'\n'}
            • Selecciona todas las opciones que apliquen{'\n'}
            • Asegúrate de incluir medios de contacto válidos
          </Text>
        </View>
      )}

      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <View style={styles.form}>
        {/* Información del solicitante */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información del solicitante</Text>

          <View style={styles.field}>
            <Text style={styles.label}>Nombre del solicitante</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre completo"
              placeholderTextColor={palette.textSecondary}
              value={form.name}
              onChangeText={(text) => handleChange('name', text)}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Teléfono de contacto</Text>
            <TextInput
              style={styles.input}
              placeholder="1234567890"
              placeholderTextColor={palette.textSecondary}
              keyboardType="phone-pad"
              value={form.phone}
              onChangeText={(text) => handleChange('phone', text)}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Correo de contacto</Text>
            <TextInput
              style={styles.input}
              placeholder="ejemplo@correo.com"
              placeholderTextColor={palette.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
              value={form.contactEmail}
              onChangeText={(text) => handleChange('contactEmail', text)}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>
              Empresa <Text style={styles.optional}>(sugerido)</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre de tu empresa"
              placeholderTextColor={palette.textSecondary}
              value={form.company}
              onChangeText={(text) => handleChange('company', text)}
            />
          </View>
        </View>

        {/* Detalles del proyecto */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detalles del proyecto</Text>

          <View style={styles.field}>
            <Text style={styles.label}>Título del proyecto</Text>
            <TextInput
              style={styles.input}
              placeholder="Título atractivo y claro"
              placeholderTextColor={palette.textSecondary}
              value={form.title}
              onChangeText={(text) => handleChange('title', text)}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Descripción corta</Text>
            <TextInput
              style={styles.input}
              placeholder="Resumen breve (para tarjeta)"
              placeholderTextColor={palette.textSecondary}
              value={form.shortDescription}
              onChangeText={(text) => handleChange('shortDescription', text)}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Descripción detallada</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe el proyecto que necesitas"
              placeholderTextColor={palette.textSecondary}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              value={form.description}
              onChangeText={(text) => handleChange('description', text)}
            />
          </View>
        </View>

        {/* Tipo de proyecto */}
        <View style={styles.section}>
          <View style={styles.labelWithIcon}>
            <Text style={styles.label}>
              Tipo de proyecto <Text style={styles.optional}>(sugerido)</Text>
            </Text>
            <TouchableOpacity onPress={() => setShowInfo(!showInfo)}>
              <Ionicons name="information-circle-outline" size={20} color={palette.text} />
            </TouchableOpacity>
          </View>

          {showInfo && (
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                Selecciona la modalidad académica a la que aplica tu proyecto.
              </Text>
            </View>
          )}

          {PROJECT_TYPES.map((type) => (
            <View key={type.key} style={styles.checkboxContainer}>
              <Switch
                value={form.projectType?.includes(type.key)}
                onValueChange={() => handleCheckboxChange('projectType', type.key)}
                trackColor={{ false: palette.gray, true: palette.primary }}
              />
              <Text style={styles.checkboxLabel}>{type.label}</Text>
            </View>
          ))}
        </View>

        {/* Facultad sugerida */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Facultad sugerida <Text style={styles.optional}>(sugerido)</Text>
          </Text>

          {FACULTIES.map((faculty) => (
            <View key={faculty.key} style={styles.checkboxContainer}>
              <Switch
                value={form.faculty?.includes(faculty.key)}
                onValueChange={() => handleCheckboxChange('faculty', faculty.key)}
                trackColor={{ false: palette.gray, true: palette.primary }}
              />
              <Text style={styles.checkboxLabel}>{faculty.label}</Text>
            </View>
          ))}
        </View>

        {/* Tipo de problemática */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Tipo de problemática <Text style={styles.optional}>(sugerido)</Text>
          </Text>

          {PROBLEM_TYPES.map((problem) => (
            <View key={problem.key} style={styles.checkboxContainer}>
              <Switch
                value={form.problemType?.includes(problem.key)}
                onValueChange={() => handleCheckboxChange('problemType', problem.key)}
                trackColor={{ false: palette.gray, true: palette.primary }}
              />
              <Text style={styles.checkboxLabel}>{problem.label}</Text>
            </View>
          ))}

          {form.problemType?.includes('otro') && (
            <View style={styles.field}>
              <Text style={styles.label}>¿Cuál?</Text>
              <TextInput
                style={styles.input}
                placeholder="Describe tu problemática"
                placeholderTextColor={palette.textSecondary}
                value={form.problemTypeOther}
                onChangeText={(text) => handleChange('problemTypeOther', text)}
              />
            </View>
          )}
        </View>

        {/* Vigencia */}
        <View style={styles.section}>
          <View style={styles.field}>
            <Text style={styles.label}>Vigencia</Text>
            <TextInput
              style={styles.input}
              placeholder="DD/MM/AAAA"
              placeholderTextColor={palette.textSecondary}
              value={form.deadline}
              onChangeText={(text) => handleChange('deadline', text)}
            />
          </View>
        </View>

        {/* Botones */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Limpiar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Enviar solicitud</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default RequestProjectForm;