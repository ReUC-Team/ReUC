import { useState } from 'react';
import { deleteApplication } from '../projectsService';
import { Alerts } from '@/shared/alerts';
import { getDisplayMessage } from '@/utils/errorHandler';

/**
 * Hook para acciones de aplicaciones: delete
 */
export default function useApplicationActions(applicationUuid) {
  const [isDeleting, setIsDeleting] = useState(false);

  /**
   * Elimina la aplicación (soft delete)
   */
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteApplication(applicationUuid);
      Alerts.success('Solicitud eliminada exitosamente');
      return true;
    } catch (err) {
      console.error('Error deleting application:', err);
      const errorMessage = getDisplayMessage(err);
      
      if (err.statusCode === 403) {
        if (errorMessage.toLowerCase().includes('owner') || 
            errorMessage.toLowerCase().includes('autor')) {
          Alerts.error('Solo el autor de la solicitud puede eliminarla');
        } else if (errorMessage.toLowerCase().includes('approved') ||
                   errorMessage.toLowerCase().includes('aprobad')) {
          Alerts.error('No se puede eliminar una solicitud que ya ha sido aprobada');
        } else {
          Alerts.error(errorMessage);
        }
      } else {
        Alerts.error(errorMessage);
      }
      
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    isDeleting,
    handleDelete
  };
}
