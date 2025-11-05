import { useEffect, useState } from "react";
import { getProfile } from "../profileService.js";
import { Alerts } from "@/shared/alerts";
import { AuthenticationError, getDisplayMessage } from "@/utils/errorHandler";

export default function useGetProfile() {
  const [profile, setProfile] = useState({});
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data.profile || {});
      } catch (err) {
        console.error("useGetProfile error:", err);

        if (err instanceof AuthenticationError) {
          window.location.href = "/login";
          return;
        }

        Alerts.error(getDisplayMessage(err));
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return { profile, isLoading };
}
