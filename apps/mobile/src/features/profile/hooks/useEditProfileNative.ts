// apps/mobile/src/features/profile/hooks/useEditProfileNative.ts

import { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { updateProfile } from '../services/profileServiceNative'
import { 
  ValidationError, 
  processFieldErrors, 
  getDisplayMessage 
} from '../../../utils/errorHandler'
import Toast from 'react-native-toast-message'

// Función helper para mostrar errores
const showError = (msg: string) => {
  Toast.show({
    type: 'error',
    text1: msg,
    position: 'bottom',
    visibilityTime: 3000,
    bottomOffset: 60,
  })
}

interface ProfileForm {
  firstName: string
  middleName: string
  lastName: string
  organizationName: string
  phoneNumber: string
  location: string
  description: string
}

export function useEditProfileNative(profile: any, onClose?: () => void) {
  const [form, setForm] = useState<ProfileForm>({
    firstName: profile?.firstName || '',
    middleName: profile?.middleName || '',
    lastName: profile?.lastName || '',
    organizationName: profile?.organizationName || '',
    phoneNumber: profile?.phoneNumber || '',
    location: profile?.location || '',
    description: profile?.description || '',
  })

  const [isLoading, setIsLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const navigation = useNavigation<any>()

  const handleChange = (field: keyof ProfileForm, value: string) => {
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (fieldErrors[field]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }

    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handlePhoneChange = (value: string) => {
    // Limpiar error del campo
    if (fieldErrors.phoneNumber) {
      setFieldErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors.phoneNumber
        return newErrors
      })
    }
    
    // PhoneInput ya devuelve el número con formato completo (+52...)
    // Solo guardamos el valor tal cual
    setForm(prev => ({ ...prev, phoneNumber: value }))
  }

  const handleLocationChange = (value: string) => {
    if (fieldErrors.location) {
      setFieldErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors.location
        return newErrors
      })
    }
    
    setForm(prev => ({ ...prev, location: value }))
  }

  const handleSubmit = async () => {
    if (isLoading) return
    
    setIsLoading(true)
    setFieldErrors({})

    try {
      // Preparar datos para enviar
      // El backend espera phoneNumber en formato: +521234567890 (sin espacios ni caracteres extra)
      const dataToSend = {
        ...form,
        phoneNumber: form.phoneNumber.replace(/\s+/g, ''), // Remover espacios
      }

      await updateProfile(dataToSend)

      Toast.show({
        type: 'success',
        text1: '¡Perfil actualizado correctamente!',
        position: 'bottom',
        visibilityTime: 3000,
        bottomOffset: 60,
      })

      // Cerrar modal/pantalla si existe
      onClose?.()

      // Navegar de vuelta al perfil o dashboard después de un momento
      setTimeout(() => {
        navigation.navigate('Profile')
      }, 500)

    } catch (error: any) {
      console.error('Error updating profile:', error)

      if (error instanceof ValidationError) {
        if (error.details && error.details.length > 0) {
          // Procesar errores y mejorar mensajes
          const processedErrors: Record<string, any> = {}
          
          error.details.forEach((detail: any) => {
            const field = detail.field
            const rule = detail.rule
            
            // Mensajes personalizados según la regla
            let message = 'Este campo es requerido'
            
            if (rule === 'missing_or_empty') {
              message = 'Este campo es requerido'
            } else if (rule === 'invalid_format') {
              message = 'Formato inválido'
            } else if (rule === 'min_length') {
              message = `Debe tener al menos ${detail.expected} caracteres`
            } else if (rule === 'max_length') {
              message = `No debe exceder ${detail.expected} caracteres`
            } else if (detail.message) {
              message = detail.message
            }
            
            processedErrors[field] = {
              rule,
              expected: detail.expected,
              message
            }
          })
          
          setFieldErrors(processedErrors)
          showError('Por favor revisa los campos marcados')
        } else {
          showError(getDisplayMessage(error))
        }
      } else {
        showError(getDisplayMessage(error))
      }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    form,
    fieldErrors,
    handleChange,
    handlePhoneChange,
    handleLocationChange,
    isLoading,
    handleSubmit,
  }
}