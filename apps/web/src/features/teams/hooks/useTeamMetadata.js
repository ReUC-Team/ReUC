import { useEffect, useState } from "react";
import { getTeamMetadata } from "../teamsService.js";
import { Alerts } from "../../../shared/alerts.js";
import { getDisplayMessage } from "../../../utils/errorHandler.js";

/**
 * Hook para obtener la metadata del equipo (roles y límites)
 * @param {string} projectUuid - UUID del proyecto
 * @returns {Object} { roles, constraints, isLoading, error }
 */
export default function useTeamMetadata(projectUuid) {
  const [roles, setRoles] = useState([]);
  const [constraints, setConstraints] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!projectUuid) {
      setError("UUID del proyecto no proporcionado");
      setIsLoading(false);
      return;
    }

    const fetchMetadata = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const metadata = await getTeamMetadata(projectUuid);
        
        console.log("🎯 Metadata RAW:", JSON.stringify(metadata, null, 2));
        
        /**
         * Estructura real del backend:
         * {
         *   "metadata": {
         *     "allowedRoles": [
         *       {
         *         "teamRoleId": 2,
         *         "name": "Asesor",
         *         "minCount": 0,
         *         "maxCount": null
         *       },
         *       {
         *         "teamRoleId": 1,
         *         "name": "Miembro",
         *         "minCount": 1,
         *         "maxCount": null
         *       }
         *     ]
         *   }
         * }
         */
        
        // Extraer allowedRoles
        const allowedRoles = metadata.metadata?.allowedRoles || [];
        
        if (allowedRoles.length === 0) {
          console.warn("⚠️ No hay roles disponibles en la metadata");
          setRoles([]);
          setConstraints({});
          setIsLoading(false);
          return;
        }
        
        console.log("📋 Allowed Roles:", allowedRoles);
        
        // Construir array de roles
        const rolesArray = allowedRoles.map(role => ({
          id: role.teamRoleId,
          name: role.name,
        }));
        
        // Construir objeto de constraints por nombre de rol
        const constraintsObj = {};
        allowedRoles.forEach(role => {
          constraintsObj[role.name] = {
            min: role.minCount ?? 0,
            max: role.maxCount ?? Infinity,
          };
        });
        
        console.log("✅ Roles procesados:", rolesArray);
        console.log("✅ Constraints procesados:", constraintsObj);
        
        setRoles(rolesArray);
        setConstraints(constraintsObj);
        
      } catch (err) {
        console.error("❌ Error fetching team metadata:", err);
        const errorMessage = getDisplayMessage(err);
        setError(errorMessage);
        Alerts.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetadata();
  }, [projectUuid]);

  return { roles, constraints, isLoading, error };
}