// apps/mobile/src/features/auth/hooks/useLoginNative.ts

import { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { login } from '../pages/authServiceNative'
import { useAuth } from '../../../context/AuthContext'
import { 
  ValidationError, 
  AuthenticationError,
  processFieldErrors, 
  getDisplayMessage 
} from '../../../utils/errorHandler'
import { showError } from '../utils/toast'

export default function useLoginNative() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, any>>({})
  const nav = useNavigation<any>()
  const { refreshUser } = useAuth()

  const handleChange = (field: 'email' | 'password', value: string) => {
    if (fieldErrors[field]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
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
      // 1. Login y guardar tokens
      await login(form.email, form.password)
      
      console.log('✅ Login successful, tokens saved')
      
      // 2. Cargar usuario completo desde /auth/me 
      await refreshUser()
      
      console.log('✅ User session loaded')
      
      // 3. Navegar al dashboard 
      nav.navigate('Dashboard')

    } catch (error: any) {
      console.error('❌ Login error:', error)

      if (error instanceof ValidationError) {
        if (error.details && error.details.length > 0) {
          const processedErrors = processFieldErrors(error.details)
          setFieldErrors(processedErrors)
          showError('Por favor revisa los campos marcados')
        } else {
          showError(getDisplayMessage(error))
        }
      } else if (error instanceof AuthenticationError) {
        showError('Credenciales incorrectas. Verifica tu correo y contraseña.')
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