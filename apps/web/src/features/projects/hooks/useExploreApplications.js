import { useState, useEffect } from "react";
import { exploreApplications, getExploreApplicationsMetadata } from "../projectsService";
import { Alerts } from "@/shared/alerts";
import { getDisplayMessage, AuthenticationError } from "@/utils/errorHandler";

export default function useExploreApplications() {
  const [applications, setApplications] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [selectedFacultyId, setSelectedFacultyId] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 9,
    totalPages: 1,
    filteredItems: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar metadata (facultades disponibles)
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const metadata = await getExploreApplicationsMetadata();
        setFaculties(metadata.metadata.faculties || []);
      } catch (err) {
        console.error("Error loading faculties:", err);
        // No bloqueamos la UI si falla la metadata
      }
    };

    fetchMetadata();
  }, []);

  // Cargar aplicaciones cuando cambia la página o el filtro
  useEffect(() => {
    const fetchApplicationsData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await exploreApplications(
          selectedFacultyId,
          pagination.page,
          pagination.perPage
        );

        setApplications(data.applications);
        setPagination((prev) => ({
          ...prev,
          totalPages: data.pagination.totalPages,
          filteredItems: data.pagination.filteredItems,
        }));
      } catch (err) {
        console.error("Error fetching applications:", err);

        if (err instanceof AuthenticationError) {
          window.location.href = "/login";
          return;
        }

        const errorMessage = getDisplayMessage(err);
        setError(errorMessage);
        Alerts.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplicationsData();
  }, [selectedFacultyId, pagination.page, pagination.perPage]);

  const handleFacultyFilter = (facultyId) => {
    // Si ya está seleccionada, la quitamos (mostrar todas)
    if (selectedFacultyId === facultyId) {
      setSelectedFacultyId(null);
    } else {
      setSelectedFacultyId(facultyId);
    }
    // Reset a página 1 al cambiar filtro
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
      // Scroll al inicio de la lista
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return {
    applications,
    faculties,
    selectedFacultyId,
    pagination,
    isLoading,
    error,
    handleFacultyFilter,
    handlePageChange,
  };
}