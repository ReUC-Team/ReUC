// apps/mobile/src/features/profile/components/EditProfileModal.tsx

import React, { useRef, useMemo } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import RNPickerSelect from 'react-native-picker-select'
import PhoneInput from 'react-native-phone-number-input'
import { getNames } from 'country-list'
import { useThemedStyles, useThemedPalette } from '../../../hooks/useThemedStyles'
import { createEditProfileModalStyles } from '../../../styles/components/profile/EditProfileModal.styles'
import { useEditProfileNative } from '../hooks/useEditProfileNative'

interface EditProfileModalProps {
  visible: boolean
  onClose: () => void
  profile: any
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  visible,
  onClose,
  profile,
}) => {
  const styles = useThemedStyles(createEditProfileModalStyles)
  const palette = useThemedPalette()
  const phoneInputRef = useRef<any>(null)
  
  const {
    form,
    fieldErrors,
    handleChange,
    handlePhoneChange,
    handleLocationChange,
    isLoading,
    handleSubmit,
  } = useEditProfileNative(profile, onClose)

  // Generar lista de países desde country-list (igual que en web)
  const countries = useMemo(() => {
    return Object.entries(getNames()).map(([code, name]) => ({
      label: name,
      value: name,
    }))
  }, [])

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.overlay}>
          <View style={styles.modal}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Editar Perfil</Text>
              <TouchableOpacity onPress={onClose} disabled={isLoading}>
                <Ionicons name="close" size={24} color={palette.text} />
              </TouchableOpacity>
            </View>

            {/* Form */}
            <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
              {/* Nombre */}
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Nombre*</Text>
                <TextInput
                  style={[
                    styles.input,
                    fieldErrors.firstName && styles.inputError,
                  ]}
                  value={form.firstName}
                  onChangeText={(value) => handleChange('firstName', value)}
                  placeholder="Nombre"
                  placeholderTextColor={palette.textSecondary}
                  editable={!isLoading}
                />
                {fieldErrors.firstName && (
                  <Text style={styles.errorText}>
                    {typeof fieldErrors.firstName === 'string' 
                      ? fieldErrors.firstName 
                      : fieldErrors.firstName.message}
                  </Text>
                )}
              </View>

              {/* Primer Apellido */}
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Primer Apellido*</Text>
                <TextInput
                  style={[
                    styles.input,
                    fieldErrors.middleName && styles.inputError,
                  ]}
                  value={form.middleName}
                  onChangeText={(value) => handleChange('middleName', value)}
                  placeholder="Primer Apellido"
                  placeholderTextColor={palette.textSecondary}
                  editable={!isLoading}
                />
                {fieldErrors.middleName && (
                  <Text style={styles.errorText}>
                    {typeof fieldErrors.middleName === 'string' 
                      ? fieldErrors.middleName 
                      : fieldErrors.middleName.message}
                  </Text>
                )}
              </View>

              {/* Segundo Apellido */}
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Segundo Apellido*</Text>
                <TextInput
                  style={[
                    styles.input,
                    fieldErrors.lastName && styles.inputError,
                  ]}
                  value={form.lastName}
                  onChangeText={(value) => handleChange('lastName', value)}
                  placeholder="Segundo Apellido"
                  placeholderTextColor={palette.textSecondary}
                  editable={!isLoading}
                />
                {fieldErrors.lastName && (
                  <Text style={styles.errorText}>
                    {typeof fieldErrors.lastName === 'string' 
                      ? fieldErrors.lastName 
                      : fieldErrors.lastName.message}
                  </Text>
                )}
              </View>

              {/* Nombre de la Organización */}
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Nombre de la Organización*</Text>
                <TextInput
                  style={[
                    styles.input,
                    fieldErrors.organizationName && styles.inputError,
                  ]}
                  value={form.organizationName}
                  onChangeText={(value) => handleChange('organizationName', value)}
                  placeholder="Empresa o institución"
                  placeholderTextColor={palette.textSecondary}
                  editable={!isLoading}
                />
                {fieldErrors.organizationName && (
                  <Text style={styles.errorText}>
                    {typeof fieldErrors.organizationName === 'string' 
                      ? fieldErrors.organizationName 
                      : fieldErrors.organizationName.message}
                  </Text>
                )}
              </View>

              {/* Ubicación con RNPickerSelect */}
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Ubicación*</Text>
                <View
                  style={[
                    styles.pickerContainer,
                    fieldErrors.location && styles.inputError,
                  ]}
                >
                  <RNPickerSelect
                    onValueChange={handleLocationChange}
                    items={countries}
                    value={form.location}
                    placeholder={{
                      label: 'Elige tu ubicación',
                      value: '',
                      color: palette.textSecondary,
                    }}
                    style={{
                      inputIOS: {
                        fontSize: 16,
                        paddingVertical: 12,
                        paddingHorizontal: 12,
                        color: palette.text,
                      },
                      inputAndroid: {
                        fontSize: 16,
                        paddingVertical: 12,
                        paddingHorizontal: 12,
                        color: palette.text,
                      },
                      placeholder: {
                        color: palette.textSecondary,
                      },
                    }}
                    useNativeAndroidPickerStyle={false}
                    disabled={isLoading}
                    Icon={() => (
                      <View style={styles.pickerIconContainer}>
                        <Ionicons
                          name="chevron-down"
                          size={20}
                          color={palette.textSecondary}
                        />
                      </View>
                    )}
                  />
                </View>
                {fieldErrors.location && (
                  <Text style={styles.errorText}>
                    {typeof fieldErrors.location === 'string' 
                      ? fieldErrors.location 
                      : fieldErrors.location.message}
                  </Text>
                )}
              </View>

              {/* Teléfono con PhoneInput */}
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Teléfono de contacto*</Text>
                <View
                  style={[
                    styles.phoneInputContainer,
                    fieldErrors.phoneNumber && styles.inputError,
                  ]}
                >
                  <PhoneInput
                    ref={phoneInputRef}
                    defaultValue={form.phoneNumber}
                    defaultCode="MX"
                    layout="first"
                    onChangeText={handlePhoneChange}
                    withDarkTheme={false}
                    withShadow={false}
                    autoFocus={false}
                    countryPickerProps={{
                      withAlphaFilter: true,
                      withCallingCode: true,
                      withEmoji: true,
                    }}
                    placeholder="Teléfono de contacto"
                    containerStyle={styles.phoneContainer}
                    textContainerStyle={styles.phoneTextContainer}
                    textInputStyle={styles.phoneTextInput}
                    codeTextStyle={styles.phoneCodeText}
                    flagButtonStyle={styles.phoneFlagButton}
                    textInputProps={{
                      placeholderTextColor: palette.textSecondary,
                      editable: !isLoading,
                      maxLength: 10, // Límite de 10 dígitos
                    }}
                  />
                </View>
                {fieldErrors.phoneNumber && (
                  <Text style={styles.errorText}>
                    {typeof fieldErrors.phoneNumber === 'string' 
                      ? fieldErrors.phoneNumber 
                      : fieldErrors.phoneNumber.message}
                  </Text>
                )}
              </View>

              {/* Descripción */}
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Descripción</Text>
                <TextInput
                  style={[
                    styles.input,
                    styles.textArea,
                    fieldErrors.description && styles.inputError,
                  ]}
                  value={form.description}
                  onChangeText={(value) => handleChange('description', value)}
                  placeholder="Cuéntanos sobre ti o tu organización"
                  placeholderTextColor={palette.textSecondary}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  editable={!isLoading}
                />
                {fieldErrors.description && (
                  <Text style={styles.errorText}>
                    {typeof fieldErrors.description === 'string' 
                      ? fieldErrors.description 
                      : fieldErrors.description.message}
                  </Text>
                )}
              </View>
            </ScrollView>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onClose}
                disabled={isLoading}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>Guardar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}

export default EditProfileModal