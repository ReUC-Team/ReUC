import { useState, useEffect } from "react";
import { fetchWithAuth } from "../../../lib/api/client.js";

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Hook para obtener la sesión actual del usuario autenticado
 * @returns {Object} { user, role, isLoading, error }
 */
export default function useCurrentUser() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetchWithAuth(`${API_URL}/auth/me`);
        
        setUser(response.data.user);
        setRole(response.data.role);
      } catch (err) {
        console.error("Error fetching current user:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  return { user, role, isLoading, error };
}