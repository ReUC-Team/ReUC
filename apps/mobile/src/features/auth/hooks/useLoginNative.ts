import { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { login } from '../pages/authServiceNative'
import { tokenStorage } from '../utils/tokenStorage' 
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
      const { user } = await login(form.email, form.password)
      
      // ← AGREGAR: Verificar tokens guardados
      const accessToken = await tokenStorage.getAccessToken()
      const refreshToken = await tokenStorage.getRefreshToken()
      console.log('✅ Access Token:', accessToken ? 'Guardado' : 'NO guardado')
      console.log('✅ Refresh Token:', refreshToken ? 'Guardado' : 'NO guardado')
      
      nav.navigate('Dashboard')

    } catch (error: any) {
      console.error('Login error:', error)

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