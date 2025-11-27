// apps/mobile/src/features/auth/pages/LoginPageNative.tsx

import React from 'react'
import {
  KeyboardAvoidingView,
  ScrollView,
  Image,
  Text,
  ActivityIndicator,
  Platform,
} from 'react-native'
import AuthInput from '../components/AuthInput'
import SubmitBtn from '../components/SubmitBtn'
import AltLink from '../components/AltLink'
import useLoginNative from '../hooks/useLoginNative'
import { LoginPageStyles as styles, palette } from '../../../styles'
import loginImage from '../../../assets/login-image.png'

export default function LoginPageNative() {
  const { form, handleChange, handleSubmit, isLoading } = useLoginNative()

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Image
          source={loginImage}
          style={styles.image}
          resizeMode="contain"
        />

        <Text style={styles.title}>
          Bienvenido a <Text style={styles.highlight}>ReUC</Text>
        </Text>

        <AuthInput
          label="Correo electrónico"
          placeholder='ejemplo@ucol.mx'
          value={form.email}
          onChangeText={v => handleChange('email', v)}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <AuthInput
          label="Contraseña"
          placeholder='••••••••••'
          value={form.password}
          onChangeText={v => handleChange('password', v)}
          secureTextEntry
        />

        <SubmitBtn
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading
            ? <ActivityIndicator color={palette.onPrimary} />
            : 'Iniciar sesión'
          }
        </SubmitBtn>

        <AltLink
          text="¿No tienes una cuenta?"
          linkText="Regístrate"
          to="Register"
        />
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
