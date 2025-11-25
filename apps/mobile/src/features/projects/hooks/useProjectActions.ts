// apps/mobile/src/features/projects/hooks/useProjectActions.ts

import { useState } from 'react'
import { startProject, rollbackProject, updateProjectDeadline } from '../services/projectsService'
import { getDisplayMessage } from '../../../utils/errorHandler'
import Toast from 'react-native-toast-message'

/**
 * Hook para acciones del proyecto: start, rollback, updateDeadline
 */
export default function useProjectActions(projectUuid: string) {
  const [isStarting, setIsStarting] = useState(false)
  const [isRollingBack, setIsRollingBack] = useState(false)
  const [isUpdatingDeadline, setIsUpdatingDeadline] = useState(false)

  /**
   * Inicia el proyecto
   */
  const handleStart = async () => {
    setIsStarting(true)
    try {
      await startProject(projectUuid)
      Toast.show({
        type: 'success',
        text1: '✓ Proyecto iniciado',
        text2: 'El proyecto ha sido iniciado exitosamente',
        position: 'bottom',
        visibilityTime: 3000,
      })
      return true
    } catch (err: any) {
      console.error('Error starting project:', err)
      const errorMessage = getDisplayMessage(err)
      Toast.show({
        type: 'error',
        text1: 'Error al iniciar',
        text2: errorMessage,
        position: 'bottom',
        visibilityTime: 4000,
      })
      return false
    } finally {
      setIsStarting(false)
    }
  }

  /**
   * Hace rollback del proyecto
   */
  const handleRollback = async () => {
    setIsRollingBack(true)
    try {
      await rollbackProject(projectUuid)
      Toast.show({
        type: 'success',
        text1: '✓ Proyecto revertido',
        text2: 'El proyecto ha sido revertido exitosamente',
        position: 'bottom',
        visibilityTime: 3000,
      })
      return true
    } catch (err: any) {
      console.error('Error rolling back project:', err)
      const errorMessage = getDisplayMessage(err)
      
      // Diferenciar error 403 de "no eres el creador"
      if (err.statusCode === 403) {
        if (errorMessage.toLowerCase().includes('creator') || 
            errorMessage.toLowerCase().includes('creador')) {
          Toast.show({
            type: 'error',
            text1: 'Acción no permitida',
            text2: 'Solo el profesor que aprobó este proyecto puede revertirlo',
            position: 'bottom',
            visibilityTime: 4000,
          })
        } else {
          Toast.show({
            type: 'error',
            text1: 'Error al revertir',
            text2: errorMessage,
            position: 'bottom',
            visibilityTime: 4000,
          })
        }
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error al revertir',
          text2: errorMessage,
          position: 'bottom',
          visibilityTime: 4000,
        })
      }
      
      return false
    } finally {
      setIsRollingBack(false)
    }
  }

  /**
   * Actualiza el deadline del proyecto
   */
  const handleUpdateDeadline = async (newDeadline: string) => {
    setIsUpdatingDeadline(true)
    try {
      await updateProjectDeadline(projectUuid, newDeadline)
      Toast.show({
        type: 'success',
        text1: '✓ Fecha actualizada',
        text2: 'La fecha límite ha sido actualizada exitosamente',
        position: 'bottom',
        visibilityTime: 3000,
      })
      return true
    } catch (err: any) {
      console.error('Error updating deadline:', err)
      const errorMessage = getDisplayMessage(err)
      Toast.show({
        type: 'error',
        text1: 'Error al actualizar fecha',
        text2: errorMessage,
        position: 'bottom',
        visibilityTime: 4000,
      })
      return false
    } finally {
      setIsUpdatingDeadline(false)
    }
  }

  return {
    isStarting,
    isRollingBack,
    isUpdatingDeadline,
    handleStart,
    handleRollback,
    handleUpdateDeadline,
  }
}