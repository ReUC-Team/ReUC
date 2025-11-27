// apps/mobile/src/features/projects/hooks/useProjectResources.ts

import { useState } from 'react'
import {
  uploadProjectResource,
  updateProjectResource,
  deleteProjectResource,
} from '../services/projectsService'
import * as DocumentPicker from 'expo-document-picker'
import { Alert } from 'react-native'

export function useProjectResources(projectUuid: string) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      })

      if (result.canceled) {
        return null
      }

      return result.assets[0]
    } catch (err) {
      console.error('Error picking document:', err)
      Alert.alert('Error', 'No se pudo seleccionar el archivo')
      return null
    }
  }

  const handleUpload = async () => {
    const file = await pickDocument()
    if (!file) return null

    setIsLoading(true)
    setError(null)
    
    try {
      const result = await uploadProjectResource(projectUuid, file)
      Alert.alert('Éxito', 'Recurso subido correctamente')
      return result
    } catch (err: any) {
      console.error('Error uploading resource:', err)
      const errorMessage = err.message || 'Error al subir el archivo'
      setError(errorMessage)
      Alert.alert('Error', errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdate = async (resourceUuid: string) => {
    const file = await pickDocument()
    if (!file) return null

    setIsLoading(true)
    setError(null)
    
    try {
      const result = await updateProjectResource(projectUuid, resourceUuid, file)
      Alert.alert('Éxito', 'Recurso actualizado correctamente')
      return result
    } catch (err: any) {
      console.error('Error updating resource:', err)
      const errorMessage = err.message || 'Error al actualizar el archivo'
      setError(errorMessage)
      Alert.alert('Error', errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (resourceUuid: string, resourceName: string) => {
    return new Promise<void>((resolve, reject) => {
      Alert.alert(
        'Confirmar eliminación',
        `¿Estás seguro de que deseas eliminar "${resourceName}"?`,
        [
          {
            text: 'Cancelar',
            style: 'cancel',
            onPress: () => reject(new Error('Cancelled')),
          },
          {
            text: 'Eliminar',
            style: 'destructive',
            onPress: async () => {
              setIsLoading(true)
              setError(null)
              
              try {
                await deleteProjectResource(projectUuid, resourceUuid)
                Alert.alert('Éxito', 'Recurso eliminado correctamente')
                resolve()
              } catch (err: any) {
                console.error('Error deleting resource:', err)
                const errorMessage = err.message || 'Error al eliminar el archivo'
                setError(errorMessage)
                Alert.alert('Error', errorMessage)
                reject(err)
              } finally {
                setIsLoading(false)
              }
            },
          },
        ]
      )
    })
  }

  return {
    uploadResource: handleUpload,
    updateResource: handleUpdate,
    deleteResource: handleDelete,
    isLoading,
    error,
  }
}