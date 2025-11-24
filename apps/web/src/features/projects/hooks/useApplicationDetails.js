import { useState, useEffect, useCallback } from "react";
import { getApplicationDetails } from "../projectsService";
import { Alerts } from "@/shared/alerts";
import { getDisplayMessage, AuthenticationError, NotFoundError } from "@/utils/errorHandler";
import { useNavigate } from "react-router-dom";

export default function useApplicationDetails(uuid) {
  const [application, setApplication] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchDetails = useCallback(async () => {
    if (!uuid) {
      setError("UUID de aplicación no proporcionado");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await getApplicationDetails(uuid);
      setApplication(data);
    } catch (err) {
      console.error("Error fetching application details:", err);

      if (err instanceof AuthenticationError) {
        Alerts.warning("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
        setTimeout(() => navigate("/login"), 2000);
        return;
      }

      if (err instanceof NotFoundError) {
        Alerts.error("Proyecto no encontrado");
        setTimeout(() => navigate("/explore-projects"), 2000);
        return;
      }

      const errorMessage = getDisplayMessage(err);
      setError(errorMessage);
      Alerts.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [uuid, navigate]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  return { 
    application, 
    isLoading, 
    error,
    refetch: fetchDetails // ✅ Exponer función para refrescar
  };
}