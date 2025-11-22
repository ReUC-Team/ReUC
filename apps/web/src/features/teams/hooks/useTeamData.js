import { useEffect, useState, useCallback } from "react";
import { getTeam } from "../teamsService.js";

/**
 * Hook para obtener el equipo actual del proyecto
 * @param {string} projectUuid - UUID del proyecto
 * @returns {Object} { team, hasTeam, isLoading, error, refreshTeam }
 */
export default function useTeamData(projectUuid) {
  const [team, setTeam] = useState(null);
  const [hasTeam, setHasTeam] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Se us useCallback para evitar recrear la función
  const fetchTeam = useCallback(async () => {
    if (!projectUuid) {
      setError("UUID del proyecto no proporcionado");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const teamData = await getTeam(projectUuid);
            
      setTeam(teamData);
      setHasTeam(teamData?.members?.length > 0);
      
    } catch (err) {
      console.error("Error fetching team:", err);
      setTeam({ members: [] });
      setHasTeam(false);
      setError(null);
    } finally {
      setIsLoading(false);
    }
  }, [projectUuid]);

  useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

  return { team, hasTeam, isLoading, error, refreshTeam: fetchTeam };
}