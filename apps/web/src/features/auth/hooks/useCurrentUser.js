import { useState, useEffect } from "react";
import { fetchWithAuth } from "../../../lib/api/client.js";

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Hook para obtener la sesión actual del usuario autenticado
 * @returns {Object} { user, role, isLoading, error }
 */
// Variables globales para caché y deduplicación
let cachedUser = null;
let cachedRole = null;
let fetchPromise = null;
let lastFetchTime = 0;
const CACHE_DURATION = 60000; // 1 minuto de caché

/**
 * Hook para obtener la sesión actual del usuario autenticado
 * Implementa caché y deduplicación para evitar errores 429
 * @returns {Object} { user, role, isLoading, error }
 */
export default function useCurrentUser() {
  const [user, setUser] = useState(cachedUser);
  const [role, setRole] = useState(cachedRole);
  const [isLoading, setIsLoading] = useState(!cachedUser);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      // Si tenemos datos en caché y son recientes, no hacer nada
      const now = Date.now();
      if (cachedUser && (now - lastFetchTime < CACHE_DURATION)) {
        setUser(cachedUser);
        setRole(cachedRole);
        setIsLoading(false);
        return;
      }

      // Si ya hay una petición en curso, esperar a que termine
      if (fetchPromise) {
        try {
          const data = await fetchPromise;
          setUser(data.user);
          setRole(data.role);
        } catch (err) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
        return;
      }

      // Inicia una nueva petición
      setIsLoading(true);
      fetchPromise = fetchWithAuth(`${API_URL}/auth/me`)
        .then(response => {
          cachedUser = response.data.user;
          cachedRole = response.data.role;
          lastFetchTime = Date.now();
          return { user: cachedUser, role: cachedRole };
        })
        .catch(err => {
          console.error("Error fetching current user:", err);
          throw err;
        })
        .finally(() => {
          fetchPromise = null; // Limpia la promesa al terminar
        });

      try {
        const data = await fetchPromise;
        setUser(data.user);
        setRole(data.role);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  return { user, role, isLoading, error };
}