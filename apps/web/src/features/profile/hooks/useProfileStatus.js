import { useState, useEffect } from "react";
import { getProfileStatus } from "../profileService";
import { AuthenticationError } from "@/utils/errorHandler";

export function useProfileStatus() {
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const data = await getProfileStatus();
        setIsComplete(data.status?.isComplete || false);
      } catch (err) {
        console.error("Error checking profile status:", err);
        
        // Si es error de autenticación, redirigir
        if (err instanceof AuthenticationError) {
          window.location.href = "/login";
          return;
        }
        
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    checkStatus();
  }, []);

  return { isComplete, isLoading, error };
}