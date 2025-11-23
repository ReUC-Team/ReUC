import { useState } from 'react';
import { startProject, rollbackProject, updateProjectDeadline } from '../projectsService';
import { Alerts } from '@/shared/alerts';
import { getDisplayMessage } from '@/utils/errorHandler';

/**
 * Hook para acciones del proyecto: start, rollback, updateDeadline
 */
export default function useProjectActions(projectUuid) {
  const [isStarting, setIsStarting] = useState(false);
  const [isRollingBack, setIsRollingBack] = useState(false);
  const [isUpdatingDeadline, setIsUpdatingDeadline] = useState(false);

  /**
   * Inicia el proyecto
   */
  const handleStart = async () => {
    setIsStarting(true);
    try {
      await startProject(projectUuid);
      Alerts.success('Proyecto iniciado exitosamente');
      return true;
    } catch (err) {
      console.error('Error starting project:', err);
      const errorMessage = getDisplayMessage(err);
      Alerts.error(errorMessage);
      return false;
    } finally {
      setIsStarting(false);
    }
  };

  /**
   * Hace rollback del proyecto
   */
  const handleRollback = async () => {
    setIsRollingBack(true);
    try {
      await rollbackProject(projectUuid);
      Alerts.success('Proyecto revertido exitosamente');
      return true;
    } catch (err) {
      console.error('Error rolling back project:', err);
      const errorMessage = getDisplayMessage(err);
      
      // Diferenciar error 403 de "no eres el creador" vs "no tienes rol"
      if (err.statusCode === 403) {
        if (errorMessage.toLowerCase().includes('creator') || 
            errorMessage.toLowerCase().includes('creador')) {
          Alerts.error('Solo el profesor que aprobó este proyecto puede revertirlo');
        } else {
          Alerts.error(errorMessage);
        }
      } else {
        Alerts.error(errorMessage);
      }
      
      return false;
    } finally {
      setIsRollingBack(false);
    }
  };

  /**
   * Actualiza el deadline del proyecto
   */
  const handleUpdateDeadline = async (newDeadline) => {
    setIsUpdatingDeadline(true);
    try {
      await updateProjectDeadline(projectUuid, newDeadline);
      Alerts.success('Fecha límite actualizada exitosamente');
      return true;
    } catch (err) {
      console.error('Error updating deadline:', err);
      const errorMessage = getDisplayMessage(err);
      Alerts.error(errorMessage);
      return false;
    } finally {
      setIsUpdatingDeadline(false);
    }
  };

  return {
    isStarting,
    isRollingBack,
    isUpdatingDeadline,
    handleStart,
    handleRollback,
    handleUpdateDeadline
  };
}