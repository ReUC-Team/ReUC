import { useState, useEffect } from "react";
import { getMyApplications } from "../projectsService";
import { Alerts } from "@/shared/alerts";
import { getDisplayMessage, AuthenticationError } from "@/utils/errorHandler";

/**
 * Hook para obtener las applications del usuario autenticado
 * @param {number} initialPage - Página inicial (default: 1)
 * @returns {Object} { applications, pagination, isLoading, error, handlePageChange }
 */
export default function useMyApplications(initialPage = 1) {
  const [applications, setApplications] = useState([]);
  const [pagination, setPagination] = useState({
    page: initialPage,
    perPage: 9,
    totalPages: 1,
    filteredItems: 0,
    totalItems: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getMyApplications(pagination.page, pagination.perPage);

        setApplications(data.applications);
        setPagination((prev) => ({
          ...prev,
          page: data.pagination.page,
          totalPages: data.pagination.totalPages,
          filteredItems: data.pagination.filteredItems,
          totalItems: data.pagination.totalItems,
        }));
      } catch (err) {
        console.error("Error fetching my applications:", err);

        // Si es error de autenticación, redirigir al login
        if (err instanceof AuthenticationError) {
          Alerts.error("Sesión expirada. Redirigiendo al login...");
          setTimeout(() => {
            window.location.href = "/login";
          }, 1500);
          return;
        }

        const errorMessage = getDisplayMessage(err);
        setError(errorMessage);
        Alerts.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, [pagination.page, pagination.perPage]);

  /**
   * Maneja el cambio de página
   * @param {number} newPage - Nueva página
   */
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages && newPage !== pagination.page) {
      setPagination((prev) => ({ ...prev, page: newPage }));
      
      // Scroll suave al inicio de la página
      window.scrollTo({ 
        top: 0, 
        behavior: 'smooth' 
      });
    }
  };

  /**
   * Refresca la lista de applications (útil después de crear/eliminar)
   */
  const refreshApplications = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getMyApplications(pagination.page, pagination.perPage);

      setApplications(data.applications);
      setPagination((prev) => ({
        ...prev,
        page: data.pagination.page,
        totalPages: data.pagination.totalPages,
        filteredItems: data.pagination.filteredItems,
        totalItems: data.pagination.totalItems,
      }));
    } catch (err) {
      console.error("Error refreshing applications:", err);
      const errorMessage = getDisplayMessage(err);
      setError(errorMessage);
      Alerts.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    applications,
    pagination,
    isLoading,
    error,
    handlePageChange,
    refreshApplications,
  };
}