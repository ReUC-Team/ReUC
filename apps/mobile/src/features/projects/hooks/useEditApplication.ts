// apps/mobile/src/features/projects/hooks/useEditApplication.ts

import { useState } from 'react'
import { updateApplication, approveApplication } from '../services/projectsService'
import { getDisplayMessage } from '../../../utils/errorHandler'
import Toast from 'react-native-toast-message'

export default function useEditApplication(applicationUuid: string) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSaveOnly = async (data: any) => {
    setIsLoading(true)
    try {
      await updateApplication(applicationUuid, data)
      Toast.show({
        type: 'success',
        text1: '✓ Cambios guardados',
        text2: 'La información ha sido actualizada',
        position: 'bottom',
        visibilityTime: 3000,
      })
      return true
    } catch (err: any) {
      console.error('Error saving changes:', err)
      Toast.show({
        type: 'error',
        text1: 'Error al guardar',
        text2: getDisplayMessage(err),
        position: 'bottom',
        visibilityTime: 4000,
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveAndApprove = async (data: any) => {
    setIsLoading(true)
    try {
      const response = await approveApplication(applicationUuid, data)
      const projectUuid = response?.project?.uuid_project

      if (!projectUuid) {
        throw new Error('No se pudo obtener el UUID del proyecto creado')
      }

      Toast.show({
        type: 'success',
        text1: '✓ Proyecto aprobado',
        text2: 'El proyecto ha sido creado exitosamente',
        position: 'bottom',
        visibilityTime: 3000,
      })
      return projectUuid
    } catch (err: any) {
      console.error('Error approving project:', err)
      Toast.show({
        type: 'error',
        text1: 'Error al aprobar',
        text2: getDisplayMessage(err),
        position: 'bottom',
        visibilityTime: 4000,
      })
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    handleSaveOnly,
    handleSaveAndApprove,
  }
}