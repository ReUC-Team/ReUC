// apps/mobile/src/features/auth/hooks/useRegisterNative.ts

import { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { register } from '../pages/authServiceNative'
import { useAuth } from '../../../context/AuthContext'
import { 
  ValidationError, 
  processFieldErrors, 
  getDisplayMessage 
} from '../../../utils/errorHandler'
import { showError } from '../utils/toast'

interface Form { 
  email: string
  password: string
  confirmPassword: string
  acceptTerms: boolean
  universityId: string
}

export default function useRegisterNative() {
  const [form, setForm] = useState<Form>({
    email: '', 
    password: '', 
    confirmPassword: '', 
    acceptTerms: false, 
    universityId: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, any>>({})
  const nav = useNavigation<any>()
  const { refreshUser } = useAuth()

  const handleChange = (field: keyof Form, value: string | boolean) => {
    // Limpiar error del campo al escribir
    if (fieldErrors[field as string]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field as string]
        return newErrors
      })
    }

    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    if (isLoading) return
    setIsLoading(true)
    setFieldErrors({})

    try {
      // Validar términos y condiciones en frontend
      if (!form.acceptTerms) {
        showError('Debes aceptar los términos y condiciones')
        setIsLoading(false)
        return
      }

      // Llamar al servicio (lanzará errores estructurados)
      await register(form)

      console.log('✅ Register successful')

      // 2. Cargar usuario completo desde /auth/me 
      await refreshUser()

      console.log('✅ User session loaded')

      // 3. NO navegar manualmente
      // El AppNavigator detectará que user !== null
      // y automáticamente mostrará el DashboardStack

    } catch (error: any) {
      console.error('Registration error:', error)

      // Procesar errores de validación por campo
      if (error instanceof ValidationError) {
        if (error.details && error.details.length > 0) {
          const processedErrors = processFieldErrors(error.details)
          setFieldErrors(processedErrors)
          showError('Hay errores en el formulario. Por favor revisa los campos marcados.')
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
    isLoading,
    fieldErrors,
    handleChange, 
    handleSubmit 
  }
}