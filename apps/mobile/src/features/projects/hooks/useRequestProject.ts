// apps/mobile/src/features/projects/hooks/useRequestProject.ts

import { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { createApplication } from '../services/projectsService'
import {
  ValidationError,
  getDisplayMessage,
} from '../../../utils/errorHandler'
import Toast from 'react-native-toast-message'
import * as DocumentPicker from 'expo-document-picker'
import * as ImagePicker from 'expo-image-picker'
import useFormProjectMetadata from './useFormProjectMetadata'

interface FormState {
  title: string
  shortDescription: string
  description: string
  deadline: string
  selectedBannerUuid: string
  customBannerFile: any | null
  customBannerName: string
  projectType: number[]
  faculty: number[]
  problemType: number[]
  problemTypeOther: string
  attachments: any[]
}

interface DeadlineConstraints {
  min: string | null
  max: string | null
  projectTypeName: string | null
  minMonths: number
  maxMonths: number
}

export default function useRequestProject(onClose?: () => void) {
  const navigation = useNavigation<any>()
  const { projectTypes } = useFormProjectMetadata()
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

  const [deadlineConstraints, setDeadlineConstraints] = useState<DeadlineConstraints>({
    min: null,
    max: null,
    projectTypeName: null,
    minMonths: 0,
    maxMonths: 0,
  })

  // Helper para formatear fecha local sin zona horaria
  const formatDateLocal = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // Calcular constraints de fecha cuando cambie el tipo de proyecto
  useEffect(() => {
    if (form.projectType.length > 0 && projectTypes.length > 0) {
      const selectedTypeId = Number(form.projectType[0])
      const projectType = projectTypes.find(pt => pt.project_type_id === selectedTypeId)
      
      if (projectType) {
        const today = new Date()
        const todayLocal = new Date(today.getFullYear(), today.getMonth(), today.getDate())
        
        const minMonths = projectType.minEstimatedMonths || 0
        const maxMonths = projectType.maxEstimatedMonths || 24
        
        // Calcular fecha mínima (hoy + minMonths)
        const minDate = new Date(todayLocal)
        minDate.setMonth(minDate.getMonth() + minMonths)
        
        // Calcular fecha máxima (hoy + maxMonths + 1 mes de buffer)
        const maxDate = new Date(todayLocal)
        maxDate.setMonth(maxDate.getMonth() + maxMonths + 1)
        
        setDeadlineConstraints({
          min: formatDateLocal(minDate),
          max: formatDateLocal(maxDate),
          projectTypeName: projectType.name,
          minMonths,
          maxMonths: maxMonths + 1
        })
      }
    } else {
      setDeadlineConstraints({ 
        min: null, 
        max: null, 
        projectTypeName: null,
        minMonths: 0,
        maxMonths: 0
      })
    }
  }, [form.projectType, projectTypes])

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

    // Validar fecha en tiempo real
    if (name === 'deadline' && value && deadlineConstraints && deadlineConstraints.min) {
      const [year, month, day] = value.split('-').map(Number)
      const selectedDate = new Date(year, month - 1, day)
      
      const [minYear, minMonth, minDay] = deadlineConstraints.min.split('-').map(Number)
      const minDate = new Date(minYear, minMonth - 1, minDay)
      
      const [maxYear, maxMonth, maxDay] = deadlineConstraints.max!.split('-').map(Number)
      const maxDate = new Date(maxYear, maxMonth - 1, maxDay)

      const today = new Date()
      const todayLocal = new Date(today.getFullYear(), today.getMonth(), today.getDate())

      // Calcular meses desde hoy
      const monthsDiff = Math.round(
        (selectedDate.getFullYear() - todayLocal.getFullYear()) * 12 +
        (selectedDate.getMonth() - todayLocal.getMonth()) +
        (selectedDate.getDate() - todayLocal.getDate()) / 30
      )

      if (selectedDate < minDate) {
        Toast.show({
          type: 'info',
          text1: `Fecha demasiado pronto`,
          text2: `El proyecto debe durar al menos ${deadlineConstraints.minMonths} meses desde hoy`,
          position: 'bottom',
        })
      } else if (selectedDate > maxDate) {
        Toast.show({
          type: 'info',
          text1: `Fecha demasiado lejana`,
          text2: `No puede superar ${deadlineConstraints.maxMonths} meses desde hoy`,
          position: 'bottom',
        })
      } else {
        Toast.show({
          type: 'success',
          text1: `Fecha válida`,
          text2: `${monthsDiff} meses desde hoy`,
          position: 'bottom',
          visibilityTime: 2000,
        })
      }
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
          selectedBannerUuid: '',
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

        const totalFiles = currentAttachments.length + newAttachments.length
        if (totalFiles > 5) {
          Toast.show({
            type: 'info',
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
      errors.deadline = 'La fecha de vigencia es obligatoria'
    } else if (deadlineConstraints && deadlineConstraints.min && deadlineConstraints.max) {
      const [year, month, day] = form.deadline.split('-').map(Number)
      const selectedDate = new Date(year, month - 1, day)
      
      const [minYear, minMonth, minDay] = deadlineConstraints.min.split('-').map(Number)
      const minDate = new Date(minYear, minMonth - 1, minDay)
      
      const [maxYear, maxMonth, maxDay] = deadlineConstraints.max.split('-').map(Number)
      const maxDate = new Date(maxYear, maxMonth - 1, maxDay)

      if (selectedDate < minDate) {
        errors.deadline = `Fecha demasiado pronto. El proyecto debe durar al menos ${deadlineConstraints.minMonths} meses desde hoy.`
      } else if (selectedDate > maxDate) {
        errors.deadline = `Fecha demasiado lejana. No puede superar ${deadlineConstraints.maxMonths} meses desde hoy (incluyendo 1 mes de margen).`
      }
    }

    if (!form.selectedBannerUuid && !form.customBannerFile) {
      errors.banner = 'Debes seleccionar o subir un banner'
    }

    return errors
  }

  // Enviar formulario
  const handleSubmit = async () => {
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
      const formData = new FormData()

      formData.append('title', form.title)
      formData.append('shortDescription', form.shortDescription)
      formData.append('description', form.description)
      formData.append('deadline', form.deadline)

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

      if (form.projectType && form.projectType.length > 0) {
        form.projectType.forEach((id) => {
          formData.append('projectType[]', id.toString())
        })
      }

      if (form.faculty && form.faculty.length > 0) {
        form.faculty.forEach((id) => {
          formData.append('faculty[]', id.toString())
        })
      }

      if (form.problemType && form.problemType.length > 0) {
        form.problemType.forEach((id) => {
          formData.append('problemType[]', id.toString())
        })
      }

      if (form.problemTypeOther?.trim()) {
        formData.append('problemTypeOther', form.problemTypeOther)
      }

      if (form.attachments && form.attachments.length > 0) {
        form.attachments.forEach((file) => {
          formData.append('attachments', {
            uri: file.uri,
            type: file.mimeType || 'application/octet-stream',
            name: file.name,
          } as any)
        })
      }

      console.log('📤 Sending form data...')

      await createApplication(formData)

      Toast.show({
        type: 'success',
        text1: '¡Proyecto enviado!',
        text2: 'Tu solicitud ha sido enviada correctamente',
        position: 'bottom',
      })

      setTimeout(() => {
        navigation.navigate('MyApplications')
      }, 1500)
    } catch (error: any) {
      console.error('❌ Error creating application:', error)

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
    deadlineConstraints,
  }
}