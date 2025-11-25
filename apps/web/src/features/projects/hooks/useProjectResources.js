import { useState } from 'react';
import { uploadProjectResource, updateProjectResource, deleteProjectResource } from '../projectsService';

export function useProjectResources(projectId) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpload = async (file) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await uploadProjectResource(projectId, file);
      return result;
    } catch (err) {
      console.error("Error uploading resource:", err);
      setError(err.message || "Error al subir el archivo");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (resourceId, file) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await updateProjectResource(projectId, resourceId, file);
      return result;
    } catch (err) {
      console.error("Error updating resource:", err);
      setError(err.message || "Error al actualizar el archivo");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (resourceId) => {
    setIsLoading(true);
    setError(null);
    try {
      await deleteProjectResource(projectId, resourceId);
    } catch (err) {
      console.error("Error deleting resource:", err);
      setError(err.message || "Error al eliminar el archivo");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    uploadResource: handleUpload,
    updateResource: handleUpdate,
    deleteResource: handleDelete,
    isLoading,
    error,
  };
}
