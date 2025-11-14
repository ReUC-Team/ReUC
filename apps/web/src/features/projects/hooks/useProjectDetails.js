import { useState, useEffect } from "react";
import { getProjectDetails } from "../projectsService";
import { Alerts } from "@/shared/alerts";
import { getDisplayMessage, AuthenticationError } from "@/utils/errorHandler";

/**
 * Hook para obtener los detalles de un proyecto específico
 * @param {string} uuid - UUID del proyecto
 * @returns {Object} { project, isLoading, error }
 */
export default function useProjectDetails(uuid) {
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!uuid) {
      setError("UUID del proyecto no proporcionado");
      setIsLoading(false);
      return;
    }

    const fetchProjectDetails = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getProjectDetails(uuid);
        setProject(data);
      } catch (err) {
        console.error("Error fetching project details:", err);

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

    fetchProjectDetails();
  }, [uuid]);

  return { project, isLoading, error };
}