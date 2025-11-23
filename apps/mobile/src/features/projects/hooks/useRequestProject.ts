// apps/mobile/src/features/projects/hooks/useRequestProject.ts

import { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { createApplication } from '../services/projectsService'
import {
  ValidationError,
  getDisplayMessage,
} from '../../../utils/errorHandler'
import Toast from 'react-native-toast-message'
import * as DocumentPicker from 'expo-document-picker'
import * as ImagePicker from 'expo-image-picker'

interface FormState {
  title: string
  shortDescription: string
  description: string
  deadline: string
  selectedBannerUuid: string
  customBannerFile: any | null
  customBannerName: string
  projectType: number[] // IDs de tipos de proyecto
  faculty: number[] // IDs de facultades
  problemType: number[] // IDs de tipos de problemática
  problemTypeOther: string
  attachments: any[]
}

export default function useRequestProject(onClose?: () => void) {
  const navigation = useNavigation<any>()
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const [form, setForm] = useState<FormState>({
    title: '',
    shortDescription: '',
    description: '',
    deadline: '',
    selectedBannerUuid: '',
    customBannerFile: null,
    customBannerName: '',
    projectType: [],
    faculty: [],
    problemType: [],
    problemTypeOther: '',
    attachments: [],
  })

  // Manejar cambio de texto
  const handleChange = (name: keyof FormState, value: any) => {
    // Limpiar error del campo
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }

    setForm((prev) => ({ ...prev, [name]: value }))
  }

  // Manejar selección de banner predefinido
  const handleBannerSelection = (uuid: string) => {
    setForm((prev) => ({
      ...prev,
      selectedBannerUuid: uuid,
      customBannerFile: null,
      customBannerName: '',
    }))

    if (fieldErrors.banner) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.banner
        return newErrors
      })
    }
  }

  // Seleccionar imagen custom para banner
  const handlePickCustomBanner = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      })

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0]
        setForm((prev) => ({
          ...prev,
          customBannerFile: asset,
          customBannerName: asset.fileName || 'banner.jpg',
          selectedBannerUuid: '', // Limpiar UUID si se sube archivo
        }))

        if (fieldErrors.banner) {
          setFieldErrors((prev) => {
            const newErrors = { ...prev }
            delete newErrors.banner
            return newErrors
          })
        }
      }
    } catch (error) {
      console.error('Error picking banner:', error)
      Toast.show({
        type: 'error',
        text1: 'Error al seleccionar imagen',
        position: 'bottom',
      })
    }
  }

  // Seleccionar archivos adjuntos
  const handlePickAttachments = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'image/*',
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.ms-powerpoint',
          'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/zip',
          'text/plain',
        ],
        multiple: true,
        copyToCacheDirectory: true,
      })

      if (!result.canceled) {
        const currentAttachments = form.attachments
        const newAttachments = result.assets || [result]

        // Limitar a 5 archivos
        const totalFiles = currentAttachments.length + newAttachments.length
        if (totalFiles > 5) {
          Toast.show({
            type: 'warning',
            text1: 'Máximo 5 archivos',
            text2: 'Solo puedes adjuntar hasta 5 archivos',
            position: 'bottom',
          })
          return
        }

        setForm((prev) => ({
          ...prev,
          attachments: [...currentAttachments, ...newAttachments],
        }))
      }
    } catch (error) {
      console.error('Error picking attachments:', error)
      Toast.show({
        type: 'error',
        text1: 'Error al seleccionar archivos',
        position: 'bottom',
      })
    }
  }

  // Remover archivo adjunto
  const handleRemoveAttachment = (index: number) => {
    setForm((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }))
  }

  // Validación del formulario
  const validateForm = (): Record<string, string> => {
    const errors: Record<string, string> = {}

    if (!form.title?.trim()) {
      errors.title = 'El título es requerido'
    }

    if (!form.shortDescription?.trim()) {
      errors.shortDescription = 'La descripción corta es requerida'
    }

    if (!form.description?.trim()) {
      errors.description = 'La descripción detallada es requerida'
    }

    if (!form.deadline) {
      errors.deadline = 'La fecha límite es requerida'
    }

    if (!form.selectedBannerUuid && !form.customBannerFile) {
      errors.banner = 'Debes seleccionar o subir un banner'
    }

    return errors
  }

  // Enviar formulario
  const handleSubmit = async () => {
    // Validar
    const errors = validateForm()

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      Toast.show({
        type: 'error',
        text1: 'Por favor completa todos los campos requeridos',
        position: 'bottom',
      })
      return
    }

    setIsLoading(true)
    setFieldErrors({})

    try {
      // Construir FormData
      const formData = new FormData()

      // Campos básicos
      formData.append('title', form.title)
      formData.append('shortDescription', form.shortDescription)
      formData.append('description', form.description)
      formData.append('deadline', form.deadline)

      // Banner (UUID o archivo custom)
      if (form.selectedBannerUuid) {
        formData.append('selectedBannerUuid', form.selectedBannerUuid)
      } else if (form.customBannerFile) {
        const fileUri = form.customBannerFile.uri
        const fileType = form.customBannerFile.mimeType || 'image/jpeg'
        const fileName = form.customBannerFile.fileName || 'banner.jpg'

        formData.append('customBannerFile', {
          uri: fileUri,
          type: fileType,
          name: fileName,
        } as any)
      }

      // Tipo de proyecto (IDs)
      if (form.projectType && form.projectType.length > 0) {
        form.projectType.forEach((id) => {
          formData.append('projectType[]', id.toString())
        })
      }

      // Facultad (IDs)
      if (form.faculty && form.faculty.length > 0) {
        form.faculty.forEach((id) => {
          formData.append('faculty[]', id.toString())
        })
      }

      // Tipo de problemática (IDs)
      if (form.problemType && form.problemType.length > 0) {
        form.problemType.forEach((id) => {
          formData.append('problemType[]', id.toString())
        })
      }

      // Problemática "Otro"
      if (form.problemTypeOther?.trim()) {
        formData.append('problemTypeOther', form.problemTypeOther)
      }

      // Archivos adjuntos
      if (form.attachments && form.attachments.length > 0) {
        form.attachments.forEach((file) => {
          formData.append('attachments', {
            uri: file.uri,
            type: file.mimeType || 'application/octet-stream',
            name: file.name,
          } as any)
        })
      }

      console.log(' Sending form data...')

      // Enviar al backend
      const response = await createApplication(formData)

      Toast.show({
        type: 'success',
        text1: '¡Proyecto enviado!',
        text2: 'Tu solicitud ha sido enviada correctamente',
        position: 'bottom',
      })

      // Navegar a MyApplications
      setTimeout(() => {
        navigation.navigate('MyApplications')
      }, 1500)
    } catch (error: any) {
      console.error('❌ Error creating application:', error)

      // Manejo de errores de validación
      if (error instanceof ValidationError) {
        if (error.details && error.details.length > 0) {
          const processedErrors: Record<string, string> = {}

          error.details.forEach((detail: any) => {
            const field = detail.field
            const rule = detail.rule

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

            processedErrors[field] = message
          })

          setFieldErrors(processedErrors)
          Toast.show({
            type: 'error',
            text1: 'Por favor revisa los campos marcados',
            position: 'bottom',
          })
        } else {
          Toast.show({
            type: 'error',
            text1: getDisplayMessage(error),
            position: 'bottom',
          })
        }
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error al enviar proyecto',
          text2: getDisplayMessage(error),
          position: 'bottom',
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    form,
    fieldErrors,
    isLoading,
    handleChange,
    handleBannerSelection,
    handlePickCustomBanner,
    handlePickAttachments,
    handleRemoveAttachment,
    handleSubmit,
  }
}