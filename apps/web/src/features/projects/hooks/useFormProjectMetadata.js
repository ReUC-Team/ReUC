import { useEffect, useState } from "react";
import { getCreateMetadata } from "../projectsService.js";

export default function useFormProjectMetadata() {
  const [faculties, setFaculty] = useState([]);
  const [projectTypes, setProjectType] = useState([]);
  const [problemTypes, setProblemType] = useState([]);
  const [defaultBanners, setDefaultBanners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        setIsLoading(true);

        const metadata = await getCreateMetadata();


        setFaculty(metadata.faculties || []);
        setProjectType(metadata.projectTypes || []);
        setProblemType(metadata.problemTypes || []);
        setDefaultBanners(metadata.defaultBanners || []);

      } catch (err) {
        console.error("Error al obtener la metadata para el formulario:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetadata();
  }, []);

  return { 
    faculties, 
    projectTypes, 
    problemTypes, 
    defaultBanners,
    isLoading,
    error
  };
}