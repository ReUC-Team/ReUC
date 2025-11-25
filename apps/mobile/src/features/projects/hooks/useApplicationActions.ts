// apps/mobile/src/features/projects/hooks/useApplicationActions.ts

import { useState } from 'react'
import { deleteApplication } from '../services/projectsService'
import { getDisplayMessage } from '../../../utils/errorHandler'
import Toast from 'react-native-toast-message'

/**
 * Hook para acciones de aplicaciones: delete
 */
export default function useApplicationActions(applicationUuid: string) {
  const [isDeleting, setIsDeleting] = useState(false)

  /**
   * Elimina la aplicación
   */
  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteApplication(applicationUuid)
      Toast.show({
        type: 'success',
        text1: '✓ Solicitud eliminada',
        text2: 'La solicitud ha sido eliminada exitosamente',
        position: 'bottom',
        visibilityTime: 3000,
      })
      return true
    } catch (err: any) {
      console.error('Error deleting application:', err)
      const errorMessage = getDisplayMessage(err)
      Toast.show({
        type: 'error',
        text1: 'Error al eliminar',
        text2: errorMessage,
        position: 'bottom',
        visibilityTime: 4000,
      })
      return false
    } finally {
      setIsDeleting(false)
    }
  }

  return {
    isDeleting,
    handleDelete,
  }
}