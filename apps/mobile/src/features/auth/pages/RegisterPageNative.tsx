// apps/mobile/src/features/auth/pages/RegisterPageNative.tsx

import React from 'react'
import {
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  View,
  Text,
  Image,
  Switch,
  ActivityIndicator,
  Platform,
} from 'react-native'
import AuthInput from '../components/AuthInput'
import SubmitBtn from '../components/SubmitBtn'
import AltLink from '../components/AltLink'
import useRegisterNative from '../hooks/useRegisterNative'
import {
  CheckboxStyles,
} from '../../../styles/components/auth/authComponents.styles'
import { RegisterPageStyles as styles, palette, spacing } from '../../../styles'
import registerImage from '../../../assets/register-image.png'

export default function RegisterPageNative() {
  const { form, handleChange, handleSubmit, isLoading } = useRegisterNative()
  const showStudentField = form.email.includes('@ucol.mx')

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Image
            source={registerImage}
            style={styles.image}
            resizeMode="contain"
          />

          <View style={styles.card}>
            <Text style={styles.title}>
              Únete a <Text style={styles.highlight}>ReUC</Text>
            </Text>
            <Text style={styles.subtitle}>
              Regístrate para empezar a guardar y explorar contenido
            </Text>

            <AuthInput
              label="Correo electrónico"
              value={form.email}
              placeholder='ejemplo@ucol.mx'
              onChangeText={v => handleChange('email', v)}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            {showStudentField && (
              <AuthInput
                label="Número de cuenta"
                placeholder='4 dígitos maestro / 8 estudiantes'
                value={form.universityId}
                onChangeText={v => handleChange('universityId', v)}
                keyboardType="numeric"
              />
            )}

            <AuthInput
              label="Contraseña"
              placeholder='••••••••••'
              value={form.password}
              onChangeText={v => handleChange('password', v)}
              secureTextEntry
            />

            <AuthInput
              label="Confirmar contraseña"
              placeholder='••••••••••'
              value={form.confirmPassword}
              onChangeText={v => handleChange('confirmPassword', v)}
              secureTextEntry
            />

            {/* Checkbox usa sus propios estilos pendiente  */}
            <View style={CheckboxStyles.container}>
              <Switch
                value={form.acceptTerms}
                onValueChange={v => handleChange('acceptTerms', v)}
              />
              <Text style={CheckboxStyles.label}>
                Acepto los términos y condiciones
              </Text>
            </View>

            <SubmitBtn onPress={handleSubmit} disabled={isLoading}>
              {isLoading
                ? <ActivityIndicator color={palette.onPrimary} />
                : 'Registrarse'
              }
            </SubmitBtn>
            {/* Espaciador */}
            <View style={{ height: spacing.sm }} />

            
            <AltLink
              text="¿Ya tienes una cuenta?"
              linkText="Iniciar sesión"
              to="Login"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
