import { useEffect, useState } from "react";
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

  const fetchTeam = async () => {
    if (!projectUuid) {
      setError("UUID del proyecto no proporcionado");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const teamData = await getTeam(projectUuid);
      
      console.log("👥 Team data:", teamData);
      
      setTeam(teamData);
      setHasTeam(teamData?.members?.length > 0);
      
    } catch (err) {
      console.log("ℹ️ Info fetching team:", err.message);
      
      // Si el endpoint no existe, asumir equipo vacío (no mostrar error)
      if (err.message?.includes("Endpoint not implemented") || 
          err.message?.includes("Cannot GET") || 
          err.message?.includes("<!DOCTYPE")) {
        console.log("ℹ️ El endpoint GET /team no existe aún. Mostrando formulario para crear equipo.");
        setTeam({ members: [] });
        setHasTeam(false);
        setError(null); // NO mostrar error
      } else {
        // Solo mostrar error si es un error real (no 404)
        console.error("❌ Error real fetching team:", err);
        setTeam({ members: [] });
        setHasTeam(false);
        setError(null); // Por ahora, tampoco mostrar errores reales
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, [projectUuid]);

  const refreshTeam = () => {
    fetchTeam();
  };

  return { team, hasTeam, isLoading, error, refreshTeam };
}