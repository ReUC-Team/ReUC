import { useEffect, useState } from "react";
import { getProfile } from "../profileService.js";
import { Alerts } from "@/shared/alerts";

export default function useGetProfile() {
  const [profile, setProfile] = useState({});

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await getProfile();

        if (!response.success) {
          return;
        }

        setProfile(response.data);
      } catch (err) {
        console.log("useGetProfile", err);
        Alerts.error("Error inesperado al obtener los datos del perfil");
      }
    };

    fetchTables();
  }, []);

  return { profile };
}
